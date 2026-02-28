import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Kunden } from "../models";
import { JWT_SECRET } from "../server";


// POST /signup – Neuen Kunden registrieren
// Erwartet: name, email, password, ort (optional)
// Gibt bei Erfolg ein JWT Token zurück
// ────────────────────────────────────────────────────────────────────────
export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password, ort } = req.body;

    // Prüfen ob die Email bereits vergeben ist
    const alreadyAssigned = await Kunden.findOne({ email });
    if (alreadyAssigned) {
      res.status(409).json({ message: "Email bereits vergeben" });
      return;
    }

    // Passwort hashen – niemals Klartext in der Datenbank speichern
    // 10 = salt rounds (höher = sicherer aber langsamer)
    const hashedPassword = await bcrypt.hash(password, 10);

    const neuerKunde = new Kunden({
      name,
      email,
      password: hashedPassword,
      ...(ort && { ort }),  // Ort nur hinzufügen wenn er mitgeschickt wurde
      kurse: []
    });

    await neuerKunde.save();

    // Token mit Email als Payload erstellen, gültig für 1 Tag
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ token });
  } catch (err: unknown) {
    res.status(500).json({ message: "Unbekannter Fehler" });
  }
}