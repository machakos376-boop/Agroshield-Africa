import React, { useState, useRef, useEffect } from "react";

const QUICK_QUESTIONS = [
  "Ni wakati gani mzuri wa kupanda mahindi?",
  "Ng'ombe wangu ana homa — nifanye nini?",
  "Jinsi ya kuzuia ukame shambani?",
  "Mbolea gani inafaa kwa mpunga?",
  "Dalili za ugonjwa wa mdomo na kwato ni zipi?",
  "Jinsi ya kuhifadhi mazao baada ya kuvuna?",
];

const SUGGESTED_TOPICS = [
  { icon: "🌿", label: "Kilimo" },
  { icon: "🐄", label: "Mifugo" },
  { icon: "🌦️", label: "Tabianchi" },
  { icon: "💊", label: "Dawa" },
  { icon: "💧", label: "Umwagiliaji" },
  { icon: "🌱", label: "Mbegu" },
];

const KB = [
  { keys: ["habari","hujambo","hello","hi","hey","salaam","mambo","bonjour"], answer: "Habari! Karibu AgroShield Advisor 🌍\n\nNinaweza kukusaidia kuhusu:\n🌿 Kilimo — mazao, magonjwa, mbolea\n🐄 Mifugo — magonjwa, chanjo, utunzaji\n🌦️ Tabianchi — misimu, ukame, mvua\n💧 Umwagiliaji — njia na wakati\n🌱 Mbegu — uchaguzi na kuhifadhi\n\nNiulize swali lolote!" },
  { keys: ["asante","thank","merci","sawa","nzuri","vizuri","ahsante"], answer: "Karibu sana! 😊 Niko hapa kila wakati ukihitaji msaada wa kilimo au ufugaji. Shamba lako liwe na mavuno mengi! 🌿" },
  {
    keys: ["mahindi","maize","corn"],
    subkeys: {
      "kupanda|wakati|msimu|lini|when|plant": "Wakati mzuri wa kupanda mahindi ni mwanzoni mwa mvua — Machi hadi Mei (Masika) au Oktoba hadi Desemba (Vuli) Afrika Mashariki. Tumia mbegu bora kama DK8031, H614D, au SEEDCO SC403. 🌽",
      "kuvuna|uvunaji|harvest|muda|wiki|siku|miezi": "Mahindi huvunwa miezi 3-5 baada ya kupanda. Mbegu za mapema huvunwa siku 90. Dalili: masuke yakauke, makapi ya jani yawe kahawia. 🌽",
      "ugonjwa|madoa|blight|streak|ukungu|disease": "Magonjwa ya mahindi: (1) Leaf Blight — dawa: Dithane M-45. (2) Streak Virus — ng'oa mimea, tumia mbegu sugu. (3) Gray Leaf Spot — dawa: Folicur. 🌽",
      "mbolea|fertilizer|NPK|urea|DAP": "Mahindi: Panda na DAP (debe 1/ekari). Wiki 4-6 weka CAN au Urea (debe 1/ekari). 🌽",
    },
    default: "Mahindi ni zao kuu Afrika. Niulize kuhusu: kupanda, uvunaji, magonjwa, au mbolea! 🌽",
  },
  {
    keys: ["muhogo","cassava","manioc"],
    subkeys: {
      "kupanda|wakati|lini|msimu": "Muhogo hupandwa mwanzoni mwa mvua. Tumia vipande vya shina (sm 25-30). Nafasi: mita 1x1. Mbegu sugu: NASE 19, Kiroba. 🌿",
      "kuvuna|uvunaji|harvest|muda|miezi": "Muhogo huvunwa miezi 8-12. Dalili: majani ya chini yanaanza kugeuka njano. Vuna kabla ya mvua kubwa. 🌿",
      "ugonjwa|CBS|brown streak|mosaic|mozeki": "(1) CBS: ng'oa mimea YOTE haraka. (2) Mosaic: piga dawa ya whitefly. Tumia mbegu safi daima. 🌿",
    },
    default: "Muhogo ni zao muhimu. Niulize kuhusu kupanda, magonjwa, au uvunaji! 🌿",
  },
  {
    keys: ["nyanya","tomato","tomate"],
    subkeys: {
      "kupanda|wakati|lini|msimu": "Nyanya hupandwa mwaka mzima kama una umwagiliaji. Panda kitalu kwanza, pandikiza baada ya wiki 3-4. Nafasi: sm 60x45. 🍅",
      "kuvuna|uvunaji|harvest|muda|wiki|siku": "Nyanya huvunwa wiki 8-12 baada ya kupandikiza. Vuna zinapoanza kugeuka njano/nyekundu. Vuna asubuhi mapema. 🍅",
      "ugonjwa|blight|wilt|kunyauka|madoa": "(1) Early Blight: Copper Oxychloride. (2) Late Blight: Ridomil Gold MZ — HARAKA. (3) Bacterial Wilt: ng'oa mimea, safisha zana kwa bleach. 🍅",
      "mbolea|fertilizer": "Panda na DAP. Baadaye NPK 17:17:17. Wakati wa matunda ongeza Potassium (KNO3). 🍅",
    },
    default: "Nyanya ni zao zuri la biashara. Niulize kuhusu kupanda, magonjwa, au mbolea! 🍅",
  },
  {
    keys: ["vitunguu","onion","oignon"],
    subkeys: {
      "kupanda|wakati|lini|msimu": "Vitunguu hupandwa kiangazi. Panda kitalu kwanza, pandikiza baada ya wiki 6-8. Nafasi: sm 15x10. Wanahitaji udongo wa mchanga na umwagiliaji mzuri. 🧅",
      "kuvuna|uvunaji|harvest|muda|wiki|siku|miezi|baada": "Vitunguu huvunwa miezi 3-5 baada ya kupanda kwenye kitalu (miezi 4-6 jumla). Dalili: majani yanaanguka na kugeuka njano. Kausha vizuri kabla ya kuhifadhi. 🧅",
      "ugonjwa|madoa|blight|ukungu|purple blotch": "(1) Purple Blotch: Mancozeb au Iprodione. (2) Downy Mildew: Metalaxyl + Mancozeb. Mwagilia asubuhi tu. 🧅",
      "kuhifadhi|store|hifadhi": "Kausha vitunguu wiki 2-3 kwanza. Hifadhi mahali pakavu na penye hewa. Huhifadhiwa miezi 3-6. 🧅",
    },
    default: "Vitunguu huvunwa miezi 4-6 baada ya kupanda. Niulize zaidi kuhusu kupanda, uvunaji, magonjwa, au kuhifadhi! 🧅",
  },
  {
    keys: ["mpunga","rice","riz"],
    subkeys: {
      "kupanda|wakati|lini|msimu": "Mpunga hupandwa msimu wa mvua. Panda kitalu kwanza, pandikiza wiki 3-4. Unahitaji maji ya kutosha. Nafasi: sm 20x20. 🌾",
      "kuvuna|uvunaji|harvest|muda|miezi": "Mpunga huvunwa miezi 3-6. SARO 5, NERICA: miezi 3-4. Dalili: masuke ya dhahabu, nafaka ngumu. 🌾",
      "ugonjwa|blast|brown spot|madoa": "(1) Rice Blast: Beam 75WP. PUNGUZA nitrojeni. (2) Brown Spot: Mancozeb. 🌾",
      "mbolea|fertilizer|nitrojeni|urea": "Panda na DAP. Wiki 4 weka Urea/CAN. Usitumie nitrojeni nyingi — inazidisha Blast. 🌾",
    },
    default: "Mpunga unahitaji maji mengi. Niulize kuhusu kupanda, uvunaji, magonjwa, au mbolea! 🌾",
  },
  {
    keys: ["maharage","beans","haricot","kunde"],
    subkeys: {
      "kupanda|wakati|lini|msimu": "Maharage hupandwa mwanzoni mwa mvua. Nafasi sm 40x10. Kina: sm 3-5. Yanaboresha udongo. 🫘",
      "kuvuna|uvunaji|harvest|muda|wiki|siku": "Maharage huvunwa siku 60-90. Kijani (mboga): siku 45-55. Dalili: mikunde inakauka na kugeuka kahawia. 🫘",
      "ugonjwa|rust|kutu|mosaic": "(1) Bean Rust: Mancozeb au Dithane M-45. (2) Mosaic Virus: ng'oa mimea, piga dawa ya aphids. 🫘",
    },
    default: "Maharage ni zao zuri. Niulize kuhusu kupanda, uvunaji, au magonjwa! 🫘",
  },
  {
    keys: ["ndizi","banana","banane","plantain"],
    subkeys: {
      "kupanda|wakati|lini": "Ndizi hupandwa wakati wowote kama una umwagiliaji. Tumia suckers zenye afya. Shimo: sm 60x60x60. Nafasi: mita 3x3. 🍌",
      "kuvuna|uvunaji|harvest|muda|miezi": "Ndizi huvunwa miezi 9-12. Vuna zinapojaza na kugeuka njano kidogo. Acha sucker achukue nafasi. 🍌",
      "ugonjwa|BXW|sigatoka|wilt|fusarium": "BXW DHARURA: Kata na choma mti WOTE. Safisha mundu kwa bleach. Sigatoka: Dithane M-45. 🍌",
    },
    default: "Ndizi ni zao la kudumu. Niulize kuhusu kupanda, uvunaji, au magonjwa! 🍌",
  },
  {
    keys: ["karanga","groundnut","peanut","arachide"],
    subkeys: {
      "kupanda|wakati|lini|msimu": "Karanga hupandwa mwanzoni mwa mvua. Nafasi sm 40x15. Kina: sm 5. Zinapenda udongo mwepesi. 🥜",
      "kuvuna|uvunaji|harvest|muda|miezi": "Karanga huvunwa miezi 3-5. Dalili: majani yanaanza kugeuka njano. Chunguza sampuli — ganda liwe gumu. 🥜",
      "ugonjwa|rosette|leaf spot|madoa|aflatoxin": "(1) Rosette: piga dawa ya aphids haraka. (2) Leaf Spot: Chlorothalonil/Mancozeb. (3) Aflatoxin: kausha vizuri! 🥜",
    },
    default: "Karanga ni zao zuri la biashara. Niulize kuhusu kupanda, uvunaji, au magonjwa! 🥜",
  },
  {
    keys: ["mbolea","fertilizer","engrais","NPK","urea","DAP","samadi"],
    subkeys: {
      "organic|samadi|mboji|compost": "Mbolea ya asili: (1) Samadi ya ng'ombe/mbuzi — debe 10-20 kwa mita 10x10. (2) Mboji — changanya majani na samadi, acha miezi 3. Inaboresha udongo kwa muda mrefu. 🌱",
      "NPK|nitrogen|nitrojeni|phosphorus|potassium": "Mbolea kuu: N (Urea, CAN) — ukuaji wa majani. P (DAP, TSP) — mizizi na maua. K (MOP, KCL) — nguvu na matunda. 🌱",
    },
    default: "Mbolea ni muhimu kwa mavuno mazuri. Niambie zao lako nikusaidie na kipimo sahihi. 🌱",
  },
  {
    keys: ["ng'ombe","ngombe","cow","cattle","vache"],
    subkeys: {
      "homa|fever|moto|joto|temperature": "Ng'ombe ana homa (zaidi ya 39.5°C): (1) Tenga mnyama. (2) Maji baridi mengi. (3) Daktari ndani ya saa 24. Inaweza kuwa Pneumonia, ECF, au Anaplasmosis. 🐄",
      "makamasi|nasal|kukohoa|cough|pneumonia": "Makamasi + kukohoa = Pneumonia/CBPP. (1) Tenga. (2) Hewa safi. (3) Maji mengi. (4) Daktari saa 24. Dawa: Oxytetracycline LA. 🐄",
      "kuharisha|diarrhea|tumbo": "Kuharisha: (1) Maji mengi (ORS). (2) Punguza malisho mazito. (3) Kama kuna damu — daktari SASA. 🐄",
      "maziwa|milk|kupungua": "Maziwa kupungua: (1) Angalia Mastitis. (2) Ongeza malisho bora. (3) Maji ya kutosha. (4) Chunguza matiti yote. 🐄",
      "chanjo|vaccine|kinga": "Chanjo za ng'ombe: FMD (mara 2/mwaka), BQ (kila mwaka), LSD (kila mwaka), ECF (mara moja). 🐄",
      "kupe|tick|tique": "Kupe: (1) Osha kwa acaricide kila wiki 2. (2) Safisha banda. (3) Kata nyasi fupi. Dawa: Amitraz, Cypermethrin. 🐄",
    },
    default: "Ng'ombe wana matatizo mengi. Niambie dalili unazoziona nikusaidie vizuri! 🐄",
  },
  {
    keys: ["kuku","chicken","poulet","poultry"],
    subkeys: {
      "newcastle|mdundo|kifo|kufa|kuanguka": "Newcastle: kukohoa, kutembea vibaya, shingo kujikunja. Hakuna dawa — chanjo peke yake! Tenga kuku wagonjwa. Chanjo kila miezi 3. 🐔",
      "chanjo|vaccine|kinga": "Chanjo za kuku: Newcastle (miezi 3), Gumboro (siku 14 na 21), Fowl Pox (kila mwaka). Hifadhi kwenye friji. 🐔",
      "kuharisha|diarrhea|white|nyeupe|green|kijani": "Kuharisha nyeupe = Pullorum. Kijani = magonjwa ya matumbo. Tenga, safisha maji, Tetracycline kwenye maji. 🐔",
      "mayai|eggs|kupungua|kutaga": "Mayai kupungua: (1) Ongeza protini (samaki unga). (2) Mwanga masaa 16. (3) Angalia msongo. (4) Angalia ugonjwa. 🐔",
    },
    default: "Kuku ni ufugaji mzuri. Niambie tatizo lako nikusaidie! 🐔",
  },
  {
    keys: ["mbuzi","goat","chèvre","kondoo","sheep","mouton"],
    subkeys: {
      "PPR|mdundo|homa|ugonjwa": "PPR: homa kali, makamasi, kuharisha, vidonda kinywani. Tenga SASA, piga simu daktari. Chanjo kila mwaka. 🐐",
      "chanjo|vaccine|kinga": "Chanjo za mbuzi/kondoo: PPR (kila mwaka), FMD (mara 2/mwaka), CCPP (kila mwaka). 🐐",
      "kuzaa|mimba|delivery|kujifungua": "Mbuzi wanazaa miezi 5 (siku 150). Kuzaa zaidi ya saa 1 — daktari. Mtoto anyonye ndani ya saa 1. 🐐",
    },
    default: "Mbuzi na kondoo ni rahisi kutunza. Niambie tatizo lako! 🐐",
  },
  {
    keys: ["ukame","drought","mvua","mafuriko","flood","joto","tabianchi","climate","hali ya hewa"],
    subkeys: {
      "ukame|drought|maji kidogo|hakuna mvua": "Kukabiliana na ukame: (1) Drip irrigation. (2) Mulching. (3) Panda sugu: Mtama, Sorghum, Mbaazi, Karanga. (4) Hifadhi maji ya mvua. 💧",
      "mvua nyingi|mafuriko|flood": "Mvua nyingi: (1) Mifereji shambani. (2) Matuta (raised beds). (3) Epuka kupanda wakati wa mvua kubwa. (4) Subiri siku 3-5 baada ya mafuriko. 🌧️",
      "msimu|wakati|kalenda|lini kupanda": "Kalenda Afrika Mashariki: MASIKA (Mac-Mei) — mahindi, maharage, nyanya. VULI (Okt-Des) — mahindi mfupi, mtama. KIANGAZI — vitunguu, karanga. 📅",
    },
    default: "Tabianchi inathiri kilimo sana. Niambie tatizo lako la hali ya hewa! 🌦️",
  },
  {
    keys: ["umwagiliaji","irrigation","maji","water","drip","sprinkler","matone"],
    subkeys: {
      "drip|matone|trickle": "Drip irrigation: okoa maji 50%, maji kwenye mizizi moja kwa moja, huzuia magonjwa ya majani. Inafaa: nyanya, vitunguu, pilipili. 💧",
      "wakati|mara ngapi|lini|asubuhi|jioni": "Mwagilia ASUBUHI saa 1-3. EPUKA adhuhuri (maji yanavukizwa) na usiku (inasababisha ukungu). 💧",
    },
    default: "Umwagiliaji mzuri = mavuno mazuri. Niulize aina ya umwagiliaji au wakati! 💧",
  },
  {
    keys: ["kuhifadhi","store","hifadhi","ghala","baada ya kuvuna"],
    answer: "Kuhifadhi mazao: (1) Kausha vizuri — unyevu chini ya 13%. (2) Magunia safi au silos. (3) Dawa: Actellic Super au Phostoxin. (4) Mahali pakavu, penye hewa, juu ya mbao. (5) Angalia kila wiki 2. 🌾",
  },
  {
    keys: ["mbegu","seed","semence","hybrid","OPV","certified"],
    answer: "Mbegu bora: Nunua certified seeds kutoka duka la kuaminika. Hybrid — inazalisha zaidi lakini huhifadhiwi. OPV — unaweza kuhifadhi. Watoa: SEEDCO, Kenya Seed, AGRA. 🌱",
  },
];

