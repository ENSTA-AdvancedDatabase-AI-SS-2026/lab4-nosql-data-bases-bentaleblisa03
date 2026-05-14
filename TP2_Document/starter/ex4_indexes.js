/**
 * TP2 - Exercice 4 : Index et Optimisation
 */

use("medical_db");

// Requête de test (définie ici pour être utilisée avant et après les index)
const requeteTest = {
  "adresse.wilaya": "Alger",
  antecedents: "Diabète type 2"
};

// ─── 4.2 AVANT index ──────────────────────────────────────────────────────────
print("=== AVANT index ===");

const avant = db.patients.find(requeteTest).explain("executionStats");
print("nReturned:          ", avant.executionStats.nReturned);
print("totalDocsExamined:  ", avant.executionStats.totalDocsExamined);
print("executionTimeMillis:", avant.executionStats.executionTimeMillis + "ms");

// ─── 4.1 : Créer les index appropriés ────────────────────────────────────────

// Index 1 : Recherche fréquente par wilaya + antécédents
db.patients.createIndex({ "adresse.wilaya": 1, antecedents: 1 });

// Index 2 : Recherche par date de consultation
db.patients.createIndex({ "consultations.date": 1 });

// Index 3 : Texte sur diagnostics pour recherche full-text
db.patients.createIndex({ "consultations.diagnostic": "text" });

// Index 4 : Analyses par patient (lookup)
db.analyses.createIndex({ patient_id: 1 });

// ─── 4.2 APRÈS index ──────────────────────────────────────────────────────────
print("\n=== APRÈS index ===");

const apres = db.patients.find(requeteTest).explain("executionStats");
print("nReturned:          ", apres.executionStats.nReturned);
print("totalDocsExamined:  ", apres.executionStats.totalDocsExamined);
print("executionTimeMillis:", apres.executionStats.executionTimeMillis + "ms");

// ─── 4.4 : Index TTL pour archivage ───────────────────────────────────────────
// 5 ans = 5 * 365 * 24 * 60 * 60 = 157 680 000 secondes
db.analyses.createIndex(
  { date: 1 },
  { expireAfterSeconds: 157680000 }
);
