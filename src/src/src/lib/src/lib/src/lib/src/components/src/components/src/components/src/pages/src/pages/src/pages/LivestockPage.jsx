 import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const ANIMALS = [
  { id: "cow",      label: "🐄 Ng'ombe" },
  { id: "goat",     label: "🐐 Mbuzi" },
  { id: "sheep",    label: "🐑 Kondoo" },
  { id: "chicken",  label: "🐔 Kuku" },
  { id: "pig",      label: "🐖 Nguruwe" },
  { id: "horse",    label: "🐴 Farasi" },
  { id: "camel",    label: "🐪 Ngamia" },
  { id: "rabbit",   label: "🐇 Sungura" },
];

const SYMPTOMS_LIST = [
  { id: "makamasi",    label: "💧 Kutokwa makamasi" },
  { id: "homa",        label: "🌡️ Homa / Mwili moto" },
  { id: "kukohoa",     label: "😮‍💨 Kukohoa" },
  { id: "kukula",      label: "🍽️ Kukula kidogo / kutokula" },
  { id: "kuharisha",   label: "💩 Kuharisha" },
  { id: "damu",        label: "🩸 Kutokwa damu" },
  { id: "kuvimba",     label: "🫧 Mwili kuvimba" },
  { id: "kutembea",    label: "🦵 Kutembea vibaya / kuumia miguu" },
  { id: "macho",       label: "👁️ Macho kuwa mekundu/kutoa maji" },
  { id: "ngozi",       label: "🟤 Ngozi kuwa na matatizo/vipele" },
  { id: "kupumua",     label: "😮‍💨 Kupumua kwa shida" },
  { id: "kutetemeka",  label: "😵 Kutetemeka / mshtuko" },
  { id: "uzalishaji",  label: "🥛 Maziwa kupungua ghafla" },
  { id: "mimba",       label: "🤰 Tatizo la mimba/kuzaa" },
];

const DURATION_OPTIONS = [
  { id: "leo",    label: "Leo tu (chini ya siku 1)" },
  { id: "siku3",  label: "Siku 2-3" },
  { id: "wiki",   label: "Wiki moja" },
  { id: "zaidi",  label: "Zaidi ya wiki 2" },
];

const URGENCY_STYLE = {
  urgent:   { bg: "#FCEBEB", border: "#E24B4A", badgeBg: "#A32D2D", icon: "🚨" },
  moderate: { bg: "#FAEEDA", border: "#EF9F27", badgeBg: "#BA7517", icon: "⚠️" },
  safe:     { bg: "#EAF3DE", border: "#97C459", badgeBg: "#3B6D11", icon: "✅" },
};

