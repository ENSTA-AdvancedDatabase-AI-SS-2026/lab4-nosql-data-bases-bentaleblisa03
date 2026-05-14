"""
TP5 - Benchmark Comparatif NoSQL
Mesurer les performances de Redis, MongoDB, Cassandra, Neo4j
"""
import time
import statistics
import json
from typing import Callable, List, Tuple
import threading
import redis
from pymongo import MongoClient
from cassandra.cluster import Cluster
from cassandra.query import BatchStatement, BatchType
from neo4j import GraphDatabase

# ─── Utilitaires de mesure ────────────────────────────────────────────────────

def measure_latency(fn: Callable, iterations: int = 1000) -> dict:
    """
    Exécuter fn iterations fois et retourner les statistiques
    """
    latencies = []
    for _ in range(iterations):
        start = time.perf_counter()
        fn()
        latencies.append((time.perf_counter() - start) * 1000)  # en ms

    latencies.sort()
    return {
        "mean_ms":       statistics.mean(latencies),
        "p50_ms":        latencies[int(0.50 * len(latencies))],
        "p95_ms":        latencies[int(0.95 * len(latencies))],
        "p99_ms":        latencies[int(0.99 * len(latencies))],
        "max_ms":        max(latencies),
        "throughput_rps": 1000 / statistics.mean(latencies)
    }


def print_results(name: str, results: dict):
    print(f"\n{'='*50}")
    print(f" {name}")
    print(f"{'='*50}")
    for k, v in results.items():
        print(f"  {k:20s}: {v:.2f}")


# ─── Ex1 : Benchmark Écriture ─────────────────────────────────────────────────

def benchmark_write_redis(n: int = 100_000):
    """TODO: Insérer n enregistrements dans Redis et mesurer le débit"""
    r = redis.Redis(host='localhost', port=6379)
    r.flushdb()

    # TODO: Implémenter avec pipeline pour maximiser le débit
    start = time.perf_counter()
    pipe = r.pipeline(transaction=False)
    for i in range(n):
        pipe.hset(f"bench:user:{i}", mapping={"id": str(i), "name": f"User_{i}", "score": str(i % 100)})
        if (i + 1) % 1000 == 0:
            pipe.execute()
    pipe.execute()  # vider les commandes restantes
    elapsed = time.perf_counter() - start

    print_results("Redis — Écriture", {
        "records_insérés":  float(n),
        "elapsed_sec":      elapsed,
        "throughput_rps":   n / elapsed,
    })


def benchmark_write_mongodb(n: int = 100_000):
    """TODO: Insérer n documents dans MongoDB et mesurer le débit"""
    client = MongoClient("mongodb://admin:admin123@localhost:27017/")
    db = client["benchmark"]
    db.bench.drop()

    # TODO: Implémenter avec bulk_write pour maximiser le débit
    CHUNK = 1000
    start = time.perf_counter()
    for offset in range(0, n, CHUNK):
        db.bench.insert_many(
            [{"_id": i, "name": f"User_{i}", "score": i % 100, "category": i % 10}
             for i in range(offset, min(offset + CHUNK, n))],
            ordered=False
        )
    elapsed = time.perf_counter() - start

    print_results("MongoDB — Écriture", {
        "records_insérés":  float(n),
        "elapsed_sec":      elapsed,
        "throughput_rps":   n / elapsed,
    })
    client.close()


def benchmark_write_cassandra(n: int = 100_000):
    """TODO: Insérer n rows dans Cassandra et mesurer le débit"""
    # TODO: Utiliser des UNLOGGED BATCH
    cluster = Cluster(['localhost'])
    session = cluster.connect()

    session.execute("""
        CREATE KEYSPACE IF NOT EXISTS benchmark
        WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
    """)
    session.set_keyspace('benchmark')
    session.execute("""
        CREATE TABLE IF NOT EXISTS bench (
            id    INT PRIMARY KEY,
            name  TEXT,
            score INT
        )
    """)
    session.execute("TRUNCATE bench")

    stmt = session.prepare("INSERT INTO bench (id, name, score) VALUES (?, ?, ?)")
    BATCH_SIZE = 50

    start = time.perf_counter()
    batch = BatchStatement(batch_type=BatchType.UNLOGGED)
    count = 0
    for i in range(n):
        batch.add(stmt, (i, f"User_{i}", i % 100))
        count += 1
        if count % BATCH_SIZE == 0:
            session.execute(batch)
            batch = BatchStatement(batch_type=BatchType.UNLOGGED)
    if count % BATCH_SIZE != 0:  # vider le dernier batch partiel
        session.execute(batch)
    elapsed = time.perf_counter() - start

    print_results("Cassandra — Écriture", {
        "records_insérés":  float(n),
        "elapsed_sec":      elapsed,
        "throughput_rps":   n / elapsed,
    })
    cluster.shutdown()


