/**
 * TP2 - Exercice 1 : Modélisation MongoDB
 * Use Case : HealthCare DZ - Dossiers Médicaux
 */

// Se connecter à la base médicale
use("medical_db");

// ─── 1.1 : Créer la collection avec validation ────────────────────────────────
// TODO: Décommenter et compléter le validator $jsonSchema
db.createCollection("patients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cin", "nom", "prenom", "dateNaissance", "sexe"],
      properties: {
            cin: { bsonType: "string", description: "CIN obligatoire" },
            nom: { bsonType: "string", description: "Nom obligatoire" },
            prenom: { bsonType: "string", description: "Prénom obligatoire" },
            dateNaissance: { bsonType: "date", description: "Date de naissance obligatoire" },
            sexe: { bsonType: "string", description: "Sexe obligatoire" },       
            adresse: { bsonType: "object",  properties: {wilaya: { bsonType: "string" },commune: { bsonType: "string" }}},
            groupeSanguin: { bsonType: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
            antecedents: { bsonType: "array" },
            allergies: { bsonType: "array" },
            consultations: { bsonType: "array" }
  }
}
});

// ─── 1.2 : Insérer des patients avec données algériennes ──────────────────────
// TODO: Insérer au moins 20 patients avec :
// - Prénoms et noms algériens variés
// - Wilayas différentes (Alger, Oran, Constantine, Annaba, Blida...)
// - Pathologies courantes (Diabète, HTA, Asthme, etc.)
// - Au moins 2-5 consultations par patient
// - Dates réalistes sur les 2 dernières années

