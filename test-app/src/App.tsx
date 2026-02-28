import { JSX, useState, useEffect } from "react";
import "./App.css";

import { Kurs, Kunde } from "./types";
import { fetchDaten, fetchLogin } from "./api";
import { Kursliste } from "./components/Kursliste";
import { Kundenliste } from "./components/Kundenliste";
import { KursInfo } from "./components/KursInfo";
import { KundenInfo } from "./components/KundenInfo";
import { RegistrierenModal } from "./components/RegistrierenModal";


// Navigationspunkte für die Sidebar
const NAVIGATION = [
  { key: "kursliste",   label: "Kursliste" },
  { key: "kundenliste", label: "Kundenliste" },
  { key: "kursinfo",    label: "Kursinformationen" },
  { key: "kundeninfo",  label: "Kundeninformationen" },
];


// Main App
// Zentraler State für die gesamte App: Seiten, Daten, Auth
// ────────────────────────────────────────────────────────────────────────

export default function App() {
  // Zentrale States: Aktive Seite und Speicher für Kurse und Kunden
  const [activePage, setActivePage] = useState("kursliste");
  const [kurse, setKurse] = useState<Kurs[]>([]);
  const [kunden, setKunden] = useState<Kunde[]>([]);

  // Token aus localStorage laden – bleibt nach Neuladen erhalten
  const [currentToken, setToken] = useState(localStorage.getItem("token") ?? "");
  const [currentUser, setCurrentUser] = useState<Kunde | null>(null);

  // States für die Login-Felder im Header
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginFehler, setLoginFehler] = useState("");

  const [zeigeRegistrieren, setZeigeRegistrieren] = useState(false);


  // Lädt Kurse und (bei gültigem Token) auch Kunden vom Server
  // ────────────────────────────────────────────────────────────────────────
  async function ladeDaten(token: string) {
    const data = await fetchDaten(token);
    setKurse(data.kurse);
    setKunden(data.kunden);
    return data;
  }


  // Beim ersten Laden der App:
  // Wenn Token und Email im localStorage stehen, wird der Kunde wiederhergestellt,
  // damit man nach einem Neuladen noch eingeloggt ist
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const data = await ladeDaten(currentToken);
      if (currentToken) {
        const currentEmail = localStorage.getItem("email") ?? "";
        const echterKunde = data.kunden.find((k) => k.email === currentEmail);
        if (echterKunde) setCurrentUser(echterKunde);
      }    
    }
    init();
  }, []); // Leeres Array = nur einmal beim ersten Render ausführen


  // Einloggen:
  // Fetcht /login, speichert Token und Email im localStorage
  // und setzt aktiverKunde anhand der zurückgegebenen Kundenliste
  // ────────────────────────────────────────────────────────────────────────
  async function handleLogin() {
    setLoginFehler("");
    try {
      const data = await fetchLogin(loginEmail, loginPassword);
      setToken(data.token!);
      localStorage.setItem("token", data.token!);
      localStorage.setItem("email", loginEmail);

      const allData = await ladeDaten(data.token!);
      // Aktiven Kunden aus der geladenen Kundenliste heraussuchen
      setCurrentUser(allData.kunden.find((k) => k.email === loginEmail) ?? null);
      // Eingabefelder leeren
      setLoginEmail("");
      setLoginPassword("");
    } catch (message) {
      setLoginFehler(message as string);
    }
  }


  // Wird nach erfolgreichem /signup aufgerufen.
  // Verhält sich wie handleLogin – setzt Token, lädt Daten, setzt den aktiven Nutzer.
  // ────────────────────────────────────────────────────────────────────────
  async function handleAuthErfolg(newToken: string, email: string) {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("email", email);
    setZeigeRegistrieren(false);

    const data = await ladeDaten(newToken);
    setCurrentUser(data.kunden.find((k) => k.email === email) ?? null);
  }


  // Ausloggen:
  // Setzt alle Auth-States zurück und löscht Token und Email aus dem localStorage.
  // ────────────────────────────────────────────────────────────────────────
  function handleLogout() {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setCurrentUser(null);
    ladeDaten("");  // Nur noch Kurse laden (kein Token)
  }


  // Aktualisiert die Teilnehmeranzahl eines Kurses lokal im State.
  // Aktualisiert das kurse-Array des eingeloggten Kunden lokal im State.
  // So muss nach join/leave kein neuer /data Fetch gemacht werden.
  // ────────────────────────────────────────────────────────────────────────
  function aktualisiereTeilnahme(kursId: string, beigetreten: boolean) {

    // delta ist +1 beim Beitreten und -1 beim Verlassen.
    const delta = beigetreten ? 1 : -1;
    setKurse((prev) =>
      prev.map((k) =>
        // Nur den betroffenen Kurs aktualisieren, alle anderen unverändert lassen
        k._id === kursId ? { ...k, teilnehmer: k.teilnehmer + delta } : k
      )
    );


    setCurrentUser((prev) => {
      if (!prev) return prev;

      // Neues kurse-Array berechnen – ID hinzufügen oder entfernen
      const updatedKurseArray = beigetreten
        ? [...prev.kurse, kursId]
        : prev.kurse.filter((id) => id !== kursId);

    // Denselben Kunden auch im kunden State aktualisieren,
    // damit KursInfo und KundenInfo die Änderung sehen
      setKunden((prevKunden) =>
        prevKunden.map((k) =>
          k._id === prev._id ? { ...k, kurse: updatedKurseArray } : k
        )
      );

      // Aktualisierten currentUser zurückgeben
      return { ...prev, kurse: updatedKurseArray };
    });
  }


  // Jede Seite bekommt die aktuellen Daten als Props übergeben
  // ────────────────────────────────────────────────────────────────────────
  const PAGES: Record<string, JSX.Element> = {
    kursliste: (
      <Kursliste
        kurse={kurse}
        currentUser={currentUser}
        currentToken={currentToken}
        onTeilnahmeChange={aktualisiereTeilnahme}
      />
    ),
    kundenliste: <Kundenliste kunden={kunden} />,
    kursinfo: <KursInfo kurse={kurse} kunden={kunden} />,
    kundeninfo: <KundenInfo kurse={kurse} kunden={kunden} />,
  };


  // Aufbau des eigentlichen Grundriss
  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* Registrierungsmodal – nur rendern wenn zeigeRegistrieren true ist */}
      {zeigeRegistrieren && (
        <RegistrierenModal
          onClose={() => setZeigeRegistrieren(false)}
          onSuccess={handleAuthErfolg}
        />
      )}

      {/* HEADER */}
      <header className="header">
        <button className="logo" onClick={() => setActivePage("kursliste")}>
          Kursmanagement
        </button>
        <div className="login-area">
          {/* Wenn eingeloggt: Name und Ausloggen-Button anzeigen */}
          {currentUser ? (
            <>
              <span className="muted">Eingeloggt als {currentUser.name}</span>
              <button className="btn-secondary" onClick={handleLogout}>Ausloggen</button>
            </>
          ) : (
            /* Wenn nicht eingeloggt: Login-Felder und Registrieren-Button anzeigen */
            <>
              <input type="text" placeholder="E-Mail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <input type="password" placeholder="Passwort" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              {loginFehler && <span className="modal-fehler">{loginFehler}</span>}
              <button className="btn-primary" onClick={handleLogin}>Einloggen</button>
              <button className="btn-secondary" onClick={() => setZeigeRegistrieren(true)}>Registrieren</button>
            </>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="body">
        <nav className="sidebar">
          <div className="sidebar-label">Navigation</div>
          {NAVIGATION.map((item) => (
            <button
              key={item.key}
              // Das aktiven Item highlighten 
              className={`nav-btn${activePage === item.key ? " active" : ""}`}
              onClick={() => setActivePage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {/* Aktive Seite rendern */}
        <main className="main">{PAGES[activePage]}</main>
      </div>
    </div>
  );
}