# ─── Ex2 : Benchmark Lecture ─────────────────────────────────────────────────

def benchmark_read_redis():
    """TODO: Point lookup, range (ZRANGE), complex (pipeline multi-get)"""
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)

    # Amorcer un sorted set pour les range queries
    pipe = r.pipeline(transaction=False)
    for i in range(1000):
        pipe.zadd("bench:scores", {f"user:{i}": float(i)})
    pipe.execute()

    # Point lookup — accès direct à une clé par son nom
    point = measure_latency(lambda: r.hgetall("bench:user:500"))
    print_results("Redis — Point Lookup (HGETALL)", point)

    # Range query — top 100 du classement
    range_q = measure_latency(lambda: r.zrange("bench:scores", 0, 99, withscores=True))
    print_results("Redis — Range Query (ZRANGE top 100)", range_q)

    # Pipeline multi-get — 10 clés récupérées en un seul aller-retour réseau
    def multi_get():
        p = r.pipeline(transaction=False)
        for i in range(10):
            p.hgetall(f"bench:user:{i * 100}")
        p.execute()

    multi = measure_latency(multi_get, iterations=500)
    print_results("Redis — Pipeline 10× HGETALL", multi)


def benchmark_read_mongodb():
    """TODO: find_one, find avec range, aggregate pipeline"""
    client = MongoClient("mongodb://admin:admin123@localhost:27017/")
    db = client["benchmark"]

    # Index sur score pour accélérer les range queries
    db.bench.create_index("score")

    # Point lookup par _id (index primaire)
    point = measure_latency(lambda: db.bench.find_one({"_id": 500}))
    print_results("MongoDB — find_one (_id)", point)

    # Range query avec index secondaire
    range_q = measure_latency(
        lambda: list(db.bench.find({"score": {"$gte": 50, "$lte": 60}}))
    )
    print_results("MongoDB — Range Query (score 50-60)", range_q)

    # Aggregate pipeline — group + avg (requête analytique)
    agg = measure_latency(
        lambda: list(db.bench.aggregate([
            {"$group": {"_id": "$category", "count": {"$sum": 1}, "avg_score": {"$avg": "$score"}}}
        ])),
        iterations=200
    )
    print_results("MongoDB — Aggregate (group by category)", agg)

    client.close()


# ─── Ex3 : Charge concurrente ─────────────────────────────────────────────────

def benchmark_concurrent(db_fn: Callable, n_clients: int = 50, requests_per_client: int = 200):
    """
    TODO: Lancer n_clients threads simultanés
    Chaque thread effectue requests_per_client requêtes
    Mesurer les latences globales et la dégradation vs single client
    """
    all_latencies = []
    lock = threading.Lock()

    def worker():
        latencies = []
        for _ in range(requests_per_client):
            start = time.perf_counter()
            db_fn()
            latencies.append((time.perf_counter() - start) * 1000)
        with lock:
            all_latencies.extend(latencies)

    threads = [threading.Thread(target=worker) for _ in range(n_clients)]

    global_start = time.perf_counter()
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    total_elapsed = time.perf_counter() - global_start

    total_requests = n_clients * requests_per_client
    all_latencies.sort()

    print_results(f"Concurrent ({n_clients} clients × {requests_per_client} req)", {
        "mean_ms":       statistics.mean(all_latencies),
        "p50_ms":        all_latencies[int(0.50 * len(all_latencies))],
        "p95_ms":        all_latencies[int(0.95 * len(all_latencies))],
        "p99_ms":        all_latencies[int(0.99 * len(all_latencies))],
        "max_ms":        max(all_latencies),
        "throughput_rps": total_requests / total_elapsed,
    })


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("🚀 Benchmark NoSQL - Comparatif des 4 technologies")
    print("="*60)

    N = 10_000  # Réduire pour les tests, 100_000 pour la production

    print(f"\n📝 Benchmark Écriture ({N:,} enregistrements)")
    benchmark_write_redis(N)
    benchmark_write_mongodb(N)
    benchmark_write_cassandra(N)

    print(f"\n📖 Benchmark Lecture (1,000 requêtes)")
    benchmark_read_redis()
    benchmark_read_mongodb()

    print(f"\n⚡ Test Charge Concurrente (50 clients)")
    # Utilise Redis point lookup comme cible (faible latence, bon cas test)
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    benchmark_concurrent(lambda: r.hgetall("bench:user:500"), n_clients=50, requests_per_client=200)

    print("\n✅ Benchmark terminé ! Consultez RAPPORT.md pour l'analyse.")
