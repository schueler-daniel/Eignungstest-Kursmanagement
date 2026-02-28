import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Kunden } from "../models";
import { JWT_SECRET } from "../server"

// POST /login – Kunde einloggen
// Erwartet: email, password
// Gibt bei Erfolg ein JWT Token zurück
// ────────────────────────────────────────────────────────────────────────

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    
    // Kunden anhand der Email suchen
    const kunde = await Kunden.findOne({ email });
    if (!kunde) {
      res.status(404).json({ message: "Kein Kunde unter dieser Email" });
      return;
    }

    // Eingegebenes Passwort mit dem gespeicherten Hash vergleichen
    const isCorrect = await bcrypt.compare(password, kunde.password as string);
    if (!isCorrect) {
      res.status(401).json({ message: "Passwort ist falsch" });
      return;
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err: unknown) {
    res.status(500).json({ message: "Unbekannter Fehler" });
  }
}