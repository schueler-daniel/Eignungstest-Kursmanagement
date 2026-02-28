import { useState } from "react";
import { fetchSignup } from "../api";

// Modal: Registrieren
// Öffnet sich als Overlay über der App. Schickt die Formulardaten
// an /signup und gibt bei Erfolg Token und Email zurück.
// ────────────────────────────────────────────────────────────────────────

export function RegistrierenModal({ onClose, onSuccess }: {
  onClose:  () => void;
  onSuccess: (token: string, email: string) => void;
}) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ort, setOrt] = useState("");
  const [fehler, setFehler] = useState("");

  async function handleSubmit() {
    try {
      const data = await fetchSignup(name, email, password, ort);
      onSuccess(data.token!, email);
    } catch (message) {
      // Fehlermeldung vom Server anzeigen (z.B. "Email bereits vergeben")
      setFehler(message as string);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-title">Registrieren</div>
        <input className="modal-input" type="text" placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="modal-input" type="text" placeholder="E-Mail *" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="modal-input" type="password" placeholder="Passwort *" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="modal-input" type="text" placeholder="Ort (optional)" value={ort} onChange={(e) => setOrt(e.target.value)} />
        {/* Fehlermeldung nur anzeigen wenn vorhanden */}
        {fehler && <div className="modal-fehler">{fehler}</div>}
        <div className="modal-buttons">
          <button className="btn-secondary" onClick={onClose}>Abbrechen</button>
          <button className="btn-primary" onClick={handleSubmit}>Registrieren</button>
        </div>
      </div>
    </div>
  );
}