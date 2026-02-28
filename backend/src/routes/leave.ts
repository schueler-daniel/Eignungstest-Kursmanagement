import { Request, Response } from "express";
import mongoose from "mongoose";
import { Kurse, Kunden } from "../models";
import { getToken, verifyToken } from "../server";

// PUT /leave – Kunde verlässt einen Kurs
// Erwartet: email, kursId (im Body) und Token (im Header)
// ────────────────────────────────────────────────────────────────────────

export async function leave(req: Request, res: Response) {
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

    const kursObjectId = new mongoose.Types.ObjectId(kursId);

    // Prüfen ob der Kunde überhaupt in diesem Kurs ist
    const imKurs = kunde.kurse.some((id) => id.equals(kursObjectId));
    if (!imKurs) {
      res.status(409).json({ message: "Kunde ist nicht in diesem Kurs" });
      return;
    }

    // Kurs-ID aus dem Array des Kunden entfernen
    kunde.kurse = kunde.kurse.filter((id) => !id.equals(kursObjectId));
    await kunde.save();

    // Teilnehmeranzahl im Kurs um 1 verringern ($inc mit negativem Wert)
    await Kurse.findByIdAndUpdate(kursObjectId, { $inc: { teilnehmer: -1 } });

    res.json({ message: "Kurs erfolgreich verlassen" });
  } catch (err: unknown) {
    res.status(500).json({ message: "Unbekannter Fehler" });
  }
}