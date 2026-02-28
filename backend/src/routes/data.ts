import { Request, Response } from "express";
import { Kurse, Kunden } from "../models";
import { getToken, verifyToken } from "../server";

// GET /data – Kurse und Kunden abrufen
// Kurse werden immer zurückgegeben.
// Kunden nur wenn ein gültiger Token mitgeschickt wird.
// ────────────────────────────────────────────────────────────────────────

export async function data(req: Request, res: Response) {
  try {
    const token = getToken(req);
    const kurse = await Kurse.find();

    // Kein oder ungültiger Token → nur Kurse zurückgeben
    if (!token || !verifyToken(token)) {
      res.json({ kurse, kunden: [] });
      return;
    }

    // Gültiger Token → Kunden ohne Passwort-Feld zurückgeben
    const kunden = await Kunden.find().select("-password");
    res.json({ kunden, kurse });
  } catch {
    res.status(500).json({ message: "Unbekannter Fehler" });
  }
}