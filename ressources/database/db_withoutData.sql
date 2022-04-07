CREATE TABLE "user" (
  "loginUser" varchar PRIMARY KEY,
  "nomUser" varchar NOT NULL,
  "prenomUser" varchar NOT NULL,
  "passwordUser" varchar NOT NULL,
  "idRoleUser" integer NOT NULL DEFAULT 2
);

CREATE TABLE "role" (
  "idRoleUser" serial PRIMARY KEY,
  "nomRoleUser" varchar UNIQUE NOT NULL
);

CREATE TABLE "bouteille" (
  "idBouteille" serial PRIMARY KEY,
  "idMillesime" integer NOT NULL,
  "idDomaine" integer NOT NULL,
  "idTypeVin" integer NOT NULL,
  "idNomBouteille" integer NOT NULL,
  "idAppellation" integer NOT NULL,
  "idTailleBouteille" integer NOT NULL
);

CREATE TABLE "domaine" (
  "idDomaine" serial PRIMARY KEY,
  "nomDomaine" varchar UNIQUE NOT NULL
);

CREATE TABLE "typeVin" (
  "idTypeVin" serial PRIMARY KEY,
  "nomTypeVin" varchar UNIQUE NOT NULL
);

CREATE TABLE "nomBouteille" (
  "idNomBouteille" serial PRIMARY KEY,
  "nomNomBouteille" varchar UNIQUE NOT NULL
);

CREATE TABLE "appellation" (
  "idAppellation" serial PRIMARY KEY,
  "nomAppellation" varchar UNIQUE NOT NULL
);

CREATE TABLE "tailleBouteille" (
  "idTailleBouteille" serial PRIMARY KEY,
  "nomTailleBouteille" real UNIQUE NOT NULL
);

CREATE TABLE "millesime" (
  "idMillesime" serial PRIMARY KEY,
  "valeurMillesime" integer UNIQUE NOT NULL CHECK ("valeurMillesime" > 999 AND "valeurMillesime" <= 2100)
);

CREATE TABLE "cave" (
  "idCave" serial PRIMARY KEY,
  "nomCave" varchar NOT NULL
);

CREATE TABLE "mur" (
  "idMur" serial PRIMARY KEY,
  "imageMur" varchar NOT NULL,
  "idCave" integer NOT NULL
);

CREATE TABLE "emplacement" (
  "idEmplacement" serial PRIMARY KEY,
  "idMur" integer NOT NULL
);

CREATE TABLE "point" (
  "idPoint" serial PRIMARY KEY,
  "xPoint" real NOT NULL,
  "yPoint" real NOT NULL,
  "idEmplacement" integer NOT NULL
);

CREATE TABLE "asso_user_cave" (
  "loginUser" varchar,
  "idCave" integer,
  PRIMARY KEY ("loginUser", "idCave")
);

CREATE TABLE "asso_emplacement_bouteille" (
  "idEmplacement" integer,
  "idBouteille" integer,
  "quantite" integer NOT NULL CHECK (0 <= quantite AND quantite <= 100),
  PRIMARY KEY ("idEmplacement", "idBouteille")
);

ALTER TABLE "user" ADD FOREIGN KEY ("idRoleUser") REFERENCES "role" ("idRoleUser") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "bouteille" ADD FOREIGN KEY ("idMillesime") REFERENCES "millesime" ("idMillesime") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "bouteille" ADD FOREIGN KEY ("idDomaine") REFERENCES "domaine" ("idDomaine") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "bouteille" ADD FOREIGN KEY ("idTypeVin") REFERENCES "typeVin" ("idTypeVin") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "bouteille" ADD FOREIGN KEY ("idNomBouteille") REFERENCES "nomBouteille" ("idNomBouteille") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "bouteille" ADD FOREIGN KEY ("idAppellation") REFERENCES "appellation" ("idAppellation") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "bouteille" ADD FOREIGN KEY ("idTailleBouteille") REFERENCES "tailleBouteille" ("idTailleBouteille") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "mur" ADD FOREIGN KEY ("idCave") REFERENCES "cave" ("idCave") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "emplacement" ADD FOREIGN KEY ("idMur") REFERENCES "mur" ("idMur") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "point" ADD FOREIGN KEY ("idEmplacement") REFERENCES "emplacement" ("idEmplacement") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "asso_user_cave" ADD FOREIGN KEY ("loginUser") REFERENCES "user" ("loginUser") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "asso_user_cave" ADD FOREIGN KEY ("idCave") REFERENCES "cave" ("idCave") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "asso_emplacement_bouteille" ADD FOREIGN KEY ("idEmplacement") REFERENCES "emplacement" ("idEmplacement") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "asso_emplacement_bouteille" ADD FOREIGN KEY ("idBouteille") REFERENCES "bouteille" ("idBouteille") ON UPDATE CASCADE ON DELETE CASCADE;

