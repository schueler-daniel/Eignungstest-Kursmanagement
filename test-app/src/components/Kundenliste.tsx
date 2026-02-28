import { Kunde } from "../types";

// Seite: Kundenliste
// Zeigt alle Kunden in Kartenform (nur sichtbar wenn eingeloggt,
// da der Server ohne Token keine Kunden zurückschickt)
// ────────────────────────────────────────────────────────────────────────

export function Kundenliste({ kunden }: { kunden: Kunde[] }) {
  return (
    <div>
      <div className="page-title">Kundenliste</div>
      <div className="grid">
        {kunden.map((k) => (
          <div key={k._id} className="card">
            <div className="card-title">{k.name}</div>
            <div className="muted">{k.email}</div>
            <div className="muted">🌍 {k.ort}</div>
            <div className="muted-top">Kurse: {k.kurse.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
}