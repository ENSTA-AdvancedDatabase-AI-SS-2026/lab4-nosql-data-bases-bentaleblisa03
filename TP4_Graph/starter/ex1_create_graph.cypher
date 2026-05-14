// TP4 - Exercice 1 : Création du graphe UniConnect DZ
// Effacer la base pour partir propre
MATCH (n) DETACH DELETE n;

// ─── 1.1 : Contraintes d'unicité ─────────────────────────────────────────────
CREATE CONSTRAINT etudiant_id IF NOT EXISTS FOR (e:Etudiant) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT cours_code IF NOT EXISTS FOR (c:Cours) REQUIRE c.code IS UNIQUE;
CREATE CONSTRAINT competence_nom IF NOT EXISTS FOR (c:Competence) REQUIRE c.nom IS UNIQUE;

// ─── 1.2 : Créer les compétences ──────────────────────────────────────────────
UNWIND [
  {nom: "Python", categorie: "Programmation"},
  {nom: "Java", categorie: "Programmation"},
  {nom: "SQL", categorie: "Bases de Données"},
  {nom: "NoSQL", categorie: "Bases de Données"},
  {nom: "Machine Learning", categorie: "IA"},
  {nom: "Deep Learning", categorie: "IA"},
  {nom: "React", categorie: "Web"},
  {nom: "Docker", categorie: "DevOps"},
  {nom: "Linux", categorie: "Systèmes"},
  {nom: "Réseaux", categorie: "Infrastructure"}
] AS comp
MERGE (:Competence {nom: comp.nom, categorie: comp.categorie});

// ─── 1.3 : Créer les cours ────────────────────────────────────────────────────
UNWIND [
  {code: "INFO401", intitule: "Bases de Données Avancées", credits: 6, dept: "Informatique"},
  {code: "INFO402", intitule: "Intelligence Artificielle", credits: 6, dept: "Informatique"},
  {code: "INFO403", intitule: "Développement Web", credits: 4, dept: "Informatique"},
  {code: "INFO404", intitule: "Systèmes Distribués", credits: 5, dept: "Informatique"},
  {code: "INFO405", intitule: "Cloud Computing", credits: 4, dept: "Informatique"}
] AS cours
MERGE (:Cours {code: cours.code, intitule: cours.intitule,
               credits: cours.credits, departement: cours.dept});

// ─── 1.4 : Créer les étudiants ────────────────────────────────────────────────
// TODO: Créer 50 étudiants avec données algériennes réalistes
// Utiliser UNWIND avec une liste de maps
// Universités : USTHB, UMBB, USTO, UMC, UBMA
// Filieres : Informatique, Mathématiques, Electronique, Telecoms, GL

