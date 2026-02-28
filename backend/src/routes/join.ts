import { Request, Response } from "express";
import mongoose from "mongoose";
import { Kurse, Kunden } from "../models";
import { getToken, verifyToken } from "../server";

// PUT /join – Kunde tritt einem Kurs bei
// Erwartet: email, kursId (im Body) und Token (im Header)
// ────────────────────────────────────────────────────────────────────────

export async function join(req: Request, res: Response) {
  try {
    const { email, kursId } = req.body;
    const token = getToken(req);

    if (!token || !verifyToken(token)) {
      res.status(401).json({ message: "Ungültiger Token" });
      return;
    }

    const kunde = await Kunden.findOne({ email });
    if (!kunde) {
      res.status(404).json({ message: "Kein Kunde unter dieser Email" });
      return;
    }

    // kursId (String) in eine MongoDB ObjectId umwandeln für den Vergleich
    const kursObjectId = new mongoose.Types.ObjectId(kursId);

    // Prüfen ob der Kunde bereits in diesem Kurs ist
    const bereitsImKurs = kunde.kurse.some((id) => id.equals(kursObjectId));
    if (bereitsImKurs) {
      res.status(409).json({ message: "Kunde ist bereits in diesem Kurs" });
      return;
    }

    // Kurs-ID  dem Array des Kunden hinzufügen
    kunde.kurse.push(kursObjectId);
    await kunde.save();

    // Teilnehmeranzahl im Kurs um 1 erhöhen ($inc = increment)
    await Kurse.findByIdAndUpdate(kursObjectId, { $inc: { teilnehmer: 1 } });

    res.json({ message: "Kurs erfolgreich beigetreten" });
  } catch (err: unknown) {
    res.status(500).json({ message: "Unbekannter Fehler" });
  }
}