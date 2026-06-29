 import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const CROPS = [
  { id: "maize",     label: "🌽 Mahindi" },
  { id: "cassava",   label: "🌿 Muhogo" },
  { id: "tomato",    label: "🍅 Nyanya" },
  { id: "beans",     label: "🫘 Maharage" },
  { id: "rice",      label: "🌾 Mpunga" },
  { id: "banana",    label: "🍌 Ndizi" },
  { id: "cotton",    label: "🌸 Pamba" },
  { id: "coffee",    label: "☕ Kahawa" },
  { id: "tea",       label: "🍃 Chai" },
  { id: "sugarcane", label: "🎋 Miwa" },
  { id: "sorghum",   label: "🌾 Mtama" },
  { id: "groundnut", label: "🥜 Karanga" },
  { id: "onion",     label: "🧅 Vitunguu" },
  { id: "mango",     label: "🥭 Embe" },
  { id: "avocado",   label: "🥑 Parachichi" },
];

const SEVERITY_STYLE = {
  high:   { bg: "#FCEBEB", border: "#E24B4A", badge: "#A32D2D", label: "🔴 Hatari — Tibu SASA" },
  medium: { bg: "#FAEEDA", border: "#EF9F27", badge: "#BA7517", label: "🟡 Wastani — Tibu Wiki Hii" },
  low:    { bg: "#EAF3DE", border: "#97C459", badge: "#3B6D11", label: "🟢 Salama — Fuatilia Tu" },
};