UNWIND [
  // USTHB – Alger (E001-E010)
  {id: "E001", prenom: "Ahmed",     nom: "Bensalem",  universite: "USTHB", filiere: "Informatique",   annee: 3, ville: "Alger"},
  {id: "E002", prenom: "Fatima",    nom: "Ouali",      universite: "USTHB", filiere: "Informatique",   annee: 3, ville: "Alger"},
  {id: "E003", prenom: "Mohamed",   nom: "Chekroune",  universite: "USTHB", filiere: "GL",             annee: 4, ville: "Alger"},
  {id: "E004", prenom: "Yasmine",   nom: "Benali",     universite: "USTHB", filiere: "Informatique",   annee: 2, ville: "Alger"},
  {id: "E005", prenom: "Karim",     nom: "Mansouri",   universite: "USTHB", filiere: "Mathématiques",  annee: 3, ville: "Alger"},
  {id: "E006", prenom: "Sara",      nom: "Brahimi",    universite: "USTHB", filiere: "GL",             annee: 1, ville: "Alger"},
  {id: "E007", prenom: "Djamel",    nom: "Zerrouki",   universite: "USTHB", filiere: "Telecoms",       annee: 4, ville: "Alger"},
  {id: "E008", prenom: "Sihem",     nom: "Hadj",       universite: "USTHB", filiere: "Electronique",   annee: 2, ville: "Alger"},
  {id: "E009", prenom: "Nassim",    nom: "Ferhat",     universite: "USTHB", filiere: "Informatique",   annee: 4, ville: "Alger"},
  {id: "E010", prenom: "Widad",     nom: "Belarbi",    universite: "USTHB", filiere: "Informatique",   annee: 1, ville: "Alger"},
  // UMBB – Boumerdes (E011-E020)
  {id: "E011", prenom: "Amira",     nom: "Mebarki",    universite: "UMBB",  filiere: "Informatique",   annee: 3, ville: "Boumerdes"},
  {id: "E012", prenom: "Sofiane",   nom: "Boudali",    universite: "UMBB",  filiere: "Telecoms",       annee: 4, ville: "Boumerdes"},
  {id: "E013", prenom: "Meriem",    nom: "Aissaoui",   universite: "UMBB",  filiere: "Electronique",   annee: 2, ville: "Boumerdes"},
  {id: "E014", prenom: "Yacine",    nom: "Rahmani",    universite: "UMBB",  filiere: "GL",             annee: 3, ville: "Boumerdes"},
  {id: "E015", prenom: "Nadia",     nom: "Cherradi",   universite: "UMBB",  filiere: "Informatique",   annee: 4, ville: "Boumerdes"},
  {id: "E016", prenom: "Hamza",     nom: "Gherbi",     universite: "UMBB",  filiere: "Mathématiques",  annee: 1, ville: "Boumerdes"},
  {id: "E017", prenom: "Sonia",     nom: "Djebbar",    universite: "UMBB",  filiere: "Informatique",   annee: 2, ville: "Boumerdes"},
  {id: "E018", prenom: "Omar",      nom: "Chikhi",     universite: "UMBB",  filiere: "GL",             annee: 3, ville: "Boumerdes"},
  {id: "E019", prenom: "Lina",      nom: "Bensaid",    universite: "UMBB",  filiere: "Telecoms",       annee: 4, ville: "Boumerdes"},
  {id: "E020", prenom: "Bilal",     nom: "Khelifi",    universite: "UMBB",  filiere: "Informatique",   annee: 2, ville: "Boumerdes"},
  // USTO – Oran (E021-E030)
  {id: "E021", prenom: "Imene",     nom: "Boudiaf",    universite: "USTO",  filiere: "Informatique",   annee: 3, ville: "Oran"},
  {id: "E022", prenom: "Amine",     nom: "Meziani",    universite: "USTO",  filiere: "GL",             annee: 4, ville: "Oran"},
  {id: "E023", prenom: "Kahina",    nom: "Ferhat",     universite: "USTO",  filiere: "Electronique",   annee: 2, ville: "Oran"},
  {id: "E024", prenom: "Adel",      nom: "Mansouri",   universite: "USTO",  filiere: "Informatique",   annee: 3, ville: "Oran"},
  {id: "E025", prenom: "Rania",     nom: "Zerrouki",   universite: "USTO",  filiere: "Mathématiques",  annee: 1, ville: "Oran"},
  {id: "E026", prenom: "Ayoub",     nom: "Brahimi",    universite: "USTO",  filiere: "Informatique",   annee: 4, ville: "Oran"},
  {id: "E027", prenom: "Zahra",     nom: "Benali",     universite: "USTO",  filiere: "GL",             annee: 2, ville: "Oran"},
  {id: "E028", prenom: "Riadh",     nom: "Hadj",       universite: "USTO",  filiere: "Telecoms",       annee: 3, ville: "Oran"},
  {id: "E029", prenom: "Amel",      nom: "Cherradi",   universite: "USTO",  filiere: "Informatique",   annee: 4, ville: "Oran"},
  {id: "E030", prenom: "Nawel",     nom: "Ouali",      universite: "USTO",  filiere: "Electronique",   annee: 1, ville: "Oran"},
  // UMC – Constantine (E031-E040)
  {id: "E031", prenom: "Houria",    nom: "Bensalem",   universite: "UMC",   filiere: "Informatique",   annee: 3, ville: "Constantine"},
  {id: "E032", prenom: "Tarek",     nom: "Brahimi",    universite: "UMC",   filiere: "GL",             annee: 4, ville: "Constantine"},
  {id: "E033", prenom: "Assia",     nom: "Mebarki",    universite: "UMC",   filiere: "Mathématiques",  annee: 2, ville: "Constantine"},
  {id: "E034", prenom: "Lotfi",     nom: "Gherbi",     universite: "UMC",   filiere: "Informatique",   annee: 3, ville: "Constantine"},
  {id: "E035", prenom: "Meryem",    nom: "Ferhat",     universite: "UMC",   filiere: "Telecoms",       annee: 1, ville: "Constantine"},
  {id: "E036", prenom: "Idir",      nom: "Belarbi",    universite: "UMC",   filiere: "Informatique",   annee: 4, ville: "Constantine"},
  {id: "E037", prenom: "Djamila",   nom: "Rahmani",    universite: "UMC",   filiere: "GL",             annee: 2, ville: "Constantine"},
  {id: "E038", prenom: "Mehdi",     nom: "Aissaoui",   universite: "UMC",   filiere: "Electronique",   annee: 3, ville: "Constantine"},
  {id: "E039", prenom: "Nour",      nom: "Chekroune",  universite: "UMC",   filiere: "Informatique",   annee: 4, ville: "Constantine"},
  {id: "E040", prenom: "Salim",     nom: "Khelifi",    universite: "UMC",   filiere: "Mathématiques",  annee: 2, ville: "Constantine"},
  // UBMA – Annaba (E041-E050)
  {id: "E041", prenom: "Lydia",     nom: "Mansouri",   universite: "UBMA",  filiere: "Informatique",   annee: 3, ville: "Annaba"},
  {id: "E042", prenom: "Fares",     nom: "Djebbar",    universite: "UBMA",  filiere: "GL",             annee: 4, ville: "Annaba"},
  {id: "E043", prenom: "Romaissa",  nom: "Haddad",     universite: "UBMA",  filiere: "Electronique",   annee: 2, ville: "Annaba"},
  {id: "E044", prenom: "Ilyes",     nom: "Boudali",    universite: "UBMA",  filiere: "Informatique",   annee: 3, ville: "Annaba"},
  {id: "E045", prenom: "Tinhinane", nom: "Zerrouki",   universite: "UBMA",  filiere: "Mathématiques",  annee: 1, ville: "Annaba"},
  {id: "E046", prenom: "Oussama",   nom: "Brahimi",    universite: "UBMA",  filiere: "Informatique",   annee: 4, ville: "Annaba"},
  {id: "E047", prenom: "Yasmina",   nom: "Ferhat",     universite: "UBMA",  filiere: "GL",             annee: 2, ville: "Annaba"},
  {id: "E048", prenom: "Massinissa",nom: "Benali",     universite: "UBMA",  filiere: "Telecoms",       annee: 3, ville: "Annaba"},
  {id: "E049", prenom: "Celia",     nom: "Khelifi",    universite: "UBMA",  filiere: "Informatique",   annee: 4, ville: "Annaba"},
  {id: "E050", prenom: "Louiza",    nom: "Hadj",       universite: "UBMA",  filiere: "Electronique",   annee: 2, ville: "Annaba"}
] AS data
MERGE (e:Etudiant {id: data.id})
SET e += data;

