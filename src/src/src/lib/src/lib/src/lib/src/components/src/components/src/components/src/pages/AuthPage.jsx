import React, { useState } from "react";
import { supabase } from "../lib/supabase.js";
import AfricaLogo from "../components/AfricaLogo.jsx";

export default function AuthPage({ t, lang, setLang }) {
  const [mode, setMode]         = useState("login");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("farmer");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const inp = { width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 10, fontFamily: "inherit", outline: "none" };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (mode === "register") {
        const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { name, role } } });
        if (err) throw err;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await supabase.from("users").insert({ id: user.id, name, email, role });
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err.message || "Hitilafu imetokea. Jaribu tena.");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F2006", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
          <AfricaLogo size={64} />
          <div style={{ marginTop: 10, fontSize: 22, fontWeight: 700, color: "#3B6D11" }}>AgroShield Africa</div>
          <div style={{ fontSize: 12, color: "#639922" }}>{t.countries}</div>
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 18 }}>
          {["sw","en","fr"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? "#3B6D11" : "#EAF3DE", color: lang === l ? "#fff" : "#3B6D11", border: "none", padding: "4px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{l.toUpperCase()}</button>
          ))}
        </div>
        <div style={{ display: "flex", marginBottom: 18, background: "#f5f5f3", borderRadius: 8, padding: 4 }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: mode === m ? "#3B6D11" : "transparent", color: mode === m ? "#fff" : "#666" }}>
              {m === "login" ? t.auth.login : t.auth.register}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <input style={inp} placeholder={t.auth.name} value={name} onChange={e => setName(e.target.value)} required />
              <select style={{ ...inp, background: "#fff" }} value={role} onChange={e => setRole(e.target.value)}>
                <option value="farmer">{t.auth.farmer}</option>
                <option value="livestock_keeper">{t.auth.livestock_keeper}</option>
                <option value="both">{t.auth.both}</option>
              </select>
            </>
          )}
          <input style={inp} type="email" placeholder={t.auth.email} value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={inp} type="password" placeholder={t.auth.password} value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div style={{ color: "#A32D2D", fontSize: 13, marginBottom: 10, background: "#FCEBEB", padding: "8px 12px", borderRadius: 6 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: "100%", background: "#3B6D11", color: "#fff", border: "none", padding: 12, borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "..." : mode === "login" ? t.auth.login : t.auth.register}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#666" }}>
          {mode === "login" ? t.auth.noAccount : t.auth.hasAccount}{" "}
          <span onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ color: "#3B6D11", fontWeight: 600, cursor: "pointer" }}>
            {mode === "login" ? t.auth.register : t.auth.login}
          </span>
        </div>
      </div>
    </div>
  );
}
