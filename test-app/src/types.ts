// Interfaces – definieren die Datenstruktur von Kurs und Kunde
//  wie sie vom Server zu erwarten sind.
// ────────────────────────────────────────────────────────────────────────

export interface Kurs {
  _id: string;
  name: string;
  dauer: string;
  level: "Einsteiger" | "Mittel" | "Fortgeschritten" | "Experte"; // nur diese 4 Werte erlaubt
  beschreibung?: string;  // optional
  teilnehmer: number;   // Anzahl der Teilnehmer
}

export interface Kunde {
  _id: string;
  name: string;
  email: string;
  ort?: string;   // optional
  kurse: string[];  // Array von Kurs-IDs
}