// ─── 1.5 : Créer les relations ────────────────────────────────────────────────
// TODO: Relations CONNAIT entre étudiants
// Assurer que le graphe est connexe (pas d'étudiants isolés)

UNWIND [
  // Anneau USTHB (E001-E010) — chaque étudiant connait au moins 2 voisins
  {a:"E001", b:"E002"}, {a:"E001", b:"E003"},
  {a:"E002", b:"E004"}, {a:"E003", b:"E005"},
  {a:"E004", b:"E006"}, {a:"E005", b:"E007"},
  {a:"E006", b:"E008"}, {a:"E007", b:"E009"},
  {a:"E008", b:"E010"}, {a:"E009", b:"E002"},
  // Anneau UMBB (E011-E020)
  {a:"E011", b:"E012"}, {a:"E012", b:"E013"},
  {a:"E013", b:"E014"}, {a:"E014", b:"E015"},
  {a:"E015", b:"E016"}, {a:"E016", b:"E017"},
  {a:"E017", b:"E018"}, {a:"E018", b:"E019"},
  {a:"E019", b:"E020"}, {a:"E020", b:"E011"},
  // Anneau USTO (E021-E030)
  {a:"E021", b:"E022"}, {a:"E022", b:"E023"},
  {a:"E023", b:"E024"}, {a:"E024", b:"E025"},
  {a:"E025", b:"E026"}, {a:"E026", b:"E027"},
  {a:"E027", b:"E028"}, {a:"E028", b:"E029"},
  {a:"E029", b:"E030"}, {a:"E030", b:"E021"},
  // Anneau UMC (E031-E040)
  {a:"E031", b:"E032"}, {a:"E032", b:"E033"},
  {a:"E033", b:"E034"}, {a:"E034", b:"E035"},
  {a:"E035", b:"E036"}, {a:"E036", b:"E037"},
  {a:"E037", b:"E038"}, {a:"E038", b:"E039"},
  {a:"E039", b:"E040"}, {a:"E040", b:"E031"},
  // Anneau UBMA (E041-E050)
  {a:"E041", b:"E042"}, {a:"E042", b:"E043"},
  {a:"E043", b:"E044"}, {a:"E044", b:"E045"},
  {a:"E045", b:"E046"}, {a:"E046", b:"E047"},
  {a:"E047", b:"E048"}, {a:"E048", b:"E049"},
  {a:"E049", b:"E050"}, {a:"E050", b:"E041"},
  // Connexions inter-universités (assure la connexité globale du graphe)
  {a:"E001", b:"E011"}, // USTHB ↔ UMBB
  {a:"E011", b:"E021"}, // UMBB ↔ USTO
  {a:"E021", b:"E031"}, // USTO ↔ UMC
  {a:"E031", b:"E041"}, // UMC  ↔ UBMA
  {a:"E003", b:"E021"}, // USTHB GL ↔ USTO (2ème pont pour raccourcir Ahmed→Yasmina)
  {a:"E002", b:"E031"}, // USTHB ↔ UMC (ami commun Ahmed/Houria)
  {a:"E009", b:"E020"}, // USTHB ↔ UMBB
  {a:"E014", b:"E024"}, // UMBB  ↔ USTO
  {a:"E026", b:"E036"}, // USTO  ↔ UMC
  {a:"E034", b:"E044"}, // UMC   ↔ UBMA
  {a:"E005", b:"E016"}  // USTHB Maths ↔ UMBB Maths
] AS pair
MATCH (a:Etudiant {id: pair.a}), (b:Etudiant {id: pair.b})
MERGE (a)-[:CONNAIT]->(b);

