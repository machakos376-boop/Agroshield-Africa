import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LivestockPage({ t, user }) {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  async function analyze() {
    if (!symptoms.trim()) return;
    setLoading(true); setResult(null);
    try {
      const aiResult = await callAI(symptoms);
      await supabase.from("livestock_queries").insert({
        user_id: user.id, symptoms, ai_response: aiResult.response, urgency: aiResult.urgency,
      });
      setResult(aiResult);
      setHistory(prev => [{ symptoms, ...aiResult }, ...prev.slice(0, 4)]);
    } catch (err) {
      setResult({ error: err.message });
    }
    setLoading(false);
  }

  async function callAI(s) {
    await new Promise(r => setTimeout(r, 2000));
    const sl = s.toLowerCase();
    if (sl.includes("damu") || sl.includes("kupoteza fahamu") || sl.includes("blood")) {
      return { urgency: "urgent", badge: "🚨 Hatari — Piga Simu Daktari SASA", response: "Dalili zinaashiria hali ya dharura. HATUA: (1) Tenga mnyama SASA. (2) Piga simu daktari wa mifugo mara moja. (3) Usimruhusu mnyama kufanya kazi. Hali hii inaweza kuambukiza wengine." };
    } else if (sl.includes("homa") || sl.includes("makamasi") || sl.includes("kukohoa") || sl.includes("fever")) {
      return { urgency: "moderate", badge: "⚠️ Wastani — Wasiliana na Daktari Hivi Karibuni", response: "Dalili zinaashiria maambukizi ya njia ya upumuaji. HATUA: (1) Tenga mnyama. (2) Maji safi ya kutosha. (3) Hewa safi bila upepo mkali. (4) Daktari ndani ya saa 24." };
    } else if (sl.includes("kukula kidogo") || sl.includes("hamu") || sl.includes("appetite")) {
      return { urgency: "moderate", badge: "⚠️ Wastani — Fuatilia Kwa Makini", response: "Kupoteza hamu inaweza kuwa mabadiliko ya chakula, mfadhaiko, au ugonjwa wa awali. HATUA: (1) Angalia chakula. (2) Jaribu chakula kipya. (3) Pima joto. (4) Daktari baada ya saa 48 kama haiboreiki." };
    } else {
      return { urgency: "safe", badge: "✅ Hali Nzuri — Fuatilia Tu", response: "Dalili hazionekani hatarishi kwa sasa. MAPENDEKEZO: (1) Chakula cha kutosha na maji safi. (2) Angalia kwa siku 2-3. (3) Wasiliana na daktari kama dalili zitaongezeka. (4) Chanjo zote ziwe up-to-date." };
    }
  }

  const uStyle = {
    urgent:   { bg: "#FCEBEB", border: "#E24B4A", badgeBg: "#A32D2D" },
    moderate: { bg: "#FAEEDA", border: "#EF9F27", badgeBg: "#BA7517" },
    safe:     { bg: "#EAF3DE", border: "#97C459", badgeBg: "#3B6D11" },
  };

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.12)", padding: 20, marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>🐄 {t.livestock.title}</h2>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>{t.livestock.sub}</p>
        <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
          placeholder={t.livestock.placeholder} rows={4}
          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", resize: "vertical", marginBottom: 12, outline: "none", lineHeight: 1.6 }} />
        <button onClick={analyze} disabled={!symptoms.trim() || loading} style={{
          background: !symptoms.trim() ? "#ccc" : "#3B6D11", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
          cursor: !symptoms.trim() || loading ? "not-allowed" : "pointer",
        }}>{loading ? `⏳ ${t.livestock.analyzing}` : `📤 ${t.livestock.btn}`}</button>

        {result && !result.error && (() => {
          const s = uStyle[result.urgency] || uStyle.safe;
          return (
            <div style={{ marginTop: 16, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ background: s.badgeBg, color: "#fff", display: "inline-block", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{result.badge}</div>
              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>{result.response}</p>
            </div>
          );
        })()}
        {result?.error && <div style={{ marginTop: 12, background: "#FCEBEB", border: "1px solid #E24B4A", borderRadius: 8, padding: 12, fontSize: 13, color: "#A32D2D" }}>⚠️ {result.error}</div>}
      </div>

      {history.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.12)", padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📋 Historia</h3>
          {history.map((h, i) => (
            <div key={i} style={{ borderBottom: i < history.length - 1 ? "1px solid #f0f0f0" : "none", paddingBottom: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "#888" }}>"{h.symptoms.slice(0, 60)}..."</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: h.urgency === "urgent" ? "#A32D2D" : h.urgency === "moderate" ? "#BA7517" : "#3B6D11" }}>{h.badge}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
