import React, { useCallback, useEffect, useMemo, useState } from "react";

const SOURCE = "https://support.rockstargames.com/articles/sN5pEdFYZdlvijKXd6xpJ/grand-theft-auto-vi-launch-updates-ps5-xbox-series-x-or-s";

function formatDate(value) {
  if (!value) return "Datum niet vermeld";
  const d = new Date(value + "T12:00:00");
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric", month: "long", year: "numeric"
  }).format(d);
}

export default function App() {
  const [patches, setPatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState("");

  const loadPatches = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = `${import.meta.env.BASE_URL}patches.json?t=${Date.now()}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("Patchbestand is nog niet beschikbaar.");
      const data = await response.json();
      setPatches(Array.isArray(data.patches) ? data.patches : []);
      setLastChecked(data.checked_at || "");
    } catch (e) {
      setError("De updates konden niet worden geladen. Controleer je internetverbinding of probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatches();
    const onVisible = () => {
      if (document.visibilityState === "visible") loadPatches();
    };
    // Refresh patch data every five minutes while the page is open.
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadPatches();
    }, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(refreshTimer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadPatches]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patches;
    return patches.filter(p =>
      [p.version, p.title, p.date, p.category, ...(p.notes || [])]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [patches, query]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setSelected(null)} aria-label="GTA VI Patch Tracker home">
          <span className="brand-mark">VI</span>
          <span><strong>GTA VI</strong><small>PATCH TRACKER</small></span>
        </a>
        <a className="source-link" href={SOURCE} target="_blank" rel="noreferrer">ROCKSTAR ↗</a>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="live-dot" /> OFFICIËLE UPDATE TRACKER</div>
        <h1>{selected ? "Patchdetails" : "Alle patches."}<br /><em>Op één plek.</em></h1>
        <p>Volg de officiële GTA VI-updates rechtstreeks vanaf Rockstar Games.</p>
        <div className="hero-actions">
          {selected ? (
            <button className="secondary-btn" onClick={() => setSelected(null)}>← Alle patches</button>
          ) : (
            <button className="refresh-btn" onClick={loadPatches} disabled={loading}>
              {loading ? "Laden…" : "↻  Updates verversen"}
            </button>
          )}
          <span className="patch-count">{patches.length} {patches.length === 1 ? "update" : "updates"}</span>
        </div>
      </section>

      {selected ? (
        <section className="detail-panel">
          <div className="detail-meta">
            <span className="tag">{selected.category || "Rockstar update"}</span>
            <span>{formatDate(selected.date)}</span>
          </div>
          <h2>{selected.version || selected.title || "GTA VI-update"}</h2>
          <p className="detail-intro">{selected.title || "Officiële patchnotes"}</p>
          <div className="notes-list">
            {(selected.notes || []).map((note, i) => <div className="note" key={i}><span>+</span><p>{note}</p></div>)}
          </div>
          <a className="official-btn" href={selected.url || SOURCE} target="_blank" rel="noreferrer">
            Bekijk originele patchnotes bij Rockstar <span>↗</span>
          </a>
        </section>
      ) : (
        <section className="updates-section">
          <div className="section-heading">
            <div><span className="eyebrow">ARCHIEF</span><h2>Updategeschiedenis</h2></div>
            <div className="search-wrap"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Zoek patches…" /></div>
          </div>

          {loading && patches.length === 0 ? <div className="empty-state">Updates ophalen…</div> : null}
          {error ? <div className="error-state">{error}</div> : null}
          {!loading && !error && filtered.length === 0 ? (
            <div className="empty-state">{patches.length ? "Geen updates gevonden voor deze zoekopdracht." : "Nog geen updates gevonden. Probeer later opnieuw."}</div>
          ) : null}

          <div className="patch-list">
            {filtered.map((patch, index) => (
              <button className="patch-card" key={patch.id || index} onClick={() => setSelected(patch)}>
                <div className="patch-number">{String(filtered.length - index).padStart(2, "0")}</div>
                <div className="patch-main">
                  <div className="patch-date">{formatDate(patch.date)}</div>
                  <h3>{patch.version || patch.title || "GTA VI-update"}</h3>
                  <div className="patch-category">{patch.category || "Officiële update"}</div>
                </div>
                <span className="arrow">↗</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        <span>GTA VI PATCH TRACKER</span>
        <span>{lastChecked ? `Gecontroleerd: ${new Date(lastChecked).toLocaleString("nl-NL")}` : "Bron: Rockstar Games"}</span>
        <p>Een onafhankelijke fan-app. Niet verbonden aan Rockstar Games.</p>
      </footer>
    </main>
  );
}