// TODO: Relations SUIT (étudiant → cours) avec notes

UNWIND [
  // Ahmed (E001) : INFO401, INFO402, INFO403
  {e:"E001", c:"INFO401", note:15.5, session:"S1 2024"},
  {e:"E001", c:"INFO402", note:13.0, session:"S2 2024"},
  {e:"E001", c:"INFO403", note:16.0, session:"S2 2024"},
  // USTHB
  {e:"E002", c:"INFO402", note:14.0, session:"S2 2024"},
  {e:"E002", c:"INFO403", note:12.5, session:"S2 2024"},
  {e:"E003", c:"INFO401", note:11.0, session:"S1 2024"},
  {e:"E003", c:"INFO404", note:13.5, session:"S1 2024"},
  {e:"E004", c:"INFO401", note:17.0, session:"S1 2024"},
  {e:"E004", c:"INFO403", note:15.0, session:"S2 2024"},
  {e:"E005", c:"INFO401", note:10.0, session:"S1 2024"},
  {e:"E005", c:"INFO402", note: 9.5, session:"S2 2024"},
  {e:"E006", c:"INFO403", note:14.0, session:"S2 2024"},
  {e:"E006", c:"INFO405", note:16.0, session:"S1 2024"},
  {e:"E007", c:"INFO404", note:12.0, session:"S1 2024"},
  {e:"E007", c:"INFO405", note:11.5, session:"S1 2024"},
  {e:"E008", c:"INFO401", note:15.0, session:"S1 2024"},
  {e:"E008", c:"INFO404", note:13.0, session:"S1 2024"},
  {e:"E009", c:"INFO401", note:16.5, session:"S1 2024"},
  {e:"E009", c:"INFO402", note:14.5, session:"S2 2024"},
  {e:"E010", c:"INFO403", note:13.5, session:"S2 2024"},
  {e:"E010", c:"INFO405", note:12.0, session:"S1 2024"},
  // UMBB
  {e:"E011", c:"INFO401", note:14.0, session:"S1 2024"},
  {e:"E011", c:"INFO402", note:11.5, session:"S2 2024"},
  {e:"E012", c:"INFO402", note:15.0, session:"S2 2024"},
  {e:"E012", c:"INFO404", note:13.0, session:"S1 2024"},
  {e:"E013", c:"INFO403", note:14.5, session:"S2 2024"},
  {e:"E013", c:"INFO404", note:12.5, session:"S1 2024"},
  {e:"E014", c:"INFO401", note:16.0, session:"S1 2024"},
  {e:"E014", c:"INFO403", note:13.0, session:"S2 2024"},
  {e:"E015", c:"INFO404", note:11.0, session:"S1 2024"},
  {e:"E015", c:"INFO405", note:15.5, session:"S1 2024"},
  {e:"E016", c:"INFO402", note:10.5, session:"S2 2024"},
  {e:"E016", c:"INFO405", note:14.0, session:"S1 2024"},
  {e:"E017", c:"INFO401", note:12.0, session:"S1 2024"},
  {e:"E017", c:"INFO403", note:15.5, session:"S2 2024"},
  {e:"E018", c:"INFO401", note:13.5, session:"S1 2024"},
  {e:"E018", c:"INFO404", note:16.0, session:"S1 2024"},
  {e:"E019", c:"INFO402", note:14.5, session:"S2 2024"},
  {e:"E019", c:"INFO403", note:11.0, session:"S2 2024"},
  {e:"E020", c:"INFO401", note:17.0, session:"S1 2024"},
  {e:"E020", c:"INFO405", note:13.0, session:"S1 2024"},
  // USTO
  {e:"E021", c:"INFO401", note:14.0, session:"S1 2024"},
  {e:"E021", c:"INFO402", note:15.5, session:"S2 2024"},
  {e:"E022", c:"INFO402", note:12.0, session:"S2 2024"},
  {e:"E022", c:"INFO405", note:14.5, session:"S1 2024"},
  {e:"E023", c:"INFO403", note:11.5, session:"S2 2024"},
  {e:"E023", c:"INFO404", note:13.0, session:"S1 2024"},
  {e:"E024", c:"INFO401", note:15.0, session:"S1 2024"},
  {e:"E024", c:"INFO403", note:16.0, session:"S2 2024"},
  {e:"E025", c:"INFO402", note:10.0, session:"S2 2024"},
  {e:"E025", c:"INFO405", note:13.5, session:"S1 2024"},
  {e:"E026", c:"INFO401", note:14.5, session:"S1 2024"},
  {e:"E026", c:"INFO403", note:17.0, session:"S2 2024"},
  {e:"E027", c:"INFO401", note:12.5, session:"S1 2024"},
  {e:"E027", c:"INFO404", note:15.0, session:"S1 2024"},
  {e:"E028", c:"INFO404", note:14.0, session:"S1 2024"},
  {e:"E028", c:"INFO405", note:12.5, session:"S1 2024"},
  {e:"E029", c:"INFO401", note:15.5, session:"S1 2024"},
  {e:"E029", c:"INFO403", note:13.0, session:"S2 2024"},
  {e:"E030", c:"INFO403", note:11.0, session:"S2 2024"},
  {e:"E030", c:"INFO404", note:16.5, session:"S1 2024"},
  // UMC
  {e:"E031", c:"INFO401", note:14.5, session:"S1 2024"},
  {e:"E031", c:"INFO402", note:13.5, session:"S2 2024"},
  {e:"E032", c:"INFO401", note:16.0, session:"S1 2024"},
  {e:"E032", c:"INFO404", note:12.0, session:"S1 2024"},
  {e:"E033", c:"INFO402", note:11.5, session:"S2 2024"},
  {e:"E033", c:"INFO405", note:15.0, session:"S1 2024"},
  {e:"E034", c:"INFO401", note:13.0, session:"S1 2024"},
  {e:"E034", c:"INFO402", note:14.0, session:"S2 2024"},
  {e:"E035", c:"INFO403", note:12.5, session:"S2 2024"},
  {e:"E035", c:"INFO405", note:11.0, session:"S1 2024"},
  {e:"E036", c:"INFO401", note:15.5, session:"S1 2024"},
  {e:"E036", c:"INFO403", note:14.0, session:"S2 2024"},
  {e:"E037", c:"INFO401", note:16.5, session:"S1 2024"},
  {e:"E037", c:"INFO404", note:13.5, session:"S1 2024"},
  {e:"E038", c:"INFO402", note:15.0, session:"S2 2024"},
  {e:"E038", c:"INFO404", note:12.0, session:"S1 2024"},
  {e:"E039", c:"INFO401", note:14.5, session:"S1 2024"},
  {e:"E039", c:"INFO405", note:13.0, session:"S1 2024"},
  {e:"E040", c:"INFO402", note:11.0, session:"S2 2024"},
  {e:"E040", c:"INFO403", note:16.0, session:"S2 2024"},
  // UBMA
  {e:"E041", c:"INFO401", note:15.0, session:"S1 2024"},
  {e:"E041", c:"INFO402", note:12.5, session:"S2 2024"},
  {e:"E042", c:"INFO402", note:14.0, session:"S2 2024"},
  {e:"E042", c:"INFO403", note:13.5, session:"S2 2024"},
  {e:"E043", c:"INFO404", note:11.5, session:"S1 2024"},
  {e:"E043", c:"INFO405", note:15.5, session:"S1 2024"},
  {e:"E044", c:"INFO401", note:16.5, session:"S1 2024"},
  {e:"E044", c:"INFO403", note:14.0, session:"S2 2024"},
  {e:"E045", c:"INFO402", note:13.0, session:"S2 2024"},
  {e:"E045", c:"INFO405", note:12.0, session:"S1 2024"},
  {e:"E046", c:"INFO401", note:14.5, session:"S1 2024"},
  {e:"E046", c:"INFO404", note:15.0, session:"S1 2024"},
  {e:"E047", c:"INFO402", note:16.0, session:"S2 2024"},
  {e:"E047", c:"INFO403", note:13.0, session:"S2 2024"},
  {e:"E048", c:"INFO404", note:12.5, session:"S1 2024"},
  {e:"E048", c:"INFO405", note:14.5, session:"S1 2024"},
  {e:"E049", c:"INFO401", note:17.0, session:"S1 2024"},
  {e:"E049", c:"INFO402", note:15.5, session:"S2 2024"},
  {e:"E050", c:"INFO403", note:11.0, session:"S2 2024"},
  {e:"E050", c:"INFO404", note:13.5, session:"S1 2024"}
] AS s
MATCH (e:Etudiant {id: s.e}), (c:Cours {code: s.c})
MERGE (e)-[:SUIT {note: s.note, session: s.session}]->(c);

