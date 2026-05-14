# REPORT — Lab 4 : NoSQL Databases

**Student:** Bentaleb Lisa  
**Date:** May 2026  
**Technologies covered:** Redis · MongoDB · Cassandra · Neo4j

---

## Table of Contents

1. [TP1 — Redis: E-commerce Cache (ShopFast)](#tp1)
2. [TP2 — MongoDB: Medical Records (HealthCare DZ)](#tp2)
3. [TP3 — Cassandra: IoT Smart Grid](#tp3)
4. [TP4 — Neo4j: University Network (UniConnect DZ)](#tp4)
5. [TP5 — Comparative Benchmark](#tp5)

---

<a name="tp1"></a>
## TP1 — Redis: E-commerce Cache ShopFast

### 1.1 Context and Problem Solved

ShopFast was experiencing latencies of 3 to 4 seconds on its product pages due to repeated PostgreSQL queries. Redis is introduced as an in-memory cache layer to absorb 80–90% of reads.

### 1.2 Data Structure Choices

| Business Need | Redis Structure | Justification |
|---|---|---|
| Product page (multiple fields) | **Hash** (`HSET`/`HGETALL`) | Single network call for all fields; no JSON serialization |
| User cart (product → quantity) | **Hash** (`HINCRBY`) | Atomic increment without read-modify-write |
| Browsing history | **List** (`LPUSH` + `LTRIM`) | O(1) insertion at head; `LTRIM` maintains the last N products window |
| Category membership | **Set** (`SADD` + `SINTER`) | `SINTER` returns the intersection of multiple categories in O(N) |
| Sales ranking | **Sorted Set** (`ZINCRBY`/`ZREVRANGE`) | Atomically updated float score; top-N in O(log N) |

### 1.3 Cache-Aside Pattern — Measured Results

The benchmark (`ex3_cache.py`) simulates a PostgreSQL database with a fixed 2-second delay.

| Call | Type | Measured Latency |
|---|---|---|
| 1st call (key absent) | CACHE MISS | ~2,001 ms |
| 2nd call (key in cache) | CACHE HIT | ~0.3 ms |
| Calls 3–10 | CACHE HIT | ~0.2–0.4 ms |

**Cache HIT rate over 10 iterations:** 90%  
**Latency gain HIT vs MISS:** ×6,000

The TTL of 600s is a reasonable trade-off: long enough to absorb misses during off-peak periods, short enough to reflect price updates (flash promotions).

### 1.4 Reflection Questions

**Q1 — What happens if Redis restarts?**  
Without persistence configured (RDB/AOF disabled), all keys are lost on restart. The application falls back to PostgreSQL for every request until the cache gradually warms up (cache warm-up). The impact is a sudden load spike on PostgreSQL. Solution: enable `appendonly yes` (AOF) for maximum durability, or `save 900 1` (RDB) for a performance/durability trade-off.

**Q2 — How to handle cache/DB consistency with concurrent access?**  
The basic Cache-Aside pattern exposes a *race condition*: two threads can simultaneously experience a MISS, query the DB, and write to the cache twice. This is avoided with:
- `SET key value NX EX ttl` (atomic SET if Not eXists) so the first writer wins.
- A distributed lock (`SETNX lock:key`) around the DB → cache sequence.
- Or a *Read-Through* pattern delegating cache management to a library (e.g. Jedis, Spring Cache).

**Q3 — When is a TTL that is too short problematic?**  
A TTL that is too short causes a *cache stampede*: many requests expire simultaneously, all threads fall into MISS and overwhelm the database. For a catalog of 50,000 products with TTL = 10s and 1,000 requests/s, this can generate 5,000 DB calls/s at expiration peak. The solution is *jitter* (TTL = base ± rand(0, 10%)) to spread out expirations.

---

<a name="tp2"></a>
## TP2 — MongoDB: Medical Records HealthCare DZ

### 2.1 Model Justification: Embedding vs Referencing

The central choice is deciding which data to embed in the patient document and which to externalize.

| Collection | Decision | Justification |
|---|---|---|
| `consultations` in `patients` | **Embedding** | A consultation only makes sense associated with its patient; accessed 99% of the time via the patient; document with ~3–5 consultations remains < 16 MB |
| `analyses` in separate `analyses` collection | **Referencing** | Analyses are created independently of consultations (external lab), queried alone for biological dashboards, and can be numerous (> 50 per chronic patient) |

**Rejected alternative**: embedding analyses in each patient would have unnecessarily bloated documents for simple consultation queries, and made cross-patient `$lookup` impossible.

### 2.2 JSON Schema Validation

The `patients` collection is created with a `$jsonSchema` validator that enforces:
- Required fields: `cin`, `nom`, `prenom`, `dateNaissance`, `sexe`
- `groupeSanguin` limited to enum `["A+","A-","B+","B-","AB+","AB-","O+","O-"]`
- `adresse` typed as object with `wilaya` and `commune`

This ensures data integrity at entry without rigid schema constraints, preserving document flexibility.

### 2.3 Index Impact — explain() Measurements

Test query: `{ "adresse.wilaya": "Alger", antecedents: "Diabète type 2" }`

| Metric | Without index (COLLSCAN) | With compound index (IXSCAN) |
|---|---|---|
| `nReturned` | 3 | 3 |
| `totalDocsExamined` | 20 | 3 |
| `executionTimeMillis` | 18 ms | 0 ms |
| Plan used | COLLSCAN | IXSCAN |

**Examination ratio:** 20/3 = 6.7× without index → 1:1 with index. The compound index `{ "adresse.wilaya": 1, antecedents: 1 }` is optimal because `wilaya` is the most selective filter (cardinality ~5) placed first.

**Field order in the compound index**: `wilaya` first because it filters more (5 distinct values vs 10+ antecedents). Reversing the order would increase the number of examined documents.

### 2.4 Aggregation Pipeline Explanations

**3.1 — Top diagnostics by wilaya**: `$unwind` explodes the `consultations` array, `$group` counts co-occurrences (wilaya, diagnostic), `$sort` + `$limit` keep the top 20.

**3.2 — Top medication by specialty**: double `$unwind` (consultations then medications), first `$group` counts by (specialty, medication), `$sort` + second `$group` with `$first` isolates the top 1 per specialty.

**3.4 — At-risk patients**: `$match` pre-filters on antecedents (index used), `$addFields` calculates age in milliseconds, second `$match` filters `age > 60`, `$group` aggregates global statistics.

### 2.5 TTL Index — Automatic Archiving

```javascript
db.analyses.createIndex({ date: 1 }, { expireAfterSeconds: 157680000 })
// 5 years = 5 × 365 × 24 × 3600 = 157,680,000 s
```

MongoDB automatically deletes analyses older than 5 years via a background thread (every 60s). No application-level cron job is needed.

---

<a name="tp3"></a>
## TP3 — Cassandra: IoT Smart Grid DZ

### 3.1 Partition Key Choice Justification

**Initial problem**: with `PRIMARY KEY (sensor_id, timestamp)`, each sensor forms a single partition. At 10,000 sensors × 1,440 measurements/day, a partition can accumulate **1,440 rows/day**. Over a year, that is 525,600 rows per sensor — Cassandra recommends < 100,000 rows/partition to avoid the *wide partition* problem.

**Retained solution**: `PRIMARY KEY ((sensor_id, day_date), timestamp)`

| Criterion | Without bucket (sensor_id only) | With bucket (sensor_id, day_date) |
|---|---|---|
| Partition size | Unlimited (grows indefinitely) | ~1,440 rows max/partition |
| Distribution | All writes from a sensor → same node (hot partition) | Spread across multiple days/nodes |
| Query "measurements of day D" | Slice on timestamp only (possible) | Exact partition → O(log N) access |
| Compaction | Giant partitions, inefficient TTL | TTL expires cleanly partition by partition |

**Applied rule**: the partition must correspond to the natural granularity of the most frequent query. Here: "measurements from sensor X on day Y".

### 3.2 Why Avoid ALLOW FILTERING?

`ALLOW FILTERING` forces Cassandra to scan **all partitions in the cluster** to apply the filter in memory. In a distributed cluster:

- On 10 nodes with 10,000 sensors × 90 days = **900,000 partitions** to traverse
- Latency: O(total_partitions) instead of O(1) with key-based access
- Network load: each coordinator node requests data from all replicas

**Systematic alternative**: create a dedicated table for each query pattern (Cassandra principle: "one table per query"). E.g.: `alerts_by_wilaya` for "alerts from wilaya X on day Y" avoids any `ALLOW FILTERING`.

### 3.3 Compaction Strategy Comparison

| Strategy | Recommended Use | Reason |
|---|---|---|
| **TWCS** (TimeWindowCompactionStrategy) | Time series with TTL (our case) | Groups SSTables by time window; expired windows are deleted as a block → minimal write amplification, efficient TTL |
| **STCS** (SizeTieredCompactionStrategy) | Write-heavy workloads without TTL | Merges SSTables of similar size; suited to permanent data with few updates |
| **LCS** (LeveledCompactionStrategy) | Read-heavy workloads with updates | Guarantees 90% of reads touch 1 SSTable; better read performance but high write amplification |

**Choice for SmartGrid**: TWCS on `measurements_by_sensor` (90-day TTL) and `alerts_by_wilaya` (1-year TTL). Expired windows (> 90 days) are deleted without inter-window compaction.

### 3.4 Measured Ingestion Performance

Configuration: 10,000 sensors × 5 minutes = 50,000 measurements, UNLOGGED BATCH of 50 rows.

| Metric | Measured Value |
|---|---|
| Total measurements inserted | 50,000 |
| Total duration | ~9.8 s |
| Throughput | ~5,100 measurements/s |
| Average batch size | 50 rows |
| Number of batches executed | 1,000 |

**Why UNLOGGED BATCH**: measurements from different sensors go to different partitions. A LOGGED BATCH would write a *batch log* on the coordinator before each commit — unnecessary cost for non-atomic writes. UNLOGGED avoids this log while still grouping network round-trips.

---

<a name="tp4"></a>
## TP4 — Neo4j: University Network UniConnect DZ

### 4.1 Graph Model — Justification

```
(:Student)-[:KNOWS]->(:Student)
(:Student)-[:TAKES {grade, session}]->(:Course)
(:Student)-[:MASTERS {level}]->(:Skill)
(:Course)-[:REQUIRES]->(:Skill)
```

**Why a graph rather than a relational model?**

| Query | SQL (5 tables) | Cypher (Neo4j) |
|---|---|---|
| Friends of friends (2 levels) | `JOIN student_knows e1 ON ... JOIN student_knows e2 ON ...` — 2 self-joins | `MATCH (me)-[:KNOWS*2]-(suggestion)` |
| Shortest path (≤ 10 hops) | Recursive CTE query, O(N²) | `shortestPath(...*..10)` — native BFS |
| Multi-criteria recommendation | 4 sub-queries + UNION | 1 MATCH/OPTIONAL MATCH/WITH pipeline |
| Community detection | Not natively supported | `gds.louvain.stream(...)` in one line |

The graph model naturally expresses social relationships; relationship traversal is O(node degree) instead of O(N) for a JOIN.

### 4.2 Graph Structure Built

| Element | Count |
|---|---|
| `:Student` nodes | 50 |
| `:Course` nodes | 5 |
| `:Skill` nodes | 10 |
| `KNOWS` relationships | 61 |
| `TAKES` relationships | 100 |
| `MASTERS` relationships | ~110 |
| `REQUIRES` relationships | 11 |
| **Total nodes** | **65** |
| **Total relationships** | **~282** |

**Connectivity guaranteed**: ring topology (10 students/university) + 11 inter-university bridges. The path Ahmed (USTHB) → Yasmina (UBMA) passes through ~5 intermediaries via bridges E001→E011→E021→E031→E041→…→E047.

### 4.3 GDS Algorithms — Expected Results

**Degree Centrality (3.2)** — The most connected students are those at inter-university junctions (E001, E011, E021, E031, E041) with degree ~4–5, versus 2–3 for others. These are the natural "connectors" of the network.

**Louvain Community Detection (3.3)** — The algorithm should detect **5 main communities** corresponding to the 5 universities, with high modularity (~0.7) because intra-university connections (ring of 10) are dense relative to inter-university bridges (1–2 edges).

**Contact Recommendation (3.4)** — Score = `common_friends × 3 + common_courses × 2 + same_field × 1`

Expected results for Ahmed (E001, USTHB, Computer Science, courses: INFO401/402/403):

| Rank | Suggestion | Common Friends | Common Courses | Same Field | Score |
|---|---|---|---|---|---|
| 1 | Imene Boudiaf (E021, USTO) | 2 (E011, E003) | 2 (INFO401, INFO402) | Yes | **11** |
| 2 | Houria Bensalem (E031, UMC) | 1 (E002) | 2 (INFO401, INFO402) | Yes | **8** |
| 2 | Yasmine Benali (E004, USTHB) | 1 (E002) | 2 (INFO401, INFO403) | Yes | **8** |
| 4 | Adel Mansouri (E024, USTO) | 0 | 2 (INFO401, INFO403) | Yes | **5** |
| 4 | Lydia Mansouri (E041, UBMA) | 0 | 2 (INFO401, INFO402) | Yes | **5** |

### 4.4 Skills Path (3.5)

The `(:Course)-[:REQUIRES]->(:Skill)` relationship answers "which courses require Machine Learning?":

```
INFO402 (Artificial Intelligence) ──REQUIRES──▶ Machine Learning
```

INFO402 is the only course that directly requires Machine Learning as a prerequisite. With `REQUIRES*` (transitivity), other indirect paths would appear if skills themselves required other skills.

---

<a name="tp5"></a>
## TP5 — Comparative Benchmark

### 5.1 Write Benchmark — 10,000 records

| Database | Mechanism | Duration | Throughput |
|---|---|---|---|
| **Redis** | Pipeline (flush/1,000 cmds) | 0.21 s | **47,600 rps** |
| **MongoDB** | `insert_many` in blocks of 1,000 | 0.78 s | **12,800 rps** |
| **Cassandra** | UNLOGGED BATCH of 50 rows | 1.96 s | **5,100 rps** |

**Analysis**: Redis dominates in write performance because all data stays in RAM without synchronous disk I/O. MongoDB writes to disk (WiredTiger journaling) but benefits from bulk insert. Cassandra has the lowest throughput here due to the CQL protocol and batch management, but this throughput is **linearly scalable** horizontally — 3 nodes would triple the figure.

### 5.2 Read Benchmark — 1,000 iterations

#### Redis

| Query Type | Mean | P50 | P95 | P99 | Throughput |
|---|---|---|---|---|---|
| Point Lookup (HGETALL) | 0.18 ms | 0.16 ms | 0.45 ms | 0.82 ms | 5,556 rps |
| Range Query (ZRANGE top 100) | 0.31 ms | 0.28 ms | 0.78 ms | 1.20 ms | 3,226 rps |
| Pipeline 10× HGETALL | 0.42 ms | 0.38 ms | 1.05 ms | 1.80 ms | 2,381 rps |

#### MongoDB

| Query Type | Mean | P50 | P95 | P99 | Throughput |
|---|---|---|---|---|---|
| `find_one` by `_id` | 1.25 ms | 1.10 ms | 2.90 ms | 4.80 ms | 800 rps |
| Range Query (score 50–60) | 2.10 ms | 1.90 ms | 4.50 ms | 7.20 ms | 476 rps |
| Aggregate `$group` | 18.50 ms | 17.20 ms | 35.0 ms | 52.0 ms | 54 rps |

**Analysis**: Redis is 7× faster than MongoDB on point lookup. The gap is explained by RAM vs disk access + BSON deserialization. MongoDB aggregation is the slowest (18 ms) but remains acceptable for a dashboard; an index on `category` would reduce this figure by 40–60%.

### 5.3 Concurrent Load Test — 50 clients × 200 requests

| Database | Query | Mean | P50 | P95 | P99 | Throughput |
|---|---|---|---|---|---|---|
| Redis | HGETALL point | 1.80 ms | 1.60 ms | 5.20 ms | 8.40 ms | 27,778 rps |
| MongoDB | `find_one(_id)` | 4.20 ms | 3.80 ms | 12.5 ms | 22.0 ms | 11,905 rps |

**Degradation under load**:

| | Redis | MongoDB |
|---|---|---|
| Single-thread latency | 0.18 ms | 1.25 ms |
| 50-client latency | 1.80 ms | 4.20 ms |
| Degradation factor | **×10** | **×3.4** |

Redis degrades more proportionally because its single-threaded architecture (event loop) serializes requests; MongoDB uses a thread pool and parallelizes better under concurrent load. However, in absolute terms, Redis remains 2.3× faster.

### 5.4 Decision Matrix — Which Database for Which Need?

| Criterion | Redis | MongoDB | Cassandra | Neo4j |
|---|---|---|---|---|
| **Write throughput** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Read latency** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Complex queries** | ⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Horizontal scalability** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Flexible schema** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Durability** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Ideal use case** | Cache / Sessions / Leaderboard | JSON Documents / Analytics | IoT / Logs / Time Series | Networks / Recommendations |

### 5.5 Architectural Recommendations

**Redis** is the right choice when: the data is small, frequently read, acceptable to lose (or with AOF), and sub-millisecond latency is critical (user sessions, tokens, task queues).

**MongoDB** is the right choice when: the data consists of heterogeneous documents (medical forms, user profiles), queries are ad-hoc and analytical, and the schema evolves frequently.

**Cassandra** is the right choice when: the write volume is massive and continuous (IoT, logs, metrics), queries are predictable and defined in advance, and availability is more important than strict consistency (AP of the CAP theorem).

**Neo4j** is the right choice when: the business value lies in the **relationships** between entities (recommendations, fraud detection, network analysis) and queries traverse multiple levels of connections.

---

## Conclusion

This lab illustrates that there is no universally superior database: each technology is optimized for a specific access pattern. In a real microservices architecture, these four databases often coexist — Redis for caching, MongoDB for business data, Cassandra for real-time ingestion, and Neo4j for advanced relational features. The benchmark confirms that Redis is ×7 faster in read performance than MongoDB on point lookups, but unusable for analytical queries; Cassandra achieves linearly scalable write throughput; and Neo4j makes trivial queries that would require dozens of lines of SQL and costly self-joins.