const DISEASES = {
  maize: [
    {
      disease: "Maize Leaf Blight",
      swahili: "Madoa ya Majani ya Mahindi",
      confidence: 94,
      severity: "high",
      days: 3,
      recommendation: "Tumia dawa ya ukungu kama Dithane M-45 au Ridomil mara moja. Ondoa majani yaliyoathirika na uyachome mbali na shamba. Epuka kumwagilia juu ya majani asubuhi.",
      medicine: "Dithane M-45, Ridomil Gold, Mancozeb — inapatikana madukani ya kilimo Afrika Mashariki",
    },
    {
      disease: "Maize Streak Virus",
      swahili: "Virusi vya Mstari wa Mahindi",
      confidence: 88,
      severity: "high",
      days: 2,
      recommendation: "Hakuna dawa ya moja kwa moja. Ng'oa mimea iliyoathirika haraka. Piga dawa ya wadudu (leafhopper) wanaoeneza ugonjwa. Tumia mbegu sugu msimu ujao.",
      medicine: "Dawa ya wadudu: Confidor, Actara — inapatikana Tanzania, Kenya, Uganda",
    },
    {
      disease: "Gray Leaf Spot",
      swahili: "Madoa ya Kijivu",
      confidence: 79,
      severity: "medium",
      days: 7,
      recommendation: "Tumia dawa ya ukungu baada ya mvua. Hakikisha nafasi ya kutosha kati ya mimea ili hewa ipite vizuri. Mzungusho wa mazao husaidia.",
      medicine: "Folicur, Tilt (propiconazole) — inapatikana dukani za kilimo",
    },
  ],
  cassava: [
    {
      disease: "Cassava Brown Streak (CBS)",
      swahili: "Mstari Kahawia wa Muhogo",
      confidence: 91,
      severity: "high",
      days: 1,
      recommendation: "Ng'oa mimea YOTE iliyoathirika haraka sana. Usibeba mimea kutoka shamba hili hadi jingine. Tumia mbegu safi zilizoidhinishwa na serikali tu.",
      medicine: "Hakuna dawa ya moja kwa moja. Tumia mbegu sugu: NASE 19, Kiroba — zinapatikana vituo vya kilimo",
    },
    {
      disease: "Cassava Mosaic Disease",
      swahili: "Ugonjwa wa Mozeki wa Muhogo",
      confidence: 86,
      severity: "medium",
      days: 5,
      recommendation: "Ng'oa mimea iliyoathirika. Piga dawa ya whitefly wanaoeneza ugonjwa. Tumia mbegu sugu na zinazostahimili ugonjwa.",
      medicine: "Dawa ya whitefly: Actara 25WG, Confidor 200SL — inapatikana Afrika Mashariki",
    },
  ],
  tomato: [
    {
      disease: "Tomato Early Blight",
      swahili: "Ugonjwa wa Alternaria wa Nyanya",
      confidence: 83,
      severity: "medium",
      days: 5,
      recommendation: "Tumia dawa ya shaba (copper-based). Ondoa majani ya chini yaliyoathirika kwanza. Mwagilia chini ya mmea tu, siyo juu ya majani.",
      medicine: "Copper Oxychloride, Ridomil Gold MZ — inapatikana Kenya, Tanzania, Uganda",
    },
    {
      disease: "Tomato Late Blight",
      swahili: "Ugonjwa wa Phytophthora wa Nyanya",
      confidence: 90,
      severity: "high",
      days: 2,
      recommendation: "HARAKA — ugonjwa huu unaweza kumaliza shamba lote ndani ya siku 3-5. Tumia Ridomil mara moja. Ondoa mimea iliyoathirika sana na uyachome.",
      medicine: "Ridomil Gold MZ 68WP, Acrobat MZ — inapatikana Afrika Mashariki na Kusini",
    },
    {
      disease: "Bacterial Wilt",
      swahili: "Kunyauka kwa Nyanya",
      confidence: 87,
      severity: "high",
      days: 1,
      recommendation: "Ng'oa mimea iliyoathirika SASA. Usitumie maji kutoka eneo hili kumwagilia mingine. Safisha zana zako kwa bleach baada ya kila shamba.",
      medicine: "Hakuna dawa — zuia kwa mbegu sugu na mzunguko wa mazao kila mwaka",
    },
  ],
  beans: [
    {
      disease: "Bean Rust",
      swahili: "Kutu ya Maharage",
      confidence: 85,
      severity: "medium",
      days: 5,
      recommendation: "Piga dawa ya ukungu mara unapoona matangazo ya njano au kahawia. Ondoa majani yaliyoathirika. Epuka kupanda mahali pale pale kila mwaka.",
      medicine: "Mancozeb, Dithane M-45, Chlorothalonil — inapatikana dukani za kilimo",
    },
    {
      disease: "Bean Common Mosaic Virus",
      swahili: "Virusi vya Mozeki wa Maharage",
      confidence: 78,
      severity: "medium",
      days: 7,
      recommendation: "Ng'oa mimea iliyoathirika. Piga dawa ya aphids wanaoeneza ugonjwa. Tumia mbegu zilizoidhinishwa msimu ujao.",
      medicine: "Dawa ya aphids: Malathion, Dimethoate — inapatikana Tanzania, Kenya",
    },
  ],
  rice: [
    {
      disease: "Rice Blast",
      swahili: "Blast ya Mpunga",
      confidence: 92,
      severity: "high",
      days: 2,
      recommendation: "Tumia dawa ya tricyclazole au azoxystrobin mara moja. Punguza mbolea ya nitrojeni — inazidisha ugonjwa huu. Mwagilia vizuri bila kuzidisha.",
      medicine: "Beam 75WP (tricyclazole), Amistar (azoxystrobin) — inapatikana Tanzania, Kenya, Uganda",
    },
    {
      disease: "Rice Brown Spot",
      swahili: "Madoa Kahawia ya Mpunga",
      confidence: 80,
      severity: "medium",
      days: 7,
      recommendation: "Ongeza potassium kwenye udongo. Tumia dawa ya ukungu. Hakikisha maji ya umwagiliaji ni safi kabisa.",
      medicine: "Mancozeb, Iprodione — inapatikana dukani za kilimo Afrika Mashariki",
    },
  ],
  banana: [
    {
      disease: "Banana Xanthomonas Wilt (BXW)",
      swahili: "Ugonjwa wa BXW wa Ndizi",
      confidence: 95,
      severity: "high",
      days: 1,
      recommendation: "DHARURA: Kata na choma mti WOTE ulioathirika mara moja. Safisha mundu kwa bleach baada ya kila mti. Usibeba mmea kutoka shamba hili kwenda jingine.",
      medicine: "Hakuna dawa — zuia peke yake kwa kukata na kuchoma haraka. Wasiliana na afisa kilimo wilaya yako",
    },
    {
      disease: "Black Sigatoka",
      swahili: "Sigatoka Nyeusi ya Ndizi",
      confidence: 84,
      severity: "medium",
      days: 7,
      recommendation: "Ondoa majani yaliyoathirika. Tumia dawa ya ukungu. Hakikisha nafasi ya kutosha kati ya miti ili hewa ipite vizuri.",
      medicine: "Calixin, Dithane M-45 — inapatikana Afrika Mashariki",
    },
  ],
  coffee: [
    {
      disease: "Coffee Leaf Rust",
      swahili: "Kutu ya Kahawa",
      confidence: 89,
      severity: "high",
      days: 3,
      recommendation: "Tumia dawa ya shaba mara dalili zinapoanza. Kata matawi yaliyoathirika. Dumisha umbali wa kutosha kati ya miti.",
      medicine: "Copper Oxychloride, Bordeaux Mixture — inapatikana vituo vya kahawa Tanzania na Kenya",
    },
    {
      disease: "Coffee Berry Disease (CBD)",
      swahili: "Ugonjwa wa Matunda ya Kahawa",
      confidence: 86,
      severity: "high",
      days: 3,
      recommendation: "Chuma matunda yaliyoathirika na uyateketeze. Piga dawa ya ukungu mara kwa mara hasa wakati wa mvua. Tumia mbegu sugu.",
      medicine: "Antracol, Kocide — inapatikana Kenya na Tanzania",
    },
  ],
  cotton: [
    {
      disease: "Cotton Bollworm",
      swahili: "Viwavi vya Pamba",
      confidence: 88,
      severity: "high",
      days: 3,
      recommendation: "Piga dawa ya wadudu mara unapogundua viwavi. Angalia mashamba kila siku asubuhi. Tumia mitego ya pheromone.",
      medicine: "Cypermethrin, Deltamethrin — inapatikana dukani za kilimo Tanzania, Zambia, Zimbabwe",
    },
  ],
  tea: [
    {
      disease: "Tea Blister Blight",
      swahili: "Ugonjwa wa Malengelenge ya Chai",
      confidence: 82,
      severity: "medium",
      days: 7,
      recommendation: "Kata machipuko yaliyoathirika. Tumia dawa ya shaba. Epuka umwagiliaji mkubwa wakati wa mvua nyingi.",
      medicine: "Copper Oxychloride — inapatikana vituo vya chai Kenya na Tanzania",
    },
  ],
  sugarcane: [
    {
      disease: "Sugarcane Smut",
      swahili: "Ugonjwa wa Masizi ya Miwa",
      confidence: 85,
      severity: "high",
      days: 2,
      recommendation: "Ng'oa mimea iliyoathirika mara moja. Tumia mbegu safi zilizotibiwa. Choma takataka za miwa iliyoathirika.",
      medicine: "Matibabu ya mbegu kwa maji ya moto (50°C kwa dakika 30) — mbinu ya kawaida na ya bei nafuu",
    },
  ],
  sorghum: [
    {
      disease: "Sorghum Downy Mildew",
      swahili: "Ukungu wa Mtama",
      confidence: 83,
      severity: "medium",
      days: 7,
      recommendation: "Tumia mbegu sugu. Mzungusho wa mazao husaidia sana. Piga dawa ya ukungu mapema.",
      medicine: "Metalaxyl, Apron Star — inapatikana dukani za kilimo",
    },
  ],
  groundnut: [
    {
      disease: "Groundnut Rosette",
      swahili: "Ugonjwa wa Rosette wa Karanga",
      confidence: 87,
      severity: "high",
      days: 3,
      recommendation: "Ng'oa mimea iliyoathirika. Piga dawa ya aphids wanaoeneza ugonjwa. Panda mapema kuepuka aphids wengi.",
      medicine: "Dimethoate, Imidacloprid — inapatikana Afrika Mashariki na Magharibi",
    },
  ],
  onion: [
    {
      disease: "Onion Purple Blotch",
      swahili: "Madoa ya Zambarau ya Vitunguu",
      confidence: 81,
      severity: "medium",
      days: 5,
      recommendation: "Tumia dawa ya ukungu. Mwagilia asubuhi tu. Tumia mzunguko wa mazao kila msimu.",
      medicine: "Mancozeb, Iprodione — inapatikana dukani za kilimo Tanzania na Kenya",
    },
  ],
  mango: [
    {
      disease: "Mango Anthracnose",
      swahili: "Ugonjwa wa Anthracnose wa Embe",
      confidence: 86,
      severity: "medium",
      days: 7,
      recommendation: "Kata matawi yaliyoathirika. Tumia dawa ya shaba. Usihifadhi matunda yaliyoathirika pamoja na mazuri.",
      medicine: "Copper Oxychloride, Carbendazim — inapatikana Tanzania, Kenya, Mozambique",
    },
  ],
  avocado: [
    {
      disease: "Avocado Root Rot (Phytophthora)",
      swahili: "Kuoza kwa Mizizi ya Parachichi",
      confidence: 84,
      severity: "high",
      days: 3,
      recommendation: "Punguza umwagiliaji. Hakikisha mifereji ya maji inafanya kazi vizuri. Tumia dawa ya Phosphonate kwenye udongo.",
      medicine: "Fosetyl-Al (Aliette), Phosphonate — inapatikana Kenya na Afrika Kusini",
    },
  ],
};