// TODO: Relations MAITRISE (étudiant → compétence) avec niveaux

UNWIND [
  // USTHB
  {e:"E001", comp:"Python",          niveau:4}, {e:"E001", comp:"SQL",             niveau:3}, {e:"E001", comp:"NoSQL",           niveau:2},
  {e:"E002", comp:"Python",          niveau:3}, {e:"E002", comp:"Machine Learning",niveau:2},
  {e:"E003", comp:"SQL",             niveau:4}, {e:"E003", comp:"Java",            niveau:3},
  {e:"E004", comp:"React",           niveau:4}, {e:"E004", comp:"Python",          niveau:3},
  {e:"E005", comp:"Python",          niveau:2}, {e:"E005", comp:"Machine Learning",niveau:3}, {e:"E005", comp:"SQL",niveau:2},
  {e:"E006", comp:"React",           niveau:4}, {e:"E006", comp:"Docker",          niveau:3},
  {e:"E007", comp:"Linux",           niveau:3}, {e:"E007", comp:"Réseaux",         niveau:4},
  {e:"E008", comp:"Linux",           niveau:2}, {e:"E008", comp:"Docker",          niveau:2},
  {e:"E009", comp:"Python",          niveau:5}, {e:"E009", comp:"SQL",             niveau:4},
  {e:"E010", comp:"Docker",          niveau:3}, {e:"E010", comp:"Linux",           niveau:2},
  // UMBB
  {e:"E011", comp:"NoSQL",           niveau:4}, {e:"E011", comp:"Python",          niveau:3},
  {e:"E012", comp:"Machine Learning",niveau:3}, {e:"E012", comp:"Python",          niveau:4},
  {e:"E013", comp:"Réseaux",         niveau:3}, {e:"E013", comp:"Linux",           niveau:2},
  {e:"E014", comp:"SQL",             niveau:3}, {e:"E014", comp:"React",           niveau:3},
  {e:"E015", comp:"Docker",          niveau:4}, {e:"E015", comp:"Linux",           niveau:3},
  {e:"E016", comp:"Python",          niveau:2}, {e:"E016", comp:"Machine Learning",niveau:2},
  {e:"E017", comp:"React",           niveau:4}, {e:"E017", comp:"SQL",             niveau:3},
  {e:"E018", comp:"SQL",             niveau:4}, {e:"E018", comp:"NoSQL",           niveau:3},
  {e:"E019", comp:"Python",          niveau:3}, {e:"E019", comp:"React",           niveau:2},
  {e:"E020", comp:"Docker",          niveau:3}, {e:"E020", comp:"Réseaux",         niveau:3},
  // USTO
  {e:"E021", comp:"Python",          niveau:4}, {e:"E021", comp:"Machine Learning",niveau:3}, {e:"E021", comp:"NoSQL",niveau:2},
  {e:"E022", comp:"Docker",          niveau:3}, {e:"E022", comp:"Linux",           niveau:2},
  {e:"E023", comp:"Réseaux",         niveau:3}, {e:"E023", comp:"Linux",           niveau:3},
  {e:"E024", comp:"React",           niveau:5}, {e:"E024", comp:"Python",          niveau:3},
  {e:"E025", comp:"Machine Learning",niveau:2}, {e:"E025", comp:"Python",          niveau:2},
  {e:"E026", comp:"React",           niveau:4}, {e:"E026", comp:"Java",            niveau:3},
  {e:"E027", comp:"SQL",             niveau:3}, {e:"E027", comp:"Java",            niveau:2},
  {e:"E028", comp:"Réseaux",         niveau:4}, {e:"E028", comp:"Docker",          niveau:2},
  {e:"E029", comp:"Python",          niveau:3}, {e:"E029", comp:"SQL",             niveau:3},
  {e:"E030", comp:"Linux",           niveau:3}, {e:"E030", comp:"Réseaux",         niveau:2},
  // UMC
  {e:"E031", comp:"Python",          niveau:3}, {e:"E031", comp:"SQL",             niveau:4}, {e:"E031", comp:"NoSQL",niveau:3},
  {e:"E032", comp:"SQL",             niveau:3}, {e:"E032", comp:"Java",            niveau:4},
  {e:"E033", comp:"Machine Learning",niveau:4}, {e:"E033", comp:"Python",          niveau:3},
  {e:"E034", comp:"Python",          niveau:4}, {e:"E034", comp:"Machine Learning",niveau:3},
  {e:"E035", comp:"Réseaux",         niveau:3}, {e:"E035", comp:"Docker",          niveau:2},
  {e:"E036", comp:"Python",          niveau:5}, {e:"E036", comp:"SQL",             niveau:3},
  {e:"E037", comp:"SQL",             niveau:4}, {e:"E037", comp:"NoSQL",           niveau:3},
  {e:"E038", comp:"Docker",          niveau:4}, {e:"E038", comp:"Linux",           niveau:3},
  {e:"E039", comp:"Réseaux",         niveau:3}, {e:"E039", comp:"Linux",           niveau:4},
  {e:"E040", comp:"Machine Learning",niveau:3}, {e:"E040", comp:"Python",          niveau:2},
  // UBMA
  {e:"E041", comp:"Python",          niveau:3}, {e:"E041", comp:"SQL",             niveau:3},
  {e:"E042", comp:"React",           niveau:4}, {e:"E042", comp:"Python",          niveau:3},
  {e:"E043", comp:"Linux",           niveau:3}, {e:"E043", comp:"Docker",          niveau:3},
  {e:"E044", comp:"React",           niveau:5}, {e:"E044", comp:"Python",          niveau:4},
  {e:"E045", comp:"Machine Learning",niveau:2}, {e:"E045", comp:"NoSQL",           niveau:2},
  {e:"E046", comp:"Python",          niveau:4}, {e:"E046", comp:"Docker",          niveau:3},
  {e:"E047", comp:"React",           niveau:3}, {e:"E047", comp:"Java",            niveau:2},
  {e:"E048", comp:"Réseaux",         niveau:4}, {e:"E048", comp:"Linux",           niveau:3},
  {e:"E049", comp:"Python",          niveau:5}, {e:"E049", comp:"SQL",             niveau:4}, {e:"E049", comp:"Machine Learning",niveau:3},
  {e:"E050", comp:"Linux",           niveau:3}, {e:"E050", comp:"Réseaux",         niveau:2}
] AS m
MATCH (e:Etudiant {id: m.e}), (comp:Competence {nom: m.comp})
MERGE (e)-[:MAITRISE {niveau: m.niveau}]->(comp);

// ─── 1.6 : Prérequis des cours (nécessaire pour ex3 3.5) ─────────────────────
UNWIND [
  {cours: "INFO401", competence: "SQL"},
  {cours: "INFO401", competence: "NoSQL"},
  {cours: "INFO402", competence: "Python"},
  {cours: "INFO402", competence: "Machine Learning"},
  {cours: "INFO403", competence: "React"},
  {cours: "INFO403", competence: "Python"},
  {cours: "INFO404", competence: "Docker"},
  {cours: "INFO404", competence: "Linux"},
  {cours: "INFO405", competence: "Docker"},
  {cours: "INFO405", competence: "Linux"},
  {cours: "INFO405", competence: "Réseaux"}
] AS req
MATCH (c:Cours {code: req.cours}), (comp:Competence {nom: req.competence})
MERGE (c)-[:REQUIERT]->(comp);

// Vérification
MATCH (n) RETURN labels(n)[0] AS type, count(n) AS total ORDER BY total DESC;
MATCH ()-[r]->() RETURN type(r) AS relation, count(r) AS total ORDER BY total DESC;
