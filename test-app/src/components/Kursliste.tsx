import { Kurs, Kunde } from "../types";
import { fetchJoinLeave } from "../api";

// Seite: Kursliste
// Zeigt alle Kurse als Karten. Wenn ein Kunde eingeloggt ist,
// erscheint pro Karte ein "Beitreten" oder "Verlassen" Button.
// ────────────────────────────────────────────────────────────────────────

export function Kursliste({ kurse, currentUser, currentToken, onTeilnahmeChange }: {
  kurse: Kurs[];
  currentUser: Kunde | null;
  currentToken: string;
  onTeilnahmeChange: (kursId: string, beigetreten: boolean) => void;
}) {

  // Wird aufgerufen wenn der Nutzer auf "Beitreten" oder "Verlassen" klickt.
  // Entscheidet anhand des aktuellen Zustands welche Route gefetcht wird.
  async function handleJoinLeave(kurs: Kurs) {
    const imKurs = currentUser?.kurse.includes(kurs._id);
    const route = imKurs ? "/leave" : "/join";

    const success = await fetchJoinLeave(route, currentUser?.email ?? "", kurs._id, currentToken);

    // Nur wenn der Server erfolgreich antwortet, den lokalen State aktualisieren
    if (success) {
      onTeilnahmeChange(kurs._id, !imKurs);
    }
  }

  return (
    <div>
      <div className="page-title">Kursliste</div>
      <div className="grid">
        {kurse.map((k) => {
          // Prüfen ob der eingeloggte Kunde bereits in diesem Kurs ist
          const imKurs = currentUser?.kurse.includes(k._id);
          return (
            <div key={k._id} className="card">
              <div className="badge">{k.level}</div>
              <div className="card-title">{k.name}</div>
              <div className="muted">Dauer: {k.dauer}</div>
              <div className="muted">Teilnehmer: {k.teilnehmer}</div>
              {/* Button nur anzeigen wenn jemand eingeloggt ist */}
              {currentUser && (
                <div style={{ textAlign: "right", marginTop: "12px" }}>
                  <button
                    className={imKurs ? "btn-secondary" : "btn-primary"}
                    onClick={() => handleJoinLeave(k)}
                  >
                    {imKurs ? "Verlassen" : "Beitreten"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}