const patients = [
  {
    cin: "198001012300",
    nom: "Bensalem",
    prenom: "Ahmed",
    dateNaissance: new Date("1980-01-01"),
    sexe: "M",
    adresse: { wilaya: "Alger", commune: "Bab Ezzouar" },
    groupeSanguin: "O+",
    antecedents: ["Diabète type 2", "HTA"],
    allergies: ["Pénicilline"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2024-01-15"),
        medecin: { nom: "Dr. Mansouri", specialite: "Cardiologie" },
        diagnostic: "Hypertension artérielle",
        tension: { systolique: 145, diastolique: 92 },
        medicaments: [
          { nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }
        ],
        notes: "Surveillance tensionnelle recommandée"
      },
      {
        id: UUID(),
        date: new Date("2024-06-10"),
        medecin: { nom: "Dr. Mansouri", specialite: "Cardiologie" },
        diagnostic: "HTA stable",
        tension: { systolique: 135, diastolique: 85 },
        medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "60 jours" }],
        notes: "Amélioration notable"
      },
      {
        id: UUID(),
        date: new Date("2024-11-20"),
        medecin: { nom: "Dr. Khelifi", specialite: "Endocrinologie" },
        diagnostic: "Diabète type 2 déséquilibré",
        glycemie: 1.85,
        medicaments: [
          { nom: "Metformine", dosage: "850mg", duree: "90 jours" },
          { nom: "Glibenclamide", dosage: "5mg", duree: "90 jours" }
        ],
        notes: "Régime alimentaire strict conseillé"
      }
    ]
  },
  // TODO: Ajouter 19 autres patients
  {
    cin: "199205153416",
    nom: "Boudiaf",
    prenom: "Fatima",
    dateNaissance: new Date("1992-05-15"),
    sexe: "F",
    adresse: { wilaya: "Oran", commune: "Bir El Djir" },
    groupeSanguin: "A+",
    antecedents: ["Asthme"],
    allergies: ["Aspirine", "Acariens"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-09-05"),
        medecin: { nom: "Dr. Benali", specialite: "Pneumologie" },
        diagnostic: "Crise d'asthme modérée",
        medicaments: [
          { nom: "Salbutamol", dosage: "100mcg", duree: "À la demande" },
          { nom: "Béclométasone", dosage: "250mcg", duree: "60 jours" }
        ],
        notes: "Éviter les allergènes, inhalateur de secours prescrit"
      },
      {
        id: UUID(),
        date: new Date("2024-02-18"),
        medecin: { nom: "Dr. Benali", specialite: "Pneumologie" },
        diagnostic: "Asthme contrôlé",
        medicaments: [{ nom: "Béclométasone", dosage: "250mcg", duree: "90 jours" }],
        notes: "Bonne réponse au traitement"
      },
      {
        id: UUID(),
        date: new Date("2024-08-30"),
        medecin: { nom: "Dr. Meziane", specialite: "Allergologie" },
        diagnostic: "Rhinite allergique associée",
        medicaments: [{ nom: "Cétirizine", dosage: "10mg", duree: "30 jours" }],
        notes: "Bilan allergologique complet recommandé"
      }
    ]
  },
  {
    cin: "197503284412",
    nom: "Cherradi",
    prenom: "Karim",
    dateNaissance: new Date("1975-03-28"),
    sexe: "M",
    adresse: { wilaya: "Constantine", commune: "El Khroub" },
    groupeSanguin: "B+",
    antecedents: ["Insuffisance rénale chronique", "HTA"],
    allergies: [],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-11-12"),
        medecin: { nom: "Dr. Hadj Ali", specialite: "Néphrologie" },
        diagnostic: "IRC stade 3",
        medicaments: [
          { nom: "Losartan", dosage: "50mg", duree: "90 jours" },
          { nom: "Bicarbonate de sodium", dosage: "500mg", duree: "90 jours" }
        ],
        notes: "Régime hyposodé et hyperprotidique contrôlé"
      },
      {
        id: UUID(),
        date: new Date("2024-03-22"),
        medecin: { nom: "Dr. Hadj Ali", specialite: "Néphrologie" },
        diagnostic: "IRC stade 3 stable",
        medicaments: [{ nom: "Losartan", dosage: "50mg", duree: "90 jours" }],
        notes: "Créatinine stable à 2.1 mg/dL"
      },
      {
        id: UUID(),
        date: new Date("2024-09-14"),
        medecin: { nom: "Dr. Hadj Ali", specialite: "Néphrologie" },
        diagnostic: "Légère dégradation fonction rénale",
        medicaments: [
          { nom: "Losartan", dosage: "100mg", duree: "90 jours" },
          { nom: "Fer injectable", dosage: "100mg", duree: "5 séances" }
        ],
        notes: "Surveillance rapprochée, envisager dialyse si aggravation"
      }
    ]
  },
  {
    cin: "200012019875",
    nom: "Rahmani",
    prenom: "Nour El Houda",
    dateNaissance: new Date("2000-12-01"),
    sexe: "F",
    adresse: { wilaya: "Annaba", commune: "El Bouni" },
    groupeSanguin: "AB+",
    antecedents: ["Anémie ferriprive"],
    allergies: ["Sulfamides"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2024-01-08"),
        medecin: { nom: "Dr. Tabet", specialite: "Hématologie" },
        diagnostic: "Anémie ferriprive sévère",
        medicaments: [
          { nom: "Sulfate ferreux", dosage: "80mg", duree: "60 jours" },
          { nom: "Vitamine C", dosage: "500mg", duree: "60 jours" }
        ],
        notes: "Hémoglobine à 7.2 g/dL, régime riche en fer"
      },
      {
        id: UUID(),
        date: new Date("2024-04-15"),
        medecin: { nom: "Dr. Tabet", specialite: "Hématologie" },
        diagnostic: "Anémie en cours de correction",
        medicaments: [{ nom: "Sulfate ferreux", dosage: "80mg", duree: "30 jours" }],
        notes: "Hémoglobine remontée à 10.5 g/dL"
      },
      {
        id: UUID(),
        date: new Date("2024-10-03"),
        medecin: { nom: "Dr. Tabet", specialite: "Hématologie" },
        diagnostic: "Anémie corrigée",
        medicaments: [],
        notes: "Hémoglobine normale à 12.8 g/dL, traitement arrêté"
      }
    ]
  },
  {
    cin: "196807225541",
    nom: "Meziani",
    prenom: "Abdelkader",
    dateNaissance: new Date("1968-07-22"),
    sexe: "M",
    adresse: { wilaya: "Blida", commune: "Boufarik" },
    groupeSanguin: "O-",
    antecedents: ["Infarctus du myocarde", "Diabète type 2"],
    allergies: ["Iode"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-08-19"),
        medecin: { nom: "Dr. Ferhat", specialite: "Cardiologie" },
        diagnostic: "Post-IDM, suivi cardiologique",
        medicaments: [
          { nom: "Aspirine", dosage: "75mg", duree: "À vie" },
          { nom: "Atorvastatine", dosage: "40mg", duree: "À vie" },
          { nom: "Bisoprolol", dosage: "5mg", duree: "À vie" }
        ],
        notes: "ECG normal, fraction d'éjection 45%"
      },
      {
        id: UUID(),
        date: new Date("2024-02-05"),
        medecin: { nom: "Dr. Ferhat", specialite: "Cardiologie" },
        diagnostic: "Stable, légère dyspnée d'effort",
        medicaments: [
          { nom: "Aspirine", dosage: "75mg", duree: "À vie" },
          { nom: "Atorvastatine", dosage: "40mg", duree: "À vie" }
        ],
        notes: "Test d'effort à programmer"
      },
      {
        id: UUID(),
        date: new Date("2024-07-11"),
        medecin: { nom: "Dr. Khelifi", specialite: "Endocrinologie" },
        diagnostic: "Diabète déséquilibré HbA1c 8.2%",
        medicaments: [
          { nom: "Insuline Glargine", dosage: "20UI", duree: "90 jours" },
          { nom: "Metformine", dosage: "500mg", duree: "90 jours" }
        ],
        notes: "Introduction insuline basale"
      }
    ]
  },
  {
    cin: "198811073322",
    nom: "Belarbi",
    prenom: "Samira",
    dateNaissance: new Date("1988-11-07"),
    sexe: "F",
    adresse: { wilaya: "Sétif", commune: "Aïn Oulmane" },
    groupeSanguin: "A-",
    antecedents: ["Hypothyroïdie"],
    allergies: [],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-10-25"),
        medecin: { nom: "Dr. Saadi", specialite: "Endocrinologie" },
        diagnostic: "Hypothyroïdie primaire",
        medicaments: [{ nom: "Lévothyroxine", dosage: "50mcg", duree: "À vie" }],
        notes: "TSH à 12 mUI/L, contrôle dans 6 semaines"
      },
      {
        id: UUID(),
        date: new Date("2024-01-30"),
        medecin: { nom: "Dr. Saadi", specialite: "Endocrinologie" },
        diagnostic: "Hypothyroïdie partiellement compensée",
        medicaments: [{ nom: "Lévothyroxine", dosage: "75mcg", duree: "À vie" }],
        notes: "Augmentation de dose, TSH à 5.8 mUI/L"
      },
      {
        id: UUID(),
        date: new Date("2024-08-12"),
        medecin: { nom: "Dr. Saadi", specialite: "Endocrinologie" },
        diagnostic: "Euthyroïdie",
        medicaments: [{ nom: "Lévothyroxine", dosage: "75mcg", duree: "À vie" }],
        notes: "TSH normale à 1.9 mUI/L, équilibre atteint"
      }
    ]
  },
  {
    cin: "197106145678",
    nom: "Bouchenak",
    prenom: "Omar",
    dateNaissance: new Date("1971-06-14"),
    sexe: "M",
    adresse: { wilaya: "Tlemcen", commune: "Mansourah" },
    groupeSanguin: "B-",
    antecedents: ["BPCO", "Tabagisme"],
    allergies: ["Codéine"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-12-03"),
        medecin: { nom: "Dr. Benali", specialite: "Pneumologie" },
        diagnostic: "BPCO stade II",
        medicaments: [
          { nom: "Tiotropium", dosage: "18mcg", duree: "À vie" },
          { nom: "Formotérol", dosage: "12mcg", duree: "À vie" }
        ],
        notes: "Arrêt tabac impératif, réhabilitation respiratoire"
      },
      {
        id: UUID(),
        date: new Date("2024-05-17"),
        medecin: { nom: "Dr. Benali", specialite: "Pneumologie" },
        diagnostic: "Exacerbation aiguë BPCO",
        medicaments: [
          { nom: "Amoxicilline", dosage: "1g", duree: "7 jours" },
          { nom: "Prednisolone", dosage: "40mg", duree: "5 jours" }
        ],
        notes: "Hospitalisation évitée, surveillance 48h"
      },
      {
        id: UUID(),
        date: new Date("2024-10-29"),
        medecin: { nom: "Dr. Benali", specialite: "Pneumologie" },
        diagnostic: "BPCO stable post-exacerbation",
        medicaments: [{ nom: "Tiotropium", dosage: "18mcg", duree: "À vie" }],
        notes: "Patient a réduit tabac, spirométrie stable"
      }
    ]
  },
  {
    cin: "199509286543",
    nom: "Haddad",
    prenom: "Yasmine",
    dateNaissance: new Date("1995-09-28"),
    sexe: "F",
    adresse: { wilaya: "Béjaïa", commune: "Akbou" },
    groupeSanguin: "O+",
    antecedents: ["Migraine chronique"],
    allergies: ["AINS"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2024-03-07"),
        medecin: { nom: "Dr. Larbaoui", specialite: "Neurologie" },
        diagnostic: "Migraine sans aura",
        medicaments: [
          { nom: "Sumatriptan", dosage: "50mg", duree: "À la crise" },
          { nom: "Propranolol", dosage: "40mg", duree: "90 jours" }
        ],
        notes: "Journal des crises recommandé"
      },
      {
        id: UUID(),
        date: new Date("2024-07-22"),
        medecin: { nom: "Dr. Larbaoui", specialite: "Neurologie" },
        diagnostic: "Migraine chronique, fréquence réduite",
        medicaments: [
          { nom: "Topiramate", dosage: "25mg", duree: "90 jours" },
          { nom: "Sumatriptan", dosage: "50mg", duree: "À la crise" }
        ],
        notes: "Crises passées de 15 à 8 par mois"
      },
      {
        id: UUID(),
        date: new Date("2024-12-01"),
        medecin: { nom: "Dr. Larbaoui", specialite: "Neurologie" },
        diagnostic: "Bonne réponse prophylactique",
        medicaments: [{ nom: "Topiramate", dosage: "50mg", duree: "90 jours" }],
        notes: "Moins de 4 crises par mois"
      }
    ]
  },
  {
    cin: "196302099871",
    nom: "Hadj Aissa",
    prenom: "Mustapha",
    dateNaissance: new Date("1963-02-09"),
    sexe: "M",
    adresse: { wilaya: "Biskra", commune: "Tolga" },
    groupeSanguin: "AB-",
    antecedents: ["Diabète type 2", "Rétinopathie diabétique"],
    allergies: [],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-07-14"),
        medecin: { nom: "Dr. Khelifi", specialite: "Endocrinologie" },
        diagnostic: "Diabète déséquilibré, HbA1c 9.1%",
        medicaments: [
          { nom: "Insuline NPH", dosage: "30UI soir", duree: "90 jours" },
          { nom: "Metformine", dosage: "1000mg", duree: "90 jours" }
        ],
        notes: "Insulinothérapie intensifiée"
      },
      {
        id: UUID(),
        date: new Date("2024-01-20"),
        medecin: { nom: "Dr. Amrani", specialite: "Ophtalmologie" },
        diagnostic: "Rétinopathie diabétique non proliférante",
        medicaments: [],
        notes: "Photocoagulation laser programmée"
      },
      {
        id: UUID(),
        date: new Date("2024-06-05"),
        medecin: { nom: "Dr. Khelifi", specialite: "Endocrinologie" },
        diagnostic: "Amélioration glycémique HbA1c 7.8%",
        medicaments: [
          { nom: "Insuline Glargine", dosage: "24UI", duree: "90 jours" },
          { nom: "Metformine", dosage: "1000mg", duree: "90 jours" }
        ],
        notes: "Objectif HbA1c < 7% à atteindre"
      }
    ]
  },
  {
    cin: "198404161234",
    nom: "Zerrouki",
    prenom: "Leila",
    dateNaissance: new Date("1984-04-16"),
    sexe: "F",
    adresse: { wilaya: "Alger", commune: "Kouba" },
    groupeSanguin: "A+",
    antecedents: ["Lupus érythémateux systémique"],
    allergies: ["Pénicilline", "Soleil"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-09-28"),
        medecin: { nom: "Dr. Oussedik", specialite: "Rhumatologie" },
        diagnostic: "Lupus actif, poussée cutanéo-articulaire",
        medicaments: [
          { nom: "Hydroxychloroquine", dosage: "400mg", duree: "À vie" },
          { nom: "Prednisolone", dosage: "30mg", duree: "30 jours dégressif" }
        ],
        notes: "Protection solaire stricte, éviter UV"
      },
      {
        id: UUID(),
        date: new Date("2024-03-11"),
        medecin: { nom: "Dr. Oussedik", specialite: "Rhumatologie" },
        diagnostic: "Lupus en rémission partielle",
        medicaments: [
          { nom: "Hydroxychloroquine", dosage: "200mg", duree: "À vie" },
          { nom: "Prednisolone", dosage: "5mg", duree: "90 jours" }
        ],
        notes: "Diminution progressive corticoïdes"
      },
      {
        id: UUID(),
        date: new Date("2024-09-25"),
        medecin: { nom: "Dr. Oussedik", specialite: "Rhumatologie" },
        diagnostic: "Lupus stable",
        medicaments: [{ nom: "Hydroxychloroquine", dosage: "200mg", duree: "À vie" }],
        notes: "Rémission maintenue, bilan rénal normal"
      }
    ]
  },
  {
    cin: "199007073388",
    nom: "Brahimi",
    prenom: "Sofiane",
    dateNaissance: new Date("1990-07-07"),
    sexe: "M",
    adresse: { wilaya: "Médéa", commune: "Ksar El Boukhari" },
    groupeSanguin: "O+",
    antecedents: ["Épilepsie"],
    allergies: ["Carbamazépine"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-11-30"),
        medecin: { nom: "Dr. Larbaoui", specialite: "Neurologie" },
        diagnostic: "Épilepsie partielle complexe",
        medicaments: [{ nom: "Valproate de sodium", dosage: "500mg", duree: "À vie" }],
        notes: "Interdiction de conduire, éviter alcool"
      },
      {
        id: UUID(),
        date: new Date("2024-04-08"),
        medecin: { nom: "Dr. Larbaoui", specialite: "Neurologie" },
        diagnostic: "Épilepsie contrôlée, 0 crise en 4 mois",
        medicaments: [{ nom: "Valproate de sodium", dosage: "500mg", duree: "À vie" }],
        notes: "Bonne observance thérapeutique"
      },
      {
        id: UUID(),
        date: new Date("2024-10-14"),
        medecin: { nom: "Dr. Larbaoui", specialite: "Neurologie" },
        diagnostic: "Récidive convulsive suite à oubli traitement",
        medicaments: [
          { nom: "Valproate de sodium", dosage: "750mg", duree: "À vie" },
          { nom: "Lévétiracétam", dosage: "500mg", duree: "À vie" }
        ],
        notes: "Bithérapie instaurée, éducation thérapeutique renforcée"
      }
    ]
  },
  {
    cin: "197812204455",
    nom: "Djebbar",
    prenom: "Houria",
    dateNaissance: new Date("1978-12-20"),
    sexe: "F",
    adresse: { wilaya: "Tiaret", commune: "Sougueur" },
    groupeSanguin: "B+",
    antecedents: ["Polyarthrite rhumatoïde"],
    allergies: ["Méthotrexate (intolérance)"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2024-02-14"),
        medecin: { nom: "Dr. Oussedik", specialite: "Rhumatologie" },
        diagnostic: "PR active, DAS28 = 5.1",
        medicaments: [
          { nom: "Léflunomide", dosage: "20mg", duree: "90 jours" },
          { nom: "Prednisolone", dosage: "10mg", duree: "30 jours" }
        ],
        notes: "Intolérance au Méthotrexate, switch Léflunomide"
      },
      {
        id: UUID(),
        date: new Date("2024-06-28"),
        medecin: { nom: "Dr. Oussedik", specialite: "Rhumatologie" },
        diagnostic: "PR partiellement contrôlée, DAS28 = 3.8",
        medicaments: [{ nom: "Léflunomide", dosage: "20mg", duree: "90 jours" }],
        notes: "Amélioration clinique satisfaisante"
      },
      {
        id: UUID(),
        date: new Date("2024-11-05"),
        medecin: { nom: "Dr. Oussedik", specialite: "Rhumatologie" },
        diagnostic: "PR en faible activité, DAS28 = 2.6",
        medicaments: [{ nom: "Léflunomide", dosage: "10mg", duree: "90 jours" }],
        notes: "Réduction de dose, objectif rémission"
      }
    ]
  },
  {
    cin: "200203182211",
    nom: "Aissaoui",
    prenom: "Rania",
    dateNaissance: new Date("2002-03-18"),
    sexe: "F",
    adresse: { wilaya: "Jijel", commune: "Taher" },
    groupeSanguin: "A+",
    antecedents: ["Acné sévère"],
    allergies: [],
    consultations: [
      {
        id: UUID(),
        date: new Date("2024-01-22"),
        medecin: { nom: "Dr. Benhamou", specialite: "Dermatologie" },
        diagnostic: "Acné nodulo-kystique grade IV",
        medicaments: [
          { nom: "Isotrétinoïne", dosage: "20mg", duree: "6 mois" },
          { nom: "Doxycycline", dosage: "100mg", duree: "30 jours" }
        ],
        notes: "Contraception obligatoire, bilan hépatique mensuel"
      },
      {
        id: UUID(),
        date: new Date("2024-04-10"),
        medecin: { nom: "Dr. Benhamou", specialite: "Dermatologie" },
        diagnostic: "Réponse partielle à l'Isotrétinoïne",
        medicaments: [{ nom: "Isotrétinoïne", dosage: "30mg", duree: "3 mois" }],
        notes: "Augmentation de dose tolérée"
      },
      {
        id: UUID(),
        date: new Date("2024-09-16"),
        medecin: { nom: "Dr. Benhamou", specialite: "Dermatologie" },
        diagnostic: "Acné en nette régression",
        medicaments: [{ nom: "Isotrétinoïne", dosage: "20mg", duree: "2 mois" }],
        notes: "Fin de cure prévue en novembre"
      }
    ]
  },
  {
    cin: "196509301122",
    nom: "Belkacem",
    prenom: "Rachid",
    dateNaissance: new Date("1965-09-30"),
    sexe: "M",
    adresse: { wilaya: "Batna", commune: "Merouana" },
    groupeSanguin: "O+",
    antecedents: ["Cancer de la prostate", "HTA"],
    allergies: [],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-10-15"),
        medecin: { nom: "Dr. Amrani", specialite: "Urologie" },
        diagnostic: "Cancer prostate localisé T2N0M0",
        medicaments: [
          { nom: "Bicalutamide", dosage: "50mg", duree: "90 jours" },
          { nom: "Leuproréline", dosage: "3.75mg", duree: "Injection mensuelle" }
        ],
        notes: "Hormonothérapie néo-adjuvante, radiothérapie prévue"
      },
      {
        id: UUID(),
        date: new Date("2024-02-20"),
        medecin: { nom: "Dr. Amrani", specialite: "Urologie" },
        diagnostic: "Post-radiothérapie, PSA en baisse",
        medicaments: [{ nom: "Leuproréline", dosage: "3.75mg", duree: "Injection mensuelle" }],
        notes: "PSA à 0.8 ng/mL, bonne réponse"
      },
      {
        id: UUID(),
        date: new Date("2024-08-06"),
        medecin: { nom: "Dr. Amrani", specialite: "Urologie" },
        diagnostic: "Rémission biochimique",
        medicaments: [{ nom: "Leuproréline", dosage: "3.75mg", duree: "Injection mensuelle" }],
        notes: "PSA < 0.1 ng/mL, surveillance tous les 6 mois"
      }
    ]
  },
  {
    cin: "199308254499",
    nom: "Ouali",
    prenom: "Meriem",
    dateNaissance: new Date("1993-08-25"),
    sexe: "F",
    adresse: { wilaya: "Alger", commune: "Hydra" },
    groupeSanguin: "AB+",
    antecedents: ["Dépression majeure", "Anxiété généralisée"],
    allergies: ["Fluoxétine (intolérance)"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-12-10"),
        medecin: { nom: "Dr. Kaci", specialite: "Psychiatrie" },
        diagnostic: "Épisode dépressif majeur",
        medicaments: [
          { nom: "Sertraline", dosage: "50mg", duree: "90 jours" },
          { nom: "Alprazolam", dosage: "0.25mg", duree: "30 jours" }
        ],
        notes: "Psychothérapie cognitive-comportementale recommandée"
      },
      {
        id: UUID(),
        date: new Date("2024-03-25"),
        medecin: { nom: "Dr. Kaci", specialite: "Psychiatrie" },
        diagnostic: "Réponse partielle antidépressive",
        medicaments: [
          { nom: "Sertraline", dosage: "100mg", duree: "90 jours" },
          { nom: "Buspirone", dosage: "10mg", duree: "90 jours" }
        ],
        notes: "Augmentation dose, arrêt benzodiazépines"
      },
      {
        id: UUID(),
        date: new Date("2024-09-08"),
        medecin: { nom: "Dr. Kaci", specialite: "Psychiatrie" },
        diagnostic: "Rémission dépressive, anxiété résiduelle",
        medicaments: [{ nom: "Sertraline", dosage: "100mg", duree: "90 jours" }],
        notes: "Bonne évolution, continuer traitement 6 mois supplémentaires"
      }
    ]
  },
  {
    cin: "197002177766",
    nom: "Mebarki",
    prenom: "Abdelhak",
    dateNaissance: new Date("1970-02-17"),
    sexe: "M",
    adresse: { wilaya: "Skikda", commune: "Azzaba" },
    groupeSanguin: "O-",
    antecedents: ["Cirrhose hépatique", "Hépatite C chronique"],
    allergies: ["Interféron (intolérance)"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2024-01-09"),
        medecin: { nom: "Dr. Bensaid", specialite: "Gastro-entérologie" },
        diagnostic: "Hépatite C génotype 1b, F3",
        medicaments: [
          { nom: "Sofosbuvir", dosage: "400mg", duree: "12 semaines" },
          { nom: "Daclatasvir", dosage: "60mg", duree: "12 semaines" }
        ],
        notes: "AAD de 2ème génération, tolérance attendue excellente"
      },
      {
        id: UUID(),
        date: new Date("2024-04-20"),
        medecin: { nom: "Dr. Bensaid", specialite: "Gastro-entérologie" },
        diagnostic: "RVS12 atteinte, VHC indétectable",
        medicaments: [],
        notes: "Guérison virologique, surveillance hépatique continue"
      },
      {
        id: UUID(),
        date: new Date("2024-10-18"),
        medecin: { nom: "Dr. Bensaid", specialite: "Gastro-entérologie" },
        diagnostic: "Fibrose stable, pas de progression vers CHC",
        medicaments: [],
        notes: "Echo abdominale semestrielle, AFP normale"
      }
    ]
  },
  {
    cin: "198606282233",
    nom: "Gherbi",
    prenom: "Nawal",
    dateNaissance: new Date("1986-06-28"),
    sexe: "F",
    adresse: { wilaya: "Oran", commune: "Arzew" },
    groupeSanguin: "B+",
    antecedents: ["Syndrome des ovaires polykystiques", "Infertilité"],
    allergies: [],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-11-07"),
        medecin: { nom: "Dr. Meziane", specialite: "Gynécologie" },
        diagnostic: "SOPK avec hyperandrogénie",
        medicaments: [
          { nom: "Metformine", dosage: "850mg", duree: "90 jours" },
          { nom: "Spironolactone", dosage: "50mg", duree: "90 jours" }
        ],
        notes: "Perte de poids recommandée, bilan hormonal"
      },
      {
        id: UUID(),
        date: new Date("2024-02-29"),
        medecin: { nom: "Dr. Meziane", specialite: "Gynécologie" },
        diagnostic: "SOPK, stimulation ovulation",
        medicaments: [{ nom: "Clomifène", dosage: "50mg", duree: "5 jours J2-J6" }],
        notes: "Folliculométrie programmée"
      },
      {
        id: UUID(),
        date: new Date("2024-07-15"),
        medecin: { nom: "Dr. Meziane", specialite: "Gynécologie" },
        diagnostic: "Grossesse débutante suite stimulation",
        medicaments: [
          { nom: "Progestérone", dosage: "200mg", duree: "12 semaines" },
          { nom: "Acide folique", dosage: "5mg", duree: "12 semaines" }
        ],
        notes: "Grossesse gémellaire, suivi rapproché"
      }
    ]
  },
  {
    cin: "196011285544",
    nom: "Boudali",
    prenom: "Tahar",
    dateNaissance: new Date("1960-11-28"),
    sexe: "M",
    adresse: { wilaya: "Mostaganem", commune: "Aïn Tedles" },
    groupeSanguin: "A+",
    antecedents: ["AVC ischémique", "FA", "HTA"],
    allergies: [],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-08-01"),
        medecin: { nom: "Dr. Ferhat", specialite: "Cardiologie" },
        diagnostic: "AVC ischémique post-FA",
        medicaments: [
          { nom: "Rivaroxaban", dosage: "20mg", duree: "À vie" },
          { nom: "Ramipril", dosage: "5mg", duree: "À vie" },
          { nom: "Atorvastatine", dosage: "40mg", duree: "À vie" }
        ],
        notes: "Anticoagulation orale, rééducation neurologique"
      },
      {
        id: UUID(),
        date: new Date("2024-01-15"),
        medecin: { nom: "Dr. Larbaoui", specialite: "Neurologie" },
        diagnostic: "Séquelles motrices partielles, récupération en cours",
        medicaments: [{ nom: "Rivaroxaban", dosage: "20mg", duree: "À vie" }],
        notes: "Kiné 3 séances/semaine, orthophonie"
      },
      {
        id: UUID(),
        date: new Date("2024-07-30"),
        medecin: { nom: "Dr. Larbaoui", specialite: "Neurologie" },
        diagnostic: "Récupération fonctionnelle satisfaisante",
        medicaments: [{ nom: "Rivaroxaban", dosage: "20mg", duree: "À vie" }],
        notes: "Autonomie retrouvée, pas de récidive"
      }
    ]
  },
  {
    cin: "199711094477",
    nom: "Mansouri",
    prenom: "Amira",
    dateNaissance: new Date("1997-11-09"),
    sexe: "F",
    adresse: { wilaya: "Chlef", commune: "Ténès" },
    groupeSanguin: "O+",
    antecedents: ["Maladie de Crohn"],
    allergies: ["Mésalazine (intolérance)"],
    consultations: [
      {
        id: UUID(),
        date: new Date("2023-10-19"),
        medecin: { nom: "Dr. Bensaid", specialite: "Gastro-entérologie" },
        diagnostic: "Maladie de Crohn iléo-colique active",
        medicaments: [
          { nom: "Azathioprine", dosage: "100mg", duree: "À vie" },
          { nom: "Prednisolone", dosage: "40mg", duree: "30 jours dégressif" }
        ],
        notes: "Induction de rémission par corticoïdes"
      },
      {
        id: UUID(),
        date: new Date("2024-03-04"),
        medecin: { nom: "Dr. Bensaid", specialite: "Gastro-entérologie" },
        diagnostic: "Rémission partielle Crohn",
        medicaments: [{ nom: "Azathioprine", dosage: "100mg", duree: "À vie" }],
        notes: "Entretien par immunosuppresseur"
      },
      {
        id: UUID(),
        date: new Date("2024-08-22"),
        medecin: { nom: "Dr. Bensaid", specialite: "Gastro-entérologie" },
        diagnostic: "Crohn en rémission clinique et biologique",
        medicaments: [{ nom: "Azathioprine", dosage: "100mg", duree: "À vie" }],
        notes: "CRP normale, coloscopie de contrôle dans 1 an"
      }
    ]
  },
  {
    cin: "198209135566",
    nom: "Chikhi",
    prenom: "Hamza",
    dateNaissance: new Date("1982-09-13"),
    sexe: "M",
    adresse: { wilaya: "Alger", commune: "Bir Mourad Raïs" },
    groupeSanguin: "A-",
    antecedents: ["Psoriasis", "Arthrite psoriasique"],
    allergies: [],
    consultations: [
      {
        id: UUID(),
        date: new Date("2024-02-07"),
        medecin: { nom: "Dr. Benhamou", specialite: "Dermatologie" },
        diagnostic: "Psoriasis en plaques modéré-sévère PASI 15",
        medicaments: [
          { nom: "Méthotrexate", dosage: "15mg", duree: "Hebdomadaire, À vie" },
          { nom: "Acide folique", dosage: "5mg", duree: "6j/7, À vie" }
        ],
        notes: "Bilan hépatique et NFS mensuels"
      },
      {
        id: UUID(),
        date: new Date("2024-05-21"),
        medecin: { nom: "Dr. Benhamou", specialite: "Dermatologie" },
        diagnostic: "Réponse partielle au Méthotrexate PASI 10",
        medicaments: [
          { nom: "Méthotrexate", dosage: "20mg", duree: "Hebdomadaire, À vie" },
          { nom: "Acide folique", dosage: "5mg", duree: "6j/7, À vie" }
        ],
        notes: "Augmentation dose MTX"
      },
      {
        id: UUID(),
        date: new Date("2024-11-12"),
        medecin: { nom: "Dr. Oussedik", specialite: "Rhumatologie" },
        diagnostic: "Arthrite psoriasique périphérique active",
        medicaments: [
          { nom: "Méthotrexate", dosage: "20mg", duree: "Hebdomadaire, À vie" },
          { nom: "Étoricoxib", dosage: "60mg", duree: "30 jours" }
        ],
        notes: "Biothérapie anti-TNF à envisager si échec MTX"
      }
    ]
  }
];

