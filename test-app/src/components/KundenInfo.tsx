import { useState } from "react";
import { Kurs, Kunde } from "../types";

// Seite: KundenInfo
// Split-Layout: Links eine klickbare Kundenliste, rechts die Details
// des ausgewählten Kunden inkl. belegter Kurse
// ────────────────────────────────────────────────────────────────────────

export function KundenInfo({ kurse, kunden }: { kurse: Kurs[]; kunden: Kunde[] }) {
  // Speichert die _id des aktuell ausgewählten Kunden
  const [activeItem, setActiveItem] = useState("");
  const aktiverKunde = kunden.find((k) => k._id === activeItem);

  return (
    <div>
      <div className="page-title">Kundeninformationen</div>
      <div className="split-layout">
        {/* Liste links */}
        <div className="list-panel">
          {kunden.map((k) => (
            <button
              key={k._id}
              // Den aktiven Kunde highlighten 
              className={`list-item${activeItem === k._id ? " active" : ""}`}
              onClick={() => setActiveItem(k._id)}
            >
              {k.name}
            </button>
          ))}
        </div>

        {/* Detailansicht rechts – nur wenn ein Kunde ausgewählt ist */}
        <div className="detail-panel">
          {!aktiverKunde ? (
            <div className="placeholder">← Kunde auswählen</div>
          ) : (
            <>
              <div className="detail-title">{aktiverKunde.name}</div>
              <div className="detail-row">
                <span className="detail-label">E-Mail</span>
                <span>{aktiverKunde.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ort</span>
                <span>{aktiverKunde.ort}</span>
              </div>
              <div className="section-head">Belegte Kurse</div>

              {/* Alle Kurse filtern, deren ID im kurse-Array des Kunden vorkommt */}
              {kurse
                .filter((k) => aktiverKunde.kurse.includes(k._id))
                .map((k) => (
                  <span key={k._id} className="chip">{k.name}</span>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}