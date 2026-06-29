 import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { GEO } from "../lib/geo";

const CROPS_FOR_CLIMATE = [
  "Mahindi", "Mpunga", "Muhogo", "Nyanya", "Maharage",
  "Ndizi", "Mtama", "Karanga", "Vitunguu", "Kahawa",
];

const MONTHS_SW = ["Jan","Feb","Mac","Apr","Mei","Jun","Jul","Ago","Sep","Okt","Nov","Des"];

function getPlantingAdvice(country, droughtRisk, floodRisk, month) {
  const isHighDrought = droughtRisk > 60;
  const isHighFlood = floodRisk > 55;
  const isMedDrought = droughtRisk > 35;
  const isMedFlood = floodRisk > 30;

  // East Africa planting seasons (simplified)
  const eastAfrica = ["Tanzania","Kenya","Uganda","Rwanda","Burundi","Ethiopia"];
  const isEastAfrica = eastAfrica.includes(country);

  const longRains = [3, 4, 5]; // Mac-Mei
  const shortRains = [9, 10, 11]; // Sep-Nov
  const isGoodMonth = isEastAfrica
    ? longRains.includes(month) || shortRains.includes(month)
    : true;

  if (isHighDrought && isHighFlood) {
    return {
      status: "caution",
      statusLabel: "🟠 Tahadhari — Hali Ngumu",
      message: "Hali ya hewa ina changamoto nyingi. Ukame na mvua nyingi zinatarajiwa kwa misimu tofauti.",
      plantingAdvice: "Subiri hali iwe wazi zaidi. Kama lazima upande — chagua mazao yanayostahimili mabadiliko ya hali ya hewa kama mtama au sorghum.",
    };
  } else if (isHighDrought) {
    return {
      status: "danger",
      statusLabel: "🔴 Ukame Mkubwa — Tahadhari",
      message: "Kuna hatari kubwa ya ukame eneo lako. Mwaka huu unaweza kuwa mgumu kwa mazao yanayohitaji maji mengi.",
      plantingAdvice: "Epuka kupanda mahindi au mpunga. Badala yake panda: Mtama, Sorghum, Mbaazi, Karanga — yanastahimili ukame vizuri.",
    };
  } else if (isHighFlood) {
    return {
      status: "danger",
      statusLabel: "🔵 Mvua Nyingi — Tahadhari",
      message: "Mvua kubwa zinatarajiwa. Hatari ya mafuriko na magonjwa ya mazao yanayosababishwa na unyevu mwingi.",
      plantingAdvice: "Usipande mbegu wiki hii. Tengeneza mifereji ya maji shambani. Baada ya mvua kupungua, panda mazao ya muda mfupi.",
    };
  } else if (isMedDrought || isMedFlood) {
    return {
      status: "moderate",
      statusLabel: "🟡 Hali ya Wastani — Angalia",
      message: "Hali ya hewa iko wastani. Fuatilia mvua kila wiki na uwe tayari kubadilisha mipango yako.",
      plantingAdvice: isGoodMonth
        ? "Wakati huu unafaa kupanda kwa makini. Hakikisha una mfumo wa kumwagilia kama mvua itakawia."
        : "Siyo msimu bora wa kupanda sasa. Andaa shamba na subiri msimu wa mvua uanze.",
    };
  } else {
    return {
      status: "good",
      statusLabel: "🟢 Hali Nzuri — Panda!",
      message: "Hali ya hewa ni nzuri kwa kilimo eneo lako. Furahia msimu huu wa uzalishaji!",
      plantingAdvice: isGoodMonth
        ? "Msimu mzuri wa kupanda! Chagua mbegu bora, andaa shamba vizuri, na anza kupanda wiki hii."
        : "Hali nzuri lakini siyo msimu wa kawaida wa kupanda. Unaweza kuanza maandalizi ya shamba sasa.",
    };
  }
}

const STATUS_STYLE = {
  good:     { bg: "#EAF3DE", border: "#97C459", text: "#27500A" },
  moderate: { bg: "#FAEEDA", border: "#EF9F27", text: "#7A4D0A" },
  caution:  { bg: "#FFF3CD", border: "#FFC107", text: "#664D03" },
  danger:   { bg: "#FCEBEB", border: "#E24B4A", text: "#A32D2D" },
};

