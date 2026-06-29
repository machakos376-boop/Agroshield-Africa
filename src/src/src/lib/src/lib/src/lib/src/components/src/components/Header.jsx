import React from "react";
import AfricaLogo from "./AfricaLogo.jsx";

export default function Header({ lang, setLang, t, user, onLogout }) {
  return (
    <header style={{
      background: "#3B6D11", padding: "12px 16px", borderRadius: 12,
      marginBottom: 16, display: "flex", justifyContent: "space-between",
      alignItems: "center", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <AfricaLogo size={48} />
        <div style={{ color: "#fff", minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>AgroShield Africa</div>
          <div style={{ fontSize: 11, color: "#C0DD97", lineHeight: 1.5 }}>{t.tagline}</div>
          <div style={{ fontSize: 10, color: "#97C459", marginTop: 1 }}>{t.countries}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, flexShrink: 0, alignItems: "center" }}>
        {["sw","en","fr"].map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{
            background: lang === l ? "#97C459" : "rgba(255,255,255,0.15)",
            border: `1px solid ${lang === l ? "#97C459" : "rgba(255,255,255,0.3)"}`,
            color: lang === l ? "#173404" : "#fff",
            padding: "3px 9px", borderRadius: 6, cursor: "pointer",
            fontSize: 12, fontWeight: 600,
          }}>{l.toUpperCase()}</button>
        ))}
        {user && (
          <button onClick={onLogout} style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff", padding: "3px 9px", borderRadius: 6,
            cursor: "pointer", fontSize: 11, marginLeft: 4,
          }}>{t.auth.logout}</button>
        )}
      </div>
    </header>
  );
}