function diagnose(animal, symptoms, count, duration, vaccinated) {
  const s = symptoms;
  const hasDanger = s.includes("damu") || s.includes("kutetemeka") || s.includes("kupumua");
  const hasRespiratory = s.includes("makamasi") || s.includes("kukohoa") || s.includes("homa");
  const hasDigestive = s.includes("kuharisha") || s.includes("kukula");
  const hasSkin = s.includes("ngozi") || s.includes("kuvimba") || s.includes("macho");
  const manyAffected = count === "wengi";
  const longDuration = duration === "wiki" || duration === "zaidi";

  if (hasDanger || (manyAffected && longDuration)) {
    return {
      urgency: "urgent",
      badge: "🚨 DHARURA — Piga Simu Daktari SASA",
      disease: hasDanger && s.includes("damu") ? "Uwezekano wa Anthrax, FMD, au ugonjwa wa damu" :
               s.includes("kutetemeka") ? "Uwezekano wa Tetanus au Ugonjwa wa Neva" :
               "Mlipuko wa ugonjwa unaohitaji haraka",
      response: `Hali hii ni ya DHARURA kwa ${ANIMALS.find(a=>a.id===animal)?.label || "mnyama"} wako${manyAffected ? " (wanyama wengi wameathirika)" : ""}.\n\n` +
        "HATUA ZA HARAKA:\n" +
        "1. Tenga wanyama wote walioathirika SASA HIVI\n" +
        "2. Piga simu daktari wa mifugo wa wilaya yako mara moja\n" +
        "3. Usibeba mnyama mahali pengine — ugonjwa unaweza kuenea\n" +
        "4. Usimalize mnyama bila idhini ya daktari\n" +
        "5. Hakikisha maji safi na mahali pa starehe",
      tips: ["Tenga mnyama mara moja", "Piga simu daktari wa wilaya", "Taarisha jirani zako wafugaji"],
      medicine: "Usitumie dawa yoyote bila ushauri wa daktari — inaweza kufanya hali kuwa mbaya zaidi",
    };
  } else if (hasRespiratory) {
    return {
      urgency: "moderate",
      badge: "⚠️ Wastani — Tibu Ndani ya Saa 24",
      disease: animal === "chicken" ? "Uwezekano wa Newcastle Disease au Infectious Bronchitis" :
               "Uwezekano wa Pneumonia au Maambukizi ya Njia ya Upumuaji (CBPP)",
      response: `${ANIMALS.find(a=>a.id===animal)?.label || "Mnyama"} wako anaonyesha dalili za maambukizi ya njia ya upumuaji.\n\n` +
        "HATUA:\n" +
        "1. Tenga mnyama kutoka kwa wengine\n" +
        "2. Weka mahali penye hewa safi bila upepo mkali\n" +
        "3. Hakikisha ana maji safi na ya kutosha kila wakati\n" +
        `4. ${vaccinated === "hapana" ? "⚠️ Mnyama hajachanjwa — hii inazidisha hatari" : "Chanjo zilizo nzuri — hii inasaidia"}\n` +
        "5. Piga simu daktari kama hali haiboreki ndani ya saa 12",
      tips: ["Hewa safi na joto la kawaida", "Maji mengi safi", "Daktari ndani ya saa 24"],
      medicine: animal === "chicken" ?
        "Oxytetracycline, Tylosin — inapatikana dukani za dawa za mifugo (Tanzania, Kenya, Uganda)" :
        "Oxytetracycline LA, Penicillin-Streptomycin — omba daktari wa mifugo akupe maagizo sahihi",
    };
  } else if (hasDigestive) {
    return {
      urgency: "moderate",
      badge: "⚠️ Wastani — Fuatilia na Tibu",
      disease: s.includes("kuharisha") && s.includes("damu") ? "Uwezekano wa Coccidiosis au Hemorrhagic Enteritis" :
               "Uwezekano wa Gastroenteritis au Tatizo la Chakula",
      response: `${ANIMALS.find(a=>a.id===animal)?.label || "Mnyama"} wako ana tatizo la utumbo.\n\n` +
        "HATUA:\n" +
        "1. Angalia chakula — je, kuna kitu kipya alichokula?\n" +
        "2. Toa maji mengi safi — kuzuia kukausha mwili (dehydration)\n" +
        "3. Punguza malisho mazito kwa siku 1-2\n" +
        "4. Angalia kama wanyama wengine wana dalili hizo hizo\n" +
        "5. Kama kuharisha kuna damu — piga simu daktari SASA",
      tips: ["Maji mengi kuzuia dehydration", "Angalia chakula", "Wasiliana na daktari kama kuharisha na damu"],
      medicine: "ORS (Oral Rehydration Salts) kwa maji — inapatikana duka la dawa. Kwa maambukizi: Metronidazole au Amprolium (omba daktari)",
    };
  } else if (hasSkin) {
    return {
      urgency: "moderate",
      badge: "⚠️ Wastani — Tibu Wiki Hii",
      disease: s.includes("ngozi") ? "Uwezekano wa Lumpy Skin Disease, Mange, au Ringworm" :
               s.includes("macho") ? "Uwezekano wa Pinkeye (Conjunctivitis) au Infection ya Macho" :
               "Tatizo la Ngozi au Viungo vya Nje",
      response: `${ANIMALS.find(a=>a.id===animal)?.label || "Mnyama"} wako ana tatizo la ngozi au viungo vya nje.\n\n` +
        "HATUA:\n" +
        "1. Angalia mwili wote wa mnyama kwa makini\n" +
        "2. Tenga mnyama — magonjwa ya ngozi yanaweza kuambukiza\n" +
        "3. Safisha eneo lililoathirika kwa maji safi\n" +
        "4. Piga dawa ya wadudu kama unaona viroboto/kupe\n" +
        "5. Wasiliana na daktari kama vidonda vina usaha au vinazidi",
      tips: ["Tenga mnyama", "Safisha vidonda", "Angalia wadudu kama kupe/viroboto"],
      medicine: "Kwa mange: Ivermectin injection au dip — dukani za dawa za mifugo. Kwa macho: Oxytetracycline eye ointment",
    };
  } else {
    return {
      urgency: "safe",
      badge: "✅ Hali Nzuri — Endelea Kuangalia",
      disease: "Dalili za kawaida — siyo za kutisha kwa sasa",
      response: `${ANIMALS.find(a=>a.id===animal)?.label || "Mnyama"} wako anaonyesha dalili ambazo bado hazijafikia kiwango cha hatari.\n\n` +
        "MAPENDEKEZO:\n" +
        "1. Hakikisha mnyama ana chakula cha kutosha na cha lishe nzuri\n" +
        "2. Maji safi kila wakati — angalia kila asubuhi na jioni\n" +
        "3. Angalia mnyama mara mbili kwa siku kwa siku 3 zijazo\n" +
        `4. ${vaccinated === "hapana" ? "⚠️ Fikiria kumchanja mnyama — zungumza na daktari wa mifugo" : "Chanjo nzuri — endelea na ratiba ya chanjo"}\n` +
        "5. Wasiliana na daktari wa mifugo kama dalili zitaongezeka",
      tips: ["Chakula na maji bora", "Angalia mara mbili kwa siku", "Chanjo za kawaida"],
      medicine: "Hakuna dawa inayohitajika kwa sasa — endelea kutunza vizuri tu",
    };
  }
}

export default function LivestockPage({ t, user }) {
  const [animal, setAnimal] = useState("");
  const [checkedSymptoms, setCheckedSymptoms] = useState([]);
  const [extraSymptoms, setExtraSymptoms] = useState("");
  const [count, setCount] = useState("mmoja");
  const [duration, setDuration] = useState("");
  const [vaccinated, setVaccinated] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  function toggleSymptom(id) {
    setCheckedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    setResult(null);
  }

  const canAnalyze = animal && (checkedSymptoms.length > 0 || extraSymptoms.trim()) && duration;

  async function analyze() {
    if (!canAnalyze) return;
    setLoading(true);
    setResult(null);
    try {
      const aiResult = diagnose(animal, checkedSymptoms, count, duration, vaccinated);
      const allSymptoms = [
        ...checkedSymptoms.map(id => SYMPTOMS_LIST.find(s => s.id === id)?.label || id),
        ...(extraSymptoms.trim() ? [extraSymptoms.trim()] : []),
      ].join(", ");

      await supabase.from("livestock_queries").insert({
        user_id: user.id,
        symptoms: allSymptoms,
        ai_response: aiResult.response,
        urgency: aiResult.urgency,
      });

      setResult({ ...aiResult, animal, allSymptoms });
      setHistory(prev => [{ animal, badge: aiResult.badge, urgency: aiResult.urgency, disease: aiResult.disease, allSymptoms }, ...prev.slice(0, 4)]);
    } catch (err) {
      setResult({ error: err.message });
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={card}>
        <h2 style={title}>🐄 {t.livestock.title}</h2>
        <p style={sub}>{t.livestock.sub}</p>

        {/* STEP 1: Aina ya mnyama */}
        <div style={{ marginBottom: 16 }}>
          <div style={stepLabel}>Hatua 1 — Chagua Aina ya Mnyama</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {ANIMALS.map(a => (
              <button key={a.id} onClick={() => { setAnimal(a.id); setResult(null); }}
                style={{
                  padding: "8px 4px", borderRadius: 8, border: "1.5px solid",
                  borderColor: animal === a.id ? "#3B6D11" : "#e5e7eb",
                  background: animal === a.id ? "#EAF3DE" : "#fff",
                  cursor: "pointer", fontSize: 12,
                  fontWeight: animal === a.id ? 600 : 400,
                  color: animal === a.id ? "#3B6D11" : "#444",
                }}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2: Dalili (checkboxes) */}
        <div style={{ marginBottom: 14 }}>
          <div style={stepLabel}>Hatua 2 — Chagua Dalili Unazoziona</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
            {SYMPTOMS_LIST.map(s => (
              <label key={s.id} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                border: "1px solid",
                borderColor: checkedSymptoms.includes(s.id) ? "#3B6D11" : "#e5e7eb",
                background: checkedSymptoms.includes(s.id) ? "#EAF3DE" : "#fff",
              }}>
                <input type="checkbox" checked={checkedSymptoms.includes(s.id)}
                  onChange={() => toggleSymptom(s.id)}
                  style={{ accentColor: "#3B6D11", width: 14, height: 14 }} />
                <span style={{ fontSize: 12, color: checkedSymptoms.includes(s.id) ? "#3B6D11" : "#444", fontWeight: checkedSymptoms.includes(s.id) ? 600 : 400 }}>
                  {s.label}
                </span>
              </label>
            ))}
          </div>
          {/* Dalili za ziada */}
          <textarea value={extraSymptoms} onChange={e => { setExtraSymptoms(e.target.value); setResult(null); }}
            placeholder="Dalili nyingine ambazo hukuona orodha (andika hapa)..."
            rows={2}
            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none" }} />
        </div>

        {/* STEP 3: Idadi na Muda */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <div style={stepLabel}>Hatua 3 — Wanyama Wangapi?</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ id: "mmoja", label: "Mmoja tu" }, { id: "wengi", label: "Wengi (2+)" }].map(o => (
                <button key={o.id} onClick={() => setCount(o.id)} style={{
                  flex: 1, padding: "8px 6px", borderRadius: 8, border: "1.5px solid",
                  borderColor: count === o.id ? "#3B6D11" : "#e5e7eb",
                  background: count === o.id ? "#EAF3DE" : "#fff",
                  cursor: "pointer", fontSize: 12,
                  fontWeight: count === o.id ? 600 : 400,
                  color: count === o.id ? "#3B6D11" : "#444",
                }}>{o.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={stepLabel}>Hatua 4 — Dalili Zimechukua Muda Gani?</div>
            <select value={duration} onChange={e => { setDuration(e.target.value); setResult(null); }}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 10px", fontSize: 13, fontFamily: "inherit", background: "#fff", outline: "none" }}>
              <option value="">-- Chagua --</option>
              {DURATION_OPTIONS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          </div>
        </div>

        {/* STEP 4: Chanjo */}
        <div style={{ marginBottom: 16 }}>
          <div style={stepLabel}>Hatua 5 — Je, Mnyama Amechanjwa?</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ id: "ndiyo", label: "✅ Ndiyo, amechanjwa" }, { id: "hapana", label: "❌ Hapana / Sijui" }].map(o => (
              <button key={o.id} onClick={() => setVaccinated(o.id)} style={{
                flex: 1, padding: "8px 6px", borderRadius: 8, border: "1.5px solid",
                borderColor: vaccinated === o.id ? "#3B6D11" : "#e5e7eb",
                background: vaccinated === o.id ? "#EAF3DE" : "#fff",
                cursor: "pointer", fontSize: 12,
                fontWeight: vaccinated === o.id ? 600 : 400,
                color: vaccinated === o.id ? "#3B6D11" : "#444",
              }}>{o.label}</button>
            ))}
          </div>
        </div>

        {/* Analyze button */}
        <button onClick={analyze} disabled={!canAnalyze || loading} style={{
          background: !canAnalyze ? "#ccc" : "#3B6D11",
          color: "#fff", border: "none", padding: "11px 24px",
          borderRadius: 8, fontSize: 14, fontWeight: 600, width: "100%",
          cursor: !canAnalyze || loading ? "not-allowed" : "pointer",
        }}>
          {loading ? `⏳ ${t.livestock.analyzing}` : `📤 ${t.livestock.btn}`}
        </button>

        {/* Matokeo */}
        {result && !result.error && (() => {
          const s = URGENCY_STYLE[result.urgency] || URGENCY_STYLE.safe;
          return (
            <div style={{ marginTop: 16, background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ background: s.badgeBg, color: "#fff", display: "inline-block", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                {result.badge}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 8 }}>
                🔬 {result.disease}
              </div>
              <div style={{ fontSize: 13, color: "#333", lineHeight: 1.8, marginBottom: 10, background: "rgba(255,255,255,0.6)", padding: "10px 12px", borderRadius: 8, whiteSpace: "pre-line" }}>
                {result.response}
              </div>
              <div style={{ fontSize: 13, color: "#333", lineHeight: 1.7, background: "rgba(255,255,255,0.6)", padding: "10px 12px", borderRadius: 8 }}>
                <strong>💊 Dawa:</strong> {result.medicine}
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

      {/* Historia */}
      {history.length > 0 && (
        <div style={card}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📋 Historia ya Maswali</h3>
          {history.map((h, i) => {
            const s = URGENCY_STYLE[h.urgency] || URGENCY_STYLE.safe;
            return (
              <div key={i} style={{ borderBottom: i < history.length - 1 ? "1px solid #f0f0f0" : "none", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{ANIMALS.find(a => a.id === h.animal)?.label} — {h.disease}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{h.allSymptoms}</div>
                <div style={{ fontSize: 11, color: s.badgeBg, fontWeight: 600 }}>{h.badge}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const card = { background: "#fff", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.12)", padding: 20, marginBottom: 12 };
const title = { fontSize: 16, fontWeight: 600, marginBottom: 6, color: "#1a1a1a" };
const sub = { fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 };
const stepLabel = { fontSize: 12, fontWeight: 600, color: "#3B6D11", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 };
