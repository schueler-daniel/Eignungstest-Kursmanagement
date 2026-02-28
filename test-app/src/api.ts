import { Kurs, Kunde } from "./types";

const BASE_URL = "http://localhost:5000";

// Lädt Kurse und (bei gültigem Token) auch Kunden vom Server.
// Gibt die Daten zurück damit sie direkt weiterverwendet werden können.
// ────────────────────────────────────────────────────────────────────────
export async function fetchDaten(token: string): Promise<{ kurse: Kurs[]; kunden: Kunde[] }> {
  const res = await fetch(`${BASE_URL}/data`, {
    headers: token ? { "Authorization": `Bearer ${token}` } : {},
  });

  return res.json();
}


// Login:
// Schickt Login-Daten an den Server und gibt Token zurück.
// ────────────────────────────────────────────────────────────────────────
export async function fetchLogin(email: string, password: string): Promise<{ token?: string; message?: string }> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  // ok=false bedeutet Fehler (z.B. falsches Passwort)
  return res.ok ? data : Promise.reject(data.message);
}


// Registrieren:
// Schickt Registrierungsdaten an den Server und gibt Token zurück.
// ────────────────────────────────────────────────────────────────────────
export async function fetchSignup(name: string, email: string, password: string, ort: string): Promise<{ token?: string; message?: string }> {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Ort nur mitsenden wenn er ausgefüllt wurde
    body: JSON.stringify({ name, email, password, ...(ort && { ort }) }),
  });
  
  const data = await res.json();
  return res.ok ? data : Promise.reject(data.message);
}


// Schickt eine Join- oder Leave-Anfrage an den Server.
// ────────────────────────────────────────────────────────────────────────
export async function fetchJoinLeave(route: "/join" | "/leave", email: string, kursId: string, token: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}${route}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ email, kursId }),
  });
  
  return res.ok;
}