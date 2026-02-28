import bcrypt from "bcrypt";
import { Kurse, Kunden } from "./models";

// Fügt Testdaten ein, aber nur wenn die Datenbank noch leer ist.
export async function initDummyDaten() {
  const kursAnzahl = await Kurse.countDocuments();
  const kundeAnzahl = await Kunden.countDocuments();

  // Abbrechen wenn bereits Daten vorhanden sind
  if (kursAnzahl > 0 || kundeAnzahl > 0) return;

  const kurse = await Kurse.insertMany([
    { name: "React Grundlagen",              dauer: "8 Wochen",  level: "Einsteiger",      beschreibung: "Grundlagen von React und JSX.",              teilnehmer: 3 },
    { name: "TypeScript Fortgeschritten",    dauer: "6 Wochen",  level: "Fortgeschritten", beschreibung: "Tiefes TypeScript-Wissen.",                  teilnehmer: 2 },
    { name: "Node.js Backend",               dauer: "10 Wochen", level: "Mittel",          beschreibung: "REST APIs mit Node und Express.",            teilnehmer: 3 },
    { name: "CSS & Design",                  dauer: "4 Wochen",  level: "Einsteiger",      beschreibung: "Moderne Layouts mit Flexbox und Grid.",      teilnehmer: 2 },
    { name: "Datenbanken mit MongoDB",       dauer: "5 Wochen",  level: "Mittel",          beschreibung: "Datenbankdesign und Abfragen mit MongoDB.",  teilnehmer: 2 },
    { name: "Docker & DevOps",               dauer: "7 Wochen",  level: "Fortgeschritten", beschreibung: "Container, CI/CD Pipelines und Deployment.", teilnehmer: 1 },
    { name: "Algorithmen & Datenstrukturen", dauer: "12 Wochen", level: "Experte",         beschreibung: "Komplexe Algorithmen und ihre Anwendung.",   teilnehmer: 1 },
  ]);

  // Alle Dummy-Kunden bekommen dasselbe gehashte Passwort: "passwort123"
  const hashedPassword = await bcrypt.hash("passwort123", 10);

  await Kunden.insertMany([
    { name: "Anna Mülberg",     email: "anna@example.com",   password: hashedPassword, ort: "Berlin",     kurse: [kurse[0]._id, kurse[2]._id, kurse[3]._id] },
    { name: "Ben Schmidtke",    email: "ben@example.com",    password: hashedPassword, ort: "Hamburg",    kurse: [kurse[0]._id, kurse[1]._id] },
    { name: "Clara Weberling",  email: "clara@example.com",  password: hashedPassword, ort: "München",    kurse: [kurse[1]._id, kurse[2]._id, kurse[4]._id] },
    { name: "David Kleinmann",  email: "david@example.com",  password: hashedPassword, ort: "Köln",       kurse: [kurse[0]._id, kurse[5]._id] },
    { name: "Eva Brandner",     email: "eva@example.com",    password: hashedPassword, ort: "Frankfurt",  kurse: [kurse[2]._id, kurse[4]._id] },
    { name: "Felix Wagenbach",  email: "felix@example.com",  password: hashedPassword, ort: "Stuttgart",  kurse: [kurse[3]._id, kurse[6]._id] },
    { name: "Greta Hoffberg",   email: "greta@example.com",  password: hashedPassword, ort: "Düsseldorf", kurse: [kurse[6]._id] },
  ]);

  console.log("Dummy-Daten eingefügt");

}