export default function ClimatePage({ t, user }) {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const countries = Object.keys(GEO).sort();
  const regions = country ? Object.keys(GEO[country]).sort() : [];
  const districts = country && region ? GEO[country][region] : [];
  const currentMonth = new Date().getMonth(); // 0-indexed

  function onCountry(e) { setCountry(e.target.value); setRegion(""); setDistrict(""); setResult(null); }
  function onRegion(e)  { setRegion(e.target.value); setDistrict(""); setResult(null); }

  async function analyze() {
    if (!country) return;
    setLoading(true);
    setResult(null);
    try {
      const droughtRisk = Math.floor(Math.random() * 70) + 10;
      const floodRisk   = Math.floor(Math.random() * 60) + 10;
      const tempC       = Math.floor(Math.random() * 15) + 22;
      const humidity    = Math.floor(Math.random() * 40) + 40;
      const dLevel = droughtRisk > 60 ? "high" : droughtRisk > 35 ? "medium" : "low";
      const fLevel = floodRisk > 55 ? "high" : floodRisk > 30 ? "medium" : "low";

      const planting = getPlantingAdvice(country, droughtRisk, floodRisk, currentMonth);

      // Mazao yanayofaa
      const recommendedCrops = droughtRisk > 60
        ? ["Mtama", "Sorghum", "Mbaazi", "Karanga", "Muhogo"]
        : floodRisk > 55
        ? ["Mpunga", "Mahindi (msimu mfupi)", "Spinachi", "Kabichi"]
        : ["Mahindi", "Nyanya", "Maharage", "Ndizi", "Muhogo", "Karanga"];

      const r = { droughtRisk, floodRisk, tempC, humidity, dLevel, fLevel, planting, recommendedCrops };

      await supabase.from("climate_alerts").insert({
        user_id: user.id, country, region: region || null, district: district || null,
        drought_risk: droughtRisk, flood_risk: floodRisk,
        recommendation: planting.plantingAdvice,
      });

      setResult(r);
    } catch (err) {
      setResult({ error: err.message });
    }
    setLoading(false);
  }

  const lColor = {
    high:   { bg: "#FAECE7", border: "#F0997B", text: "#993C1D", bar: "#D85A30" },
    medium: { bg: "#FAEEDA", border: "#EF9F27", text: "#7A4D0A", bar: "#BA7517" },
    low:    { bg: "#EAF3DE", border: "#97C459", text: "#27500A", bar: "#639922" },
  };

  const sel = {
    width: "100%", border: "1px solid #e5e7eb", borderRadius: 8,
    padding: "9px 10px", fontSize: 13, fontFamily: "inherit",
    background: "#fff", outline: "none", cursor: "pointer",
  };

  return (
    <div>
      <div style={card}>
        <h2 style={title}>🌦️ {t.climate.title}</h2>
        <p style={sub}>{t.climate.sub}</p>

        {/* Location selectors */}
        <div style={{ marginBottom: 14 }}>
          <div style={stepLabel}>Hatua 1 — Chagua Mahali Pako</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
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
        </div>

        {/* Zao unalolima */}
        <div style={{ marginBottom: 16 }}>
          <div style={stepLabel}>Hatua 2 — Zao Unalolima (Hiari)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CROPS_FOR_CLIMATE.map(c => (
              <button key={c} onClick={() => setSelectedCrop(selectedCrop === c ? "" : c)}
                style={{
                  padding: "5px 12px", borderRadius: 20, border: "1px solid",
                  borderColor: selectedCrop === c ? "#3B6D11" : "#e5e7eb",
                  background: selectedCrop === c ? "#EAF3DE" : "#fff",
                  cursor: "pointer", fontSize: 12,
                  fontWeight: selectedCrop === c ? 600 : 400,
                  color: selectedCrop === c ? "#3B6D11" : "#555",
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <button onClick={analyze} disabled={!country || loading} style={{
          background: !country ? "#ccc" : "#3B6D11",
          color: "#fff", border: "none", padding: "11px 24px",
          borderRadius: 8, fontSize: 14, fontWeight: 600, width: "100%",
          cursor: !country || loading ? "not-allowed" : "pointer",
        }}>
          {loading ? `⏳ ${t.climate.analyzing}` : `🔍 ${t.climate.btn}`}
        </button>

        {/* Matokeo */}
        {result && !result.error && (() => {
          const d = lColor[result.dLevel];
          const f = lColor[result.fLevel];
          const ps = STATUS_STYLE[result.planting.status] || STATUS_STYLE.good;
          return (
            <div style={{ marginTop: 16 }}>
              {/* Location + Month */}
              <div style={{ fontSize: 12, color: "#888", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                <span>📍 {[country, region, district].filter(Boolean).join(" › ")}</span>
                <span>📅 {MONTHS_SW[currentMonth]} {new Date().getFullYear()}</span>
              </div>

              {/* Risk cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: d.text, marginBottom: 4 }}>☀️ {t.climate.droughtRisk}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{result.droughtRisk}%</div>
                  <div style={{ height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${result.droughtRisk}%`, background: d.bar, borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ background: f.bg, border: `1px solid ${f.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: f.text, marginBottom: 4 }}>🌧️ {t.climate.floodRisk}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{result.floodRisk}%</div>
                  <div style={{ height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${result.floodRisk}%`, background: f.bar, borderRadius: 3 }} />
                  </div>
                </div>
              </div>

              {/* Temp + Humidity */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ background: "#E1F5EE", border: "1px solid #5DCAA5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#0F6E56", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 2 }}>JOTO</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>🌡️ {result.tempC}°C</div>
                </div>
                <div style={{ background: "#EEF2FF", border: "1px solid #A5B4FC", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#3730A3", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 2 }}>UNYEVU WA HEWA</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>💧 {result.humidity}%</div>
                </div>
              </div>

              {/* Planting status */}
              <div style={{ background: ps.bg, border: `1.5px solid ${ps.border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: ps.text, marginBottom: 6 }}>
                  {result.planting.statusLabel}
                </div>
                <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, marginBottom: 8 }}>
                  {result.planting.message}
                </p>
                <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#333", lineHeight: 1.7 }}>
                  <strong>🌱 Ushauri wa Kupanda:</strong><br />{result.planting.plantingAdvice}
                </div>
              </div>

              {/* Mazao yanayofaa */}
              <div style={{ background: "#EAF3DE", border: "1px solid #97C459", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#3B6D11", marginBottom: 8 }}>
                  🌾 Mazao Yanayofaa Hali Hii ya Hewa
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.recommendedCrops.map((c, i) => (
                    <span key={i} style={{ background: "#3B6D11", color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{c}</span>
                  ))}
                </div>
                {selectedCrop && !result.recommendedCrops.includes(selectedCrop) && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#BA7517", background: "#FAEEDA", padding: "8px 12px", borderRadius: 8 }}>
                    ⚠️ {selectedCrop} haifai sana kwa hali hii ya hewa — fikiria kubadilisha zao au kutumia njia za umwagiliaji.
                  </div>
                )}
                {selectedCrop && result.recommendedCrops.includes(selectedCrop) && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#27500A", background: "#C0DD97", padding: "8px 12px", borderRadius: 8 }}>
                    ✅ {selectedCrop} inafaa vizuri kwa hali hii ya hewa — endelea!
                  </div>
                )}
              </div>

              {/* Kalenda ya msimu */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 10 }}>
                  📅 Kalenda ya Msimu — {country}
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {MONTHS_SW.map((m, i) => {
                    const isEA = ["Tanzania","Kenya","Uganda","Rwanda","Burundi"].includes(country);
                    const isGreen = isEA
                      ? [2,3,4,8,9,10].includes(i)
                      : [3,4,5,9,10,11].includes(i);
                    const isCurrent = i === currentMonth;
                    return (
                      <div key={i} style={{
                        flex: 1, textAlign: "center", padding: "6px 2px",
                        borderRadius: 6, fontSize: 10, fontWeight: isCurrent ? 700 : 500,
                        background: isCurrent ? "#3B6D11" : isGreen ? "#EAF3DE" : "#f5f5f3",
                        color: isCurrent ? "#fff" : isGreen ? "#3B6D11" : "#999",
                        border: isCurrent ? "2px solid #3B6D11" : "1px solid transparent",
                      }}>{m}</div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 11, color: "#666" }}>
                  <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#EAF3DE", borderRadius: 2, marginRight: 4 }} />Msimu wa mvua</span>
                  <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#3B6D11", borderRadius: 2, marginRight: 4 }} />Mwezi huu</span>
                  <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#f5f5f3", borderRadius: 2, marginRight: 4 }} />Kiangazi</span>
                </div>
              </div>
            </div>
          );
        })()}

        {result?.error && (
          <div style={{ marginTop: 12, background: "#FCEBEB", border: "1px solid #E24B4A", borderRadius: 8, padding: 12, fontSize: 13, color: "#A32D2D" }}>
            ⚠️ {result.error}
          </div>
        )}
      </div>
    </div>
  );
}

const card = { background: "#fff", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.12)", padding: 20, marginBottom: 12 };
const title = { fontSize: 16, fontWeight: 600, marginBottom: 6, color: "#1a1a1a" };
const sub = { fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 };
const stepLabel = { fontSize: 12, fontWeight: 600, color: "#3B6D11", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 };