function getAIResponse(question) {
  const q = question.toLowerCase().trim();
  const words = q.split(/\s+/);
  let bestAnswer = null;
  let bestScore = 0;

  for (const item of KB) {
    const hasMainKey = item.keys.some(key =>
      words.some(w => w.includes(key) || key.includes(w)) || q.includes(key)
    );
    if (!hasMainKey) continue;

    if (item.subkeys) {
      let subMatched = false;
      for (const [subPattern, subAnswer] of Object.entries(item.subkeys)) {
        const patterns = subPattern.split("|");
        const subMatch = patterns.some(p =>
          words.some(w => w.includes(p) || p.includes(w)) || q.includes(p)
        );
        if (subMatch) {
          const score = item.keys.filter(k => q.includes(k) || words.some(w => w.includes(k))).length + 2;
          if (score > bestScore) { bestScore = score; bestAnswer = subAnswer; subMatched = true; }
        }
      }
      if (!subMatched) {
        const score = item.keys.filter(k => q.includes(k) || words.some(w => w.includes(k))).length;
        if (score > bestScore) { bestScore = score; bestAnswer = item.default || item.answer; }
      }
    } else if (item.answer) {
      const score = item.keys.filter(k => q.includes(k) || words.some(w => w.includes(k))).length;
      if (score > bestScore) { bestScore = score; bestAnswer = item.answer; }
    }
  }

  if (bestAnswer && bestScore >= 1) return bestAnswer;

  return `Asante kwa swali lako! 🌍\n\nSiwezi kupata jibu sahihi kwa "${question.slice(0,40)}..." sasa hivi.\n\nNinaweza kukusaidia kuhusu:\n🌿 Mazao: mahindi, nyanya, muhogo, vitunguu...\n🐄 Mifugo: ng'ombe, kuku, mbuzi...\n🌦️ Tabianchi na umwagiliaji\n\nJaribu swali lingine! 😊`;
}