db.patients.insertMany(patients);

const patientMap = {};
db.patients.find({}, { cin: 1 }).forEach(doc => { patientMap[doc.cin] = doc._id; });

// ─── 1.3 : Collection analyses (référencée) ───────────────────────────────────
// TODO: Créer des analyses pour les patients insérés
// Types : "Glycémie", "NFS", "Lipidogramme", "Créatinine", "ECG"

const analyses = [
  // TODO: Insérer des analyses avec patient_id référençant les patients
  {
    patient_id: patientMap["198001012300"],
    type: "Glycémie",
    date: new Date("2024-01-10"),
    resultats: { glycemie_a_jeun: 1.72, unite: "g/L" },
    valeurs_normales: { min: 0.7, max: 1.1 },
    statut: "Anormal",
    laboratoire: "Laboratoire Central Bab Ezzouar"
  },
  {
    patient_id: patientMap["198001012300"],
    type: "Lipidogramme",
    date: new Date("2024-01-10"),
    resultats: { cholesterol_total: 2.35, LDL: 1.60, HDL: 0.42, triglycerides: 1.85, unite: "g/L" },
    valeurs_normales: { cholesterol_total_max: 2.0, LDL_max: 1.3 },
    statut: "Anormal",
    laboratoire: "Laboratoire Central Bab Ezzouar"
  },
  {
    patient_id: patientMap["199205153416"],
    type: "NFS",
    date: new Date("2024-02-15"),
    resultats: { hemoglobine: 13.2, leucocytes: 7500, plaquettes: 280000, unite_hb: "g/dL" },
    valeurs_normales: { hb_min: 12.0, hb_max: 16.0 },
    statut: "Normal",
    laboratoire: "Laboratoire Bir El Djir Oran"
  },
  {
    patient_id: patientMap["197503284412"],
    type: "Créatinine",
    date: new Date("2024-03-20"),
    resultats: { creatinine: 2.1, uree: 0.78, DFG: 32, unite: "mg/dL" },
    valeurs_normales: { creatinine_max: 1.2, DFG_min: 60 },
    statut: "Anormal",
    laboratoire: "Laboratoire CHU Constantine"
  },
  {
    patient_id: patientMap["200012019875"],
    type: "NFS",
    date: new Date("2024-01-05"),
    resultats: { hemoglobine: 7.2, VGM: 68, TCMH: 20, leucocytes: 6800, plaquettes: 310000, unite_hb: "g/dL" },
    valeurs_normales: { hb_min: 12.0 },
    statut: "Anormal — Anémie microcytaire sévère",
    laboratoire: "Laboratoire CHU Annaba"
  },
  {
    patient_id: patientMap["200012019875"],
    type: "Ferritine",
    date: new Date("2024-01-05"),
    resultats: { ferritine: 4.2, fer_serique: 35, unite: "ng/mL" },
    valeurs_normales: { ferritine_min: 12 },
    statut: "Anormal — Carence martiale sévère",
    laboratoire: "Laboratoire CHU Annaba"
  },
  {
    patient_id: patientMap["196807225541"],
    type: "ECG",
    date: new Date("2023-08-17"),
    resultats: { rythme: "Sinusal", FC: 68, QRS: "Normal", onde_T: "Normale", segment_ST: "Normal" },
    statut: "Normal post-IDM",
    laboratoire: "Service Cardiologie CHU Blida"
  },
  {
    patient_id: patientMap["196807225541"],
    type: "Glycémie",
    date: new Date("2024-07-08"),
    resultats: { glycemie_a_jeun: 2.10, HbA1c: 8.2, unite: "g/L" },
    valeurs_normales: { glycemie_max: 1.10, HbA1c_max: 7.0 },
    statut: "Anormal — Diabète déséquilibré",
    laboratoire: "Laboratoire CHU Blida"
  },
  {
    patient_id: patientMap["198811073322"],
    type: "TSH",
    date: new Date("2023-10-22"),
    resultats: { TSH: 12.0, T4L: 8.5, unite: "mUI/L" },
    valeurs_normales: { TSH_min: 0.4, TSH_max: 4.0 },
    statut: "Anormal — Hypothyroïdie",
    laboratoire: "Laboratoire Sétif"
  },
  {
    patient_id: patientMap["198811073322"],
    type: "TSH",
    date: new Date("2024-08-10"),
    resultats: { TSH: 1.9, T4L: 14.2, unite: "mUI/L" },
    valeurs_normales: { TSH_min: 0.4, TSH_max: 4.0 },
    statut: "Normal — Euthyroïdie",
    laboratoire: "Laboratoire Sétif"
  },
  {
    patient_id: patientMap["199509286543"],
    type: "NFS",
    date: new Date("2024-03-05"),
    resultats: { hemoglobine: 13.8, leucocytes: 7200, plaquettes: 265000, unite_hb: "g/dL" },
    valeurs_normales: { hb_min: 12.0 },
    statut: "Normal",
    laboratoire: "Laboratoire Béjaïa"
  },
  {
    patient_id: patientMap["196302099871"],
    type: "Glycémie",
    date: new Date("2024-06-02"),
    resultats: { glycemie_a_jeun: 1.95, HbA1c: 7.8, unite: "g/L" },
    valeurs_normales: { glycemie_max: 1.10, HbA1c_max: 7.0 },
    statut: "Anormal — En cours d'amélioration",
    laboratoire: "Laboratoire CHU Biskra"
  },
  {
    patient_id: patientMap["196302099871"],
    type: "Fond d'oeil",
    date: new Date("2024-01-18"),
    resultats: { oeil_droit: "Rétinopathie non proliférante légère", oeil_gauche: "Rétinopathie non proliférante légère", macula: "Normale" },
    statut: "Anormal — Suivi ophtalmologique requis",
    laboratoire: "Service Ophtalmologie CHU Biskra"
  },
  {
    patient_id: patientMap["199308254499"],
    type: "NFS",
    date: new Date("2024-01-07"),
    resultats: { hemoglobine: 13.5, leucocytes: 8100, plaquettes: 240000 },
    statut: "Normal",
    laboratoire: "Laboratoire Alger Centre"
  },
  {
    patient_id: patientMap["197002177766"],
    type: "Bilan hépatique",
    date: new Date("2024-04-18"),
    resultats: { ASAT: 28, ALAT: 32, GGT: 45, bilirubine_totale: 12, TP: 88, unite: "UI/L" },
    valeurs_normales: { ASAT_max: 40, ALAT_max: 40 },
    statut: "Normal post-traitement VHC",
    laboratoire: "Laboratoire CHU Skikda"
  },
  {
    patient_id: patientMap["197002177766"],
    type: "Charge virale VHC",
    date: new Date("2024-04-18"),
    resultats: { ARN_VHC: "Indétectable", seuil_detection: "< 15 UI/mL" },
    statut: "RVS12 atteinte — Guérison virologique",
    laboratoire: "Laboratoire Virologie CHU Skikda"
  },
  {
    patient_id: patientMap["198606282233"],
    type: "Bilan hormonal",
    date: new Date("2023-11-04"),
    resultats: { LH: 8.5, FSH: 5.2, oestradiol: 42, testosterone_totale: 0.85, AMH: 4.2 },
    statut: "Anormal — Hyperandrogénie SOPK",
    laboratoire: "Laboratoire Oran"
  },
  {
    patient_id: patientMap["196011285544"],
    type: "ECG",
    date: new Date("2023-08-02"),
    resultats: { rythme: "Fibrillation auriculaire", FC: 92, QRS: "Normal", segment_ST: "Normal" },
    statut: "Anormal — FA persistante",
    laboratoire: "Service Cardiologie CHU Mostaganem"
  },
  {
    patient_id: patientMap["198209135566"],
    type: "NFS",
    date: new Date("2024-02-05"),
    resultats: { hemoglobine: 14.1, leucocytes: 6900, plaquettes: 210000 },
    statut: "Normal",
    laboratoire: "Laboratoire Alger Sud"
  },
  {
    patient_id: patientMap["198209135566"],
    type: "Bilan hépatique",
    date: new Date("2024-05-19"),
    resultats: { ASAT: 38, ALAT: 42, GGT: 55, bilirubine_totale: 10, unite: "UI/L" },
    valeurs_normales: { ASAT_max: 40, ALAT_max: 40 },
    statut: "Légèrement anormal — MTX hépatotoxicité surveiller",
    laboratoire: "Laboratoire Alger Sud"
  }
];

db.analyses.insertMany(analyses);

print("✅ Modélisation terminée. Patients insérés:", db.patients.countDocuments());
print("✅ Analyses insérées:", db.analyses.countDocuments());
