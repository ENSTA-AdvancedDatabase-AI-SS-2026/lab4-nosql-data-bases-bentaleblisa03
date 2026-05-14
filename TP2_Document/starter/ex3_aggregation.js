/**
 * TP2 - Exercice 3 : Pipelines d'Agrégation
 * Use Case : Statistiques médicales HealthCare DZ
 */

use("medical_db");

// ─── 3.1 : Distribution des diagnostics par wilaya ────────────────────────────
print("=== 3.1 : Top diagnostics par wilaya ===");

const diagParWilaya = db.patients.aggregate([
  // TODO: Étape 1 - $unwind sur consultations
  { $unwind: "$consultations" },
  // TODO: Étape 2 - $group par wilaya + diagnostic
  { $group: {
    _id: { wilaya: "$adresse.wilaya", diagnostic: "$consultations.diagnostic" },
    count: { $sum: 1 }
  }},
  // TODO: Étape 3 - $sort par count
  { $sort: { count: -1 } },
  // TODO: Étape 4 - $limit 20
  { $limit: 20 }
]).toArray();

printjson(diagParWilaya);

// ─── 3.2 : Médicament le plus prescrit par spécialité ─────────────────────────
print("\n=== 3.2 : Top médicaments par spécialité ===");

const medsParSpecialite = db.patients.aggregate([
  // TODO: $unwind consultations, puis $unwind medicaments
    { $unwind: "$consultations" },
    { $unwind: "$consultations.medicaments" },
  // $group par specialite + nom_medicament
     { $group: {
        _id: { specialite: "$consultations.medecin.specialite", medicament: "$consultations.medicaments.nom" },
        count: { $sum: 1 }
    }},
  // $sort + $group pour garder le top 1 par spécialité
    { $sort: { count: -1 } },
    { $group: {
        _id: "$_id.specialite",
        medicament: { $first: "$_id.medicament" },
        count: { $first: "$count" }
    }},
    { $sort: { count: -1 } },

    {
    $project: {
      _id: 0,
      specialite: "$_id",
      top_medicament: "$medicament",
      prescriptions: "$count"
    }}
]).toArray();

printjson(medsParSpecialite);

// ─── 3.3 : Évolution mensuelle des consultations ──────────────────────────────
print("\n=== 3.3 : Consultations par mois (12 derniers mois) ===");

const evolutionMensuelle = db.patients.aggregate([
  { $unwind: "$consultations" },
  { $match: {
    "consultations.date": {
      $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    }
  }},
  // TODO: $group par année + mois
    { $group: {
        _id: { year: { $year: "$consultations.date" }, month: { $month: "$consultations.date" } },
        count: { $sum: 1 }
    }},
  // TODO: $sort par date
  { $sort: { "_id.year": 1, "_id.month": 1 } },
  // TODO: $project pour formater la date en "YYYY-MM"
  { $project: {
    _id: 0,
    date: { $concat: [{ $toString: "$_id.year" }, "-", { $toString: { $cond: { if: { $lt: ["$_id.month", 10] }, then: { $concat: ["0", { $toString: "$_id.month" }] }, else: { $toString: "$_id.month" } } } }] },
    count: 1
  }}
]).toArray();

// ─── 3.4 : Patients à risque multiple ────────────────────────────────────────
print("\n=== 3.4 : Profil patients à risque élevé ===");

const patientsRisque = db.patients.aggregate([
  { $match: { antecedents: { $all: ["Diabète type 2", "HTA"] } } },
  // TODO: $addFields pour calculer l'âge et le nombre de consultations
    { $addFields: {
        age: { $divide: [{ $subtract: [new Date(), "$dateNaissance"] }, 365 * 24 * 60 * 60 * 1000] },
        nb_consultations: { $size: "$consultations" }
    }},
  { $match: { age: { $gt: 60 } } },
  // TODO: $group pour les statistiques globales
    { $group: {
        _id: null,
        total_patients: { $sum: 1 },
        total_consultations: { $sum: "$nb_consultations" }
    }}
]).toArray();

// ─── 3.5 : Rapport médecins ───────────────────────────────────────────────────
print("\n=== 3.5 : Top 5 médecins & taux de ré-consultation ===");

const rapportMedecins = db.patients.aggregate([
  { $unwind: "$consultations" },
  // TODO: $group par médecin, compter patients uniques et consultations totales
  { $group: {
    _id: "$consultations.medecin",
    patients_uniques: { $addToSet: "$_id" },
    total_consultations: { $sum: 1 }
  }},
  // TODO: $addFields pour calculer le taux de ré-consultation
    { $addFields: {
        patients_uniques_count: { $size: "$patients_uniques" }
    }},
    { $addFields: {
        taux_reconsultation: {
            $multiply: [{ $divide: [{ $subtract: ["$total_consultations", "$patients_uniques_count"] }, "$patients_uniques_count"] }, 100]
        }
    }},
  // = (total_consultations - patients_uniques) / patients_uniques * 100
  // TODO: $sort + $limit 5
  { $sort: { taux_reconsultation: -1 } },
  { $limit: 5 }
]).toArray();

printjson(rapportMedecins);