export default function AdvisorChat({ user, lang }) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Habari! Mimi ni AgroShield Advisor 🤖\n\nNiulize swali lolote kuhusu:\n🌿 Kilimo na mazao\n🐄 Mifugo na afya yao\n🌦️ Hali ya hewa Afrika\n\nNiko hapa kukusaidia!" }]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [unread, setUnread]     = useState(0);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => { if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 150); } }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendMessage(text) {
    const question = (text || input).trim();
    if (!question || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const reply = getAIResponse(question);
    setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    if (!open) setUnread(n => n + 1);
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <>
      <button onClick={() => setOpen(o => !o)} title="AgroShield Advisor AI" style={{ position: "fixed", bottom: 24, right: 20, width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #3B6D11, #639922)", border: "3px solid #C0DD97", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(59,109,17,0.5)", zIndex: 1000 }}>
        <span style={{ fontSize: open ? 22 : 28 }}>{open ? "✕" : "🤖"}</span>
        {!open && unread > 0 && <span style={{ position: "absolute", top: -2, right: -2, background: "#E24B4A", color: "#fff", width: 20, height: 20, borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>{unread}</span>}
      </button>

      {!open && (
        <div style={{ position: "fixed", bottom: 34, right: 88, background: "#3B6D11", color: "#fff", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, zIndex: 999, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", pointerEvents: "none", whiteSpace: "nowrap" }}>
          AgroShield Advisor AI
        </div>
      )}

      {open && (
        <div style={{ position: "fixed", bottom: 94, right: 16, width: "min(390px, calc(100vw - 32px))", height: "min(570px, calc(100vh - 120px))", background: "#fff", borderRadius: 18, boxShadow: "0 8px 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", zIndex: 999, overflow: "hidden", border: "1.5px solid #C0DD97" }}>

          <div style={{ background: "linear-gradient(135deg, #27500A, #3B6D11)", padding: "13px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>AgroShield Advisor</div>
              <div style={{ color: "#C0DD97", fontSize: 11, marginTop: 1 }}>{loading ? "⏳ Anafikiri..." : "● Online · Mshauri wa Kilimo, Mifugo & Tabianchi"}</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>

          <div style={{ padding: "8px 10px", borderBottom: "1px solid #f0f0f0", display: "flex", gap: 5, overflowX: "auto" }}>
            {SUGGESTED_TOPICS.map((tp, i) => (
              <button key={i} onClick={() => sendMessage(`Niambie kuhusu ${tp.label} Afrika`)} disabled={loading} style={{ flexShrink: 0, padding: "4px 10px", borderRadius: 20, border: "1px solid #C0DD97", background: "#EAF3DE", color: "#3B6D11", fontSize: 11, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                {tp.icon} {tp.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 4px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10, alignItems: "flex-end", gap: 6 }}>
                {m.role === "assistant" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EAF3DE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>}
                <div style={{ maxWidth: "76%", background: m.role === "user" ? "#3B6D11" : "#F5F5F3", color: m.role === "user" ? "#fff" : "#222", padding: "10px 13px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.text}</div>
                {m.role === "user" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#3B6D11", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, color: "#fff" }}>👤</div>}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EAF3DE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                <div style={{ background: "#F5F5F3", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B6D11", display: "inline-block", animation: `dotPulse 1.2s infinite ${i*0.2}s` }} />)}
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6, textAlign: "center" }}>💬 Maswali ya haraka:</div>
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 11px", marginBottom: 5, background: "#EAF3DE", border: "1px solid #C0DD97", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#3B6D11", lineHeight: 1.4 }}>{q}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "10px 12px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 8, alignItems: "flex-end", background: "#fff" }}>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Andika swali lako hapa... (Enter kutuma)" rows={1} disabled={loading} style={{ flex: 1, border: "1.5px solid #C0DD97", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none", maxHeight: 90, lineHeight: 1.5, color: "#222", background: loading ? "#f9f9f9" : "#fff" }} onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px"; }} />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ background: !input.trim() || loading ? "#ddd" : "#3B6D11", color: !input.trim() || loading ? "#aaa" : "#fff", border: "none", width: 42, height: 42, borderRadius: "50%", cursor: !input.trim() || loading ? "not-allowed" : "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>➤</button>
          </div>

          <div style={{ textAlign: "center", padding: "4px 0 7px", fontSize: 10, color: "#ccc" }}>
            AgroShield Advisor · Mshauri wa Kilimo kwa Afrika 🌍
          </div>
        </div>
      )}

      <style>{`@keyframes dotPulse { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1.2)} }`}</style>
    </>
  );
}
