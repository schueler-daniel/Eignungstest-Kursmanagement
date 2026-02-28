import { Schema, model } from "mongoose";

// Schemas & Models
// ────────────────────────────────────────────────────────────────────────

// Kurs-Schema: definiert die Struktur eines Kurs-Dokuments in MongoDB

const kursSchema = new Schema(
  {
    name:   { type: String, required: true },
    dauer:  { type: String, required: true },
    level:  { type: String, required: true, enum: [
      "Einsteiger", "Mittel", "Fortgeschritten", "Experte"  // nur diese Werte erlaubt
    ] },
    beschreibung: { type: String },   // optional
    teilnehmer:   { type: Number, default: 0 },   // neuer Kurs startet mit 0 Teilnehmern
  }
);

// Kunde-Schema: definiert die Struktur eines Kunde-Dokuments in MongoDB
const kundeSchema = new Schema(
  {
    email:  { type: String,   required: true, unique: true },  // keine doppelten Emails erlaubt
    name:   { type: String,   required: true },
    password: { type: String, required: true },   // wird immer gehasht gespeichert
    ort:    { type: String },    // optional
    kurse: [{ type: Schema.Types.ObjectId, ref: "Kurs" }],  // Array von Referenzen auf Kurs-Dokumente
  }
);

export const Kurse = model("Kurs", kursSchema);
export const Kunden = model("Kunde", kundeSchema);