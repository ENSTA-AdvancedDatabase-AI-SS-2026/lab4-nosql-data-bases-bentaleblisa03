"""
TP3 - Exercice 2 : Ingestion de données IoT
Use Case : SmartGrid DZ - 10 000 capteurs, 5 minutes de mesures
"""
from cassandra.cluster import Cluster
from cassandra.query import BatchStatement, BatchType
import uuid
import random
from datetime import datetime, timedelta, timezone
import time

# Configuration
CASSANDRA_HOST = 'localhost'
KEYSPACE = 'smartgrid'
NB_CAPTEURS = 10000
MINUTES_HISTORIQUE = 5

CODES_ALERTE = ["SURCHARGE", "SOUS_TENSION", "SURTENSION", "SURCHAUFFE"]
BATCH_SIZE = 50

WILAYAS = ["Alger", "Oran", "Constantine", "Annaba", "Blida"]
COMMUNES = {
    "Alger": ["Bab Ezzouar", "Hydra", "El Harrach", "Dar El Beida"],
    "Oran": ["Bir El Djir", "Es Senia", "Arzew"],
    "Constantine": ["El Khroub", "Ain Smara", "Hamma Bouziane"],
    "Annaba": ["El Bouni", "El Hadjar", "Seraidi"],
    "Blida": ["Bougara", "Boufarik", "Larbaa"],
}

_insert_stmt = None  # prepared once, reused across all inserts


def connect():
    """Connexion au cluster Cassandra"""
    cluster = Cluster([CASSANDRA_HOST])
    session = cluster.connect(KEYSPACE)
    return session, cluster


def _prepare(session):
    global _insert_stmt
    if _insert_stmt is None:
        _insert_stmt = session.prepare("""
            INSERT INTO mesures_par_capteur
                (capteur_id, date_jour, timestamp, wilaya, commune,
                 tension_v, courant_a, puissance_kw, frequence_hz,
                 temperature, alerte, code_alerte)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """)
    return _insert_stmt


def _row(mesure):
    return (
        mesure["capteur_id"], mesure["date_jour"], mesure["timestamp"],
        mesure["wilaya"], mesure["commune"],
        mesure["tension_v"], mesure["courant_a"], mesure["puissance_kw"],
        mesure["frequence_hz"], mesure["temperature"],
        mesure["alerte"], mesure.get("code_alerte"),
    )


def generate_mesure(capteur_id, wilaya, commune, timestamp):
    """Générer une mesure réaliste pour un capteur"""
    tension_base = 220  # Volts (réseau algérien)
    
    return {
        "capteur_id": capteur_id,
        "date_jour": timestamp.date(),
        "timestamp": timestamp,
        "wilaya": wilaya,
        "commune": commune,
        # Variation normale ± 10V
        "tension_v": round(tension_base + random.gauss(0, 5), 2),
        "courant_a": round(random.uniform(0.5, 15.0), 2),
        "puissance_kw": round(random.uniform(0.1, 3.3), 3),
        "frequence_hz": round(50 + random.gauss(0, 0.1), 2),
        "temperature": round(random.uniform(20, 65), 1),
        # 5% de chance d'alerte
        "alerte": random.random() < 0.05,
    }


def insert_single(session, mesure):
    """Insérer une seule mesure dans mesures_par_capteur via prepared statement."""
    stmt = _prepare(session)
    session.execute(stmt, _row(mesure))


def insert_batch(session, mesures: list):
    """
    Insérer un batch de mesures avec UNLOGGED BATCH.
    UNLOGGED est correct ici : les lignes vont vers des partitions différentes,
    donc un LOGGED batch apporterait une surcharge inutile.
    """
    stmt = _prepare(session)
    for i in range(0, len(mesures), BATCH_SIZE):
        batch = BatchStatement(batch_type=BatchType.UNLOGGED)
        for mesure in mesures[i:i + BATCH_SIZE]:
            batch.add(stmt, _row(mesure))
        session.execute(batch)


def run_ingestion(session):
    """
    Générer et insérer NB_CAPTEURS × MINUTES_HISTORIQUE mesures.
    1. Générer les capteurs (ID aléatoires + assignation wilaya/commune)
    2. Pour chaque minute des MINUTES_HISTORIQUE dernières minutes
       → Insérer les mesures de tous les capteurs
    3. Mesurer et afficher :
       - Nombre total d'insertions
       - Durée totale
       - Débit (mesures/seconde)
    """
    print(f"Démarrage ingestion : {NB_CAPTEURS} capteurs × {MINUTES_HISTORIQUE} min")
    start = time.time()

    # 1. Générer les capteurs
    capteurs = [
        {
            "id": uuid.uuid4(),
            "wilaya": (w := random.choice(WILAYAS)),
            "commune": random.choice(COMMUNES[w]),
        }
        for _ in range(NB_CAPTEURS)
    ]

    # 2. Générer et insérer par tranche de BATCH_SIZE
    now = datetime.now(timezone.utc)
    pending = []

    for minute in range(MINUTES_HISTORIQUE):
        ts = now - timedelta(minutes=minute)
        for capteur in capteurs:
            mesure = generate_mesure(capteur["id"], capteur["wilaya"], capteur["commune"], ts)
            mesure["code_alerte"] = random.choice(CODES_ALERTE) if mesure["alerte"] else None
            pending.append(mesure)

            if len(pending) >= BATCH_SIZE:
                insert_batch(session, pending)
                pending.clear()

    if pending:
        insert_batch(session, pending)

    elapsed = time.time() - start
    total = NB_CAPTEURS * MINUTES_HISTORIQUE
    print(f"\n✅ {total:,} mesures insérées en {elapsed:.1f}s")
    print(f"   Débit : {total/elapsed:,.0f} mesures/seconde")


if __name__ == "__main__":
    session, cluster = connect()
    run_ingestion(session)
    cluster.shutdown()