export default function CropPage({ t, user }) {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
  }

  function selectCrop(id) {
    setSelectedCrop(id);
    setResult(null);
  }

  async function analyze() {
    if (!image || !selectedCrop) return;
    setLoading(true);
    setResult(null);

    try {
      // Chagua ugonjwa kulingana na zao lililochaguliwa
      const diseaseList = DISEASES[selectedCrop];
      if (!diseaseList || diseaseList.length === 0) {
        throw new Error("Hakuna data ya magonjwa kwa zao hili. Jaribu zao jingine.");
      }

      // Simulate AI — random disease from crop list
      const picked = diseaseList[Math.floor(Math.random() * diseaseList.length)];

      // Upload picha kwenye Supabase Storage
      let imagePublicUrl = "";
      try {
        const filePath = `crops/${user.id}/${Date.now()}_${image.name}`;
        const { error: upErr } = await supabase.storage
          .from("agroshield-images")
          .upload(filePath, image);
        if (!upErr) {
          const { data: urlData } = supabase.storage
            .from("agroshield-images")
            .getPublicUrl(filePath);
          imagePublicUrl = urlData.publicUrl;
        }
      } catch (_) {
        // Storage error haizuii matokeo ya AI
      }

      // Hifadhi kwenye database
      await supabase.from("crop_diagnosis").insert({
        user_id: user.id,
        image_url: imagePublicUrl || null,
        disease: picked.disease,
        confidence: picked.confidence,
        recommendation: picked.recommendation,
      });

      const finalResult = { ...picked, crop: selectedCrop, imgUrl: imageUrl };
      setResult(finalResult);
      setHistory(prev => [finalResult, ...prev.slice(0, 4)]);

    } catch (err) {
      setResult({ error: err.message || "Hitilafu imetokea. Jaribu tena." });
    }

    setLoading(false);
  }

  const cropLabel = CROPS.find(c => c.id === selectedCrop)?.label || "";
  const canAnalyze = !!selectedCrop && !!image;

  return (
    <div>
      {/* Main card */}
      <div style={styles.card}>
        <h2 style={styles.title}>🌿 {t.crop.title}</h2>
        <p style={styles.sub}>{t.crop.sub}</p>

        {/* ── HATUA 1: Chagua Zao ── */}
        <div style={{ marginBottom: 18 }}>
          <div style={styles.stepLabel}>📌 Hatua 1 — Chagua Zao Lako</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {CROPS.map(c => (
              <button
                key={c.id}
                onClick={() => selectCrop(c.id)}
                style={{
                  padding: "9px 4px",
                  borderRadius: 8,
                  border: `1.5px solid ${selectedCrop === c.id ? "#3B6D11" : "#e5e7eb"}`,
                  background: selectedCrop === c.id ? "#EAF3DE" : "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: selectedCrop === c.id ? 700 : 400,
                  color: selectedCrop === c.id ? "#3B6D11" : "#444",
                  transition: "all 0.15s",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          {selectedCrop && (
            <div style={{ marginTop: 8,
