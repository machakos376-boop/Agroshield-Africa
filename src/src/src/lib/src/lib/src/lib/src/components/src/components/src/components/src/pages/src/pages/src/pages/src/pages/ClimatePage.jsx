import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { GEO } from "../lib/geo";

export default function ClimatePage({ t, user }) {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const countries = Object.keys(GEO).sort();
  const regions = country ? Object.keys(GEO[country]).sort() : [];
  const districts = country && region ? GEO[country][region] : [];

  function onCountry(e) { setCountry(e.target.value); setRegion(""); setDistrict(""); setResult(null); }
  function onRegion(e) { setRegion(e.target.value); setDistrict(""); setResult(null); }

  async function analyze() {
    if (!country) return;
    setLoading(true); setResult(null);
    try {
      const r = await callAI();
      await supabase.from("climate_alerts").insert({
        user_id: user.id, country, region: region || null, district: district || null,
        drought_risk: r.droughtRisk, flood_risk: r.floodRisk, recommendation: r.tips.join(" | "),
      });
      setResult(r);
    } catch (err) { setResult({ error: err.message }); }
    setLoading(false);
  }

  async function callAI() {
    await new Promise(r => setTimeout(r, 1800));
    const dV = Math.floor(Math.random() * 70) + 10;
    const fV = Math.floor(Math.random() * 60) + 10;
    const dL = dV > 60 ? "high" : dV > 35 ? "medium" : "low";
    const fL = fV > 55 ? "high" : fV > 30 ? "medium" : "low";
    const allTips = {
      high_drought: ["Tumia umwagiliaji wa matone (drip irrigation)", "Panda mazao yanayostahimili ukame: mtama, sorghum", "Akiba ya maji kwenye matangi ni muhimu sana"],
      medium_drought: ["Akiba ya maji ni muhimu", "Fuatilia mvua kila wiki"],
      low_drought: ["Hali nzuri ya kilimo — endelea na shughuli za kawaida"],
      high_flood: ["Epuka kupanda mbegu wiki hii", "Tengeneza mifereji ya maji shambani"],
      medium_flood: ["Angalia hali ya hewa kila siku", "Tengeneza njia za maji kupita"],
      low_flood: ["Wakati mzuri wa kupanda"],
    };
    const tips = [...(allTips[`${dL}_drought`] || []).slice(0, 2), ...(allTips[`${fL}_flood`] || []).slice(0, 2)];
    return { droughtRisk: dV, floodRisk: fV, tempC: Math.floor(Math.random() * 15) + 22, dLevel: dL, fLevel: fL, tips };
  }

  const lColor = {
    high:   { bg: "#FAECE7", border: "#F0997B", text: "#993C1D", bar: "#D85A30" },
    medium: { bg: "#FAEEDA", border: "#EF9F27", text: "#7A4D0A", bar: "#BA7517" },
    low:    { bg: "#EAF3DE", border: "#97C459", text: "#27500A", bar: "#639922" },
  };
  const sel = { width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 10px", fontSize: 13, fontFamily: "inherit", background: "#fff", outline: "none" };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.12)", padding: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>🌦️ {t.climate.title}</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>{t.climate.sub}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 3, fontWeight: 500 }}>{t.climate.country}</div>
          <select style={sel} value={country} onChange={onCountry}>
            <option value="">{t.climate.countryPh}</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 3, fontWeight: 500 }}>{t.climate.region}</div>
          <select style={{ ...sel, opacity: !country ? 0.4 : 1 }} value={region} onChange={onRegion} disabled={!country}>
            <option value="">{t.climate.regionPh}</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 3, fontWeight: 500 }}>{t.climate.district}</div>
          <select style={{ ...sel, opacity: !region ? 0.4 : 1 }} value={district} onChange={e => setDistrict(e.target.value)} disabled={!region}>
            <option value="">{t.climate.districtPh}</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <button onClick={analyze} disabled={!country || loading} style={{
        background: !country ? "#ccc" : "#3B6D11", color: "#fff", border: "none",
        padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
        cursor: !country || loading ? "not-allowed" : "pointer",
      }}>{loading ? `⏳ ${t.climate.analyzing}` : `🔍 ${t.climate.btn}`}</button>

      {result && !result.error && (() => {
        const d = lColor[result.dLevel], f = lColor[result.fLevel];
        return (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>📍 {[country, region, district].filter(Boolean).join(" › ")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: d.text, marginBottom: 4 }}>☀️ {t.climate.droughtRisk}</div>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{result.droughtRisk}%</div>
                <div style={{ height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${result.droughtRisk}%`, background: d.bar, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ background: f.bg, border: `1px solid ${f.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: f.text, marginBottom: 4 }}>🌧️ {t.climate.floodRisk}</div>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{result.floodRisk}%</div>
                <div style={{ height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${result.floodRisk}%`, background: f.bar, borderRadius: 3 }} />
                </div>
              </div>
            </div>
            <div style={{ background: "#E1F5EE", border: "1px solid #5DCAA5", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#0F6E56" }}>
              🌡️ Joto linatarajiwa: <strong>{result.tempC}°C</strong>
            </div>
            <div style={{ background: "#EAF3DE", border: "1px solid #97C459", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#3B6D11", marginBottom: 8 }}>💡 {t.climate.advice}</div>
              {result.tips.map((tip, i) => <div key={i} style={{ fontSize: 13, color: "#444", marginBottom: 5 }}>• {tip}</div>)}
            </div>
          </div>
        );
      })()}
      {result?.error && <div style={{ marginTop: 12, background: "#FCEBEB", border: "1px solid #E24B4A", borderRadius: 8, padding: 12, fontSize: 13, color: "#A32D2D" }}>⚠️ {result.error}</div>}
    </div>
  );
}
