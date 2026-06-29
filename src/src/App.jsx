import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase.js";
import { T } from "./lib/i18n.js";
import Header from "./components/Header.jsx";
import AdvisorChat from "./components/AdvisorChat.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CropPage from "./pages/CropPage.jsx";
import LivestockPage from "./pages/LivestockPage.jsx";
import ClimatePage from "./pages/ClimatePage.jsx";

export default function App() {
  const [lang, setLang]       = useState("sw");
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("crop");
  const t = T[lang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0F2006", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#97C459", fontSize: 16, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🌍</div>
        <div style={{ fontWeight: 600 }}>AgroShield Africa</div>
        <div style={{ fontSize: 13, color: "#639922", marginTop: 6 }}>Inafunguka...</div>
      </div>
    </div>
  );

  if (!user) return <AuthPage t={t} lang={lang} setLang={setLang} />;

  const navItems = [
    { key: "crop",      icon: "🌿", label: t.nav.crop },
    { key: "livestock", icon: "🐄", label: t.nav.livestock },
    { key: "climate",   icon: "🌦️", label: t.nav.climate },
  ];

  return (
    <div style={{ background: "#f5f5f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, maxWidth: 700, width: "100%", margin: "0 auto", padding: "16px 12px 0" }}>
        <Header lang={lang} setLang={setLang} t={t} user={user} onLogout={() => supabase.auth.signOut()} />

        <div style={{ background: "#EAF3DE", border: "1px solid #97C459", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#3B6D11", display: "flex", alignItems: "center", gap: 8 }}>
          👤 {t.auth.welcome}, <strong>{user.user_metadata?.name || user.email}</strong>
          {user.user_metadata?.role && (
            <span style={{ background: "#3B6D11", color: "#fff", padding: "1px 10px", borderRadius: 20, fontSize: 11, marginLeft: "auto" }}>
              {user.user_metadata.role}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {navItems.map(({ key, icon, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, background: tab === key ? "#EAF3DE" : "#fff",
              border: tab === key ? "2px solid #3B6D11" : "1px solid rgba(0,0,0,0.12)",
              borderRadius: 12, padding: "10px 6px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: tab === key ? "#3B6D11" : "#666" }}>{label}</span>
            </button>
          ))}
        </div>

        {tab === "crop"      && <CropPage      t={t} user={user} />}
        {tab === "livestock" && <LivestockPage  t={t} user={user} />}
        {tab === "climate"   && <ClimatePage    t={t} user={user} />}
      </div>

      <footer style={{ maxWidth: 700, width: "100%", margin: "32px auto 80px", padding: "20px 16px", borderTop: "1px solid #C0DD97", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, background: "#3B6D11", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌍</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#3B6D11" }}>AgroShield Africa</span>
        </div>
        <div style={{ fontSize: 12, color: "#639922", fontWeight: 500, marginBottom: 4 }}>
          © 2026 AgroShield Africa. All Rights Reserved.
        </div>
        <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
          Built for African Farmers, Livestock Keepers and Climate Resilience.
        </div>
        <div style={{ margin: "12px auto", width: 40, height: 2, background: "#C0DD97", borderRadius: 2 }} />
        <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 11, color: "#aaa" }}>
          <span>🌿 Kilimo</span>
          <span>🐄 Mifugo</span>
          <span>🌦️ Tabianchi</span>
          <span>🤖 AI Advisor</span>
        </div>
      </footer>

      <AdvisorChat user={user} lang={lang} />
    </div>
  );
}
