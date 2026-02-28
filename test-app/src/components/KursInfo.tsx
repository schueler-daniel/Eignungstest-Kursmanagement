import { useState } from "react";
import { Kurs, Kunde } from "../types";

// Seite: KursInfo
// Split-Layout: Links eine klickbare Kursliste, rechts die Details
// des ausgewählten Kurses inkl. teilnehmender Kunden
// ────────────────────────────────────────────────────────────────────────

export function KursInfo({ kurse, kunden }: { kurse: Kurs[]; kunden: Kunde[] }) {
  // Speichert die _id des aktuell ausgewählten Kurses
  const [activeItem, setActiveItem] = useState("");
  const aktiverKurs = kurse.find((k) => k._id === activeItem);

  return (
    <div>
      <div className="page-title">Kursinformationen</div>
      <div className="split-layout">
        {/* Liste links */}
        <div className="list-panel">
          {kurse.map((k) => (
            <button
              key={k._id}
              // Den aktiven Kurs highlighten 
              className={`list-item${activeItem === k._id ? " active" : ""}`}
              onClick={() => setActiveItem(k._id)}
            >
              {k.name}
            </button>
          ))}
        </div>
        
        {/* Detailansicht rechts – nur wenn ein Kurs ausgewählt ist */}
        <div className="detail-panel">
          {!aktiverKurs ? (
            <div className="placeholder">← Kurs auswählen</div>
          ) : (
            <>
              <div className="detail-title">{aktiverKurs.name}</div>
              <div className="detail-row">
                <span className="detail-label">Level</span>
                <span>{aktiverKurs.level}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dauer</span>
                <span>{aktiverKurs.dauer}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Beschreibung</span>
                <span>{aktiverKurs.beschreibung}</span>
              </div>
              <div className="section-head">Teilnehmende Kunden</div>

              {/* Alle Kunden filtern, die diese Kurs-ID in ihrem kurse-Array haben */}
              {kunden
                .filter((k) => k.kurse.includes(aktiverKurs._id))
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