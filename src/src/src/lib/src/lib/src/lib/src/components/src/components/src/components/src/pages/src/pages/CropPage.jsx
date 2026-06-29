import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function CropPage({ t, user }) {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
  }

  async function analyze() {
    if (!image) return;
    setLoading(true); setResult(null);
    try {
      const filePath = `crops/${user.id}/${Date.now()}_${image.name}`;
      const { error: upErr } = await supabase.storage.from("agroshield-images").upload(filePath, image);
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("agroshield-images").getPublicUrl(filePath);
      const aiResult = await callAI();
      await supabase.from("crop_diagnosis").insert({
        user_id: user.id, image_url: urlData.publicUrl,
        disease: aiResult.disease, confidence: aiResult.confidence,
        recommendation: aiResult.recommendation,
      });
      setResult(aiResult);
    } catch (err) {
      setResult({ error: err.message });
    }
    setLoading(false);
  }

  async function callAI() {
    await new Promise(r => setTimeout(r, 2000));
    const list = [
      { disease: "Maize Leaf Blight", confidence: 94, severity: "high", recommendation: "Tumia dawa ya ukungu (fungicide) mara moja. Ondoa majani yaliyoathirika. Epuka kumwagilia juu ya majani asubuhi. Rudia dawa baada ya siku 7." },
      { disease: "Cassava Brown Streak", confidence: 87, severity: "high", recommendation: "Ng'oa mimea yote iliyoathirika. Tumia mbegu safi zilizoidhinishwa. Piga dawa ya wadudu wanaoeneza ugonjwa." },
      { disease: "Tomato Early Blight", confidence: 78, severity: "medium", recommendation: "Tumia dawa ya shaba (copper fungicide). Acha nafasi ya kutosha kati ya mimea. Mwagilia chini ya mmea tu." },
      { disease: "Bean Rust", confidence: 82, severity: "medium", recommendation: "Piga dawa ya mancozeb. Ondoa majani yaliyoathirika. Epuka kupanda mahali pale pale kila mwaka." },
      { disease: "Rice Blast", confidence: 91, severity: "high", recommendation: "Tumia dawa ya tricyclazole mara moja. Punguza mbolea ya nitrojeni. Mwagilia vizuri bila kuzidisha." },
    ];
    return list[Math.floor(Math.random() * list.length)];
  }

  const sColor = {
    high:   { bg: "#FCEBEB", border: "#E24B4A", badge: "#A32D2D" },
    medium: { bg: "#FAEEDA", border: "#EF9F27", badge: "#BA7517" },
    low:    { bg: "#EAF3DE", border: "#97C459", badge: "#3B6D11" },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.12)", padding: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>🌿 {t.crop.title}</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>{t.crop.sub}</p>

      {!imageUrl ? (
        <label style={{ display: "block", border: "1.5px dashed #639922", borderRadius: 10, padding: "2rem 1rem", textAlign: "center", background: "#EAF3DE", cursor: "pointer", marginBottom: 12 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>📸</div>
          <div style={{ fontSize: 13, color: "#3B6D11", fontWeight: 500 }}>{t.crop.upload}</div>
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
        </label>
      ) : (
        <div style={{ marginBottom: 12 }}>
          <img src={imageUrl} alt="zao" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, marginBottom: 6 }} />
          <label style={{ fontSize: 12, color: "#639922", cursor: "pointer", textDecoration: "underline" }}>
            Badilisha picha <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </label>
        </div>
      )}

      <button onClick={analyze} disabled={!image || loading} style={{
        background: !image ? "#ccc" : "#3B6D11", color: "#fff", border: "none",
        padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
        cursor: !image || loading ? "not-allowed" : "pointer",
      }}>
        {loading ? `⏳ ${t.crop.analyzing}` : `🔍 ${t.crop.btn}`}
      </button>

      {result && !result.error && (() => {
        const c = sColor[result.severity] || sColor.low;
        return (
          <div style={{ marginTop: 16, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>🦠 {result.disease}</span>
              <span style={{ background: c.badge, color: "#fff", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{result.confidence}%</span>
            </div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7, borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 8 }}>
              💊 {result.recommendation}
            </div>
          </div>
        );
      })()}

      {result?.error && (
        <div style={{ marginTop: 12, background: "#FCEBEB", border: "1px solid #E24B4A", borderRadius: 8, padding: 12, fontSize: 13, color: "#A32D2D" }}>⚠️ {result.error}</div>
      )}
    </div>
  );
}
