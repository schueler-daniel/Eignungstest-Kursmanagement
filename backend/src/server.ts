import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { initDummyDaten } from "./seed";
import { signup } from "./routes/signup";
import { login } from "./routes/login";
import { data } from "./routes/data";
import { join } from "./routes/join";
import { leave } from "./routes/leave";

const app = express();

// Middleware
// ────────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:3000", // Nur Anfragen vom Frontend erlauben
}));
app.use(express.json());


// Hilfsfunktionen
// ────────────────────────────────────────────────────────────────────────
// JWT_SECRET wird zum Signieren und Prüfen von Tokens verwendet
export const JWT_SECRET = "geheimesSecret";

// Liest den Token aus dem Authorization Header.
// Erwartet das Format: "Bearer <token>"
// Gibt den Token zurück oder null wenn kein gültiger Header vorhanden ist.
export function getToken(req: Request): string | null {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];  // "Bearer abc123" → "abc123"
}

// Prüft ob ein Token gültig und nicht abgelaufen ist.
// Gibt true zurück wenn der Token korrekt mit JWT_SECRET signiert wurde.
export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}


// Routen
// ────────────────────────────────────────────────────────────────────────
app.post("/signup", signup);
app.post("/login",  login);
app.get("/data",    data);
app.put("/join",    join);
app.put("/leave",   leave);


// Datenbankverbindung
// ────────────────────────────────────────────────────────────────────────
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/kursmanagement";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB verbunden");
    await initDummyDaten();
    app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
  })
  .catch((err: Error) => {
    console.error("Datenbankverbindung fehlgeschlagen:", err.message);
    process.exit(1);  // Prozess beenden wenn keine Datenbankverbindung möglich
  });