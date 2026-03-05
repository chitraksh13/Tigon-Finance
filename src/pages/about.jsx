import Navbar from "../components/Navbar";

const TEAM = [
  { name: "Chitraksh BG", role: "Founder & CEO", emoji: "👨‍💻", bio: "Student of SJU. Passionate about democratising personal finance for India." },
  { name: "Madhumitha K", role: "Head of Product", emoji: "👩‍🎨", bio: "Student of SJU. Experienced with building consumer financial tools." },
];

const VALUES = [
  { icon: "🎯", title: "Clarity first", desc: "We make complex financial data simple and actionable." },
  { icon: "🔒", title: "Privacy by default", desc: "Your data is yours. We never sell or share it." },
  { icon: "🇮🇳", title: "Built for India", desc: "Indian markets, Indian currency, Indian context." },
  { icon: "⚡", title: "Always improving", desc: "We ship fast and listen to our users obsessively." },
];

export default function About() {
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="grid-bg" style={{ padding: "88px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: "10%", width: 500, height: 500, background: "radial-gradient(circle,rgba(167,139,250,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-purple)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Our story</span>
          <h1 style={{ fontFamily: "Syne", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 20px", letterSpacing: "-0.03em" }}>
            Finance tools built with <span style={{ background: "linear-gradient(135deg,#a78bfa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>purpose</span>
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>
            Tigon was born from frustration — existing finance apps were either too complex, too foreign, or too expensive for everyday Indians. We built the tool we wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "72px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Our mission</span>
            <h2 style={{ fontFamily: "Syne", fontSize: "1.875rem", fontWeight: 800, color: "var(--text-primary)", margin: "14px 0 20px", letterSpacing: "-0.02em" }}>
              Make every Indian financially aware
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 16, fontSize: "0.9375rem" }}>
              Most Indians have no clear picture of where their money goes month to month. Tigon changes that with dead-simple tracking, AI nudges, and stock intelligence powered by real market data.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, margin: 0, fontSize: "0.9375rem" }}>
              We started in 2024 as a side project and grew to thousands of users without spending a rupee on advertising — purely word of mouth.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="fintech-card" style={{ padding: 20 }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
                <h4 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)", margin: "0 0 6px" }}>{title}</h4>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "72px 24px 96px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-green)", textTransform: "uppercase", letterSpacing: "0.1em" }}>The team</span>
            <h2 style={{ fontFamily: "Syne", fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", margin: "12px 0 0", letterSpacing: "-0.02em" }}>People behind Tigon</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {TEAM.map(({ name, role, emoji, bio }) => (
              <div key={name} className="fintech-card" style={{ padding: 28, textAlign: "center" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px",
                  background: "linear-gradient(135deg,rgba(56,189,248,0.15),rgba(99,102,241,0.15))",
                  border: "1px solid rgba(56,189,248,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                }}>{emoji}</div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text-primary)", margin: "0 0 4px" }}>{name}</h3>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--accent-cyan)", margin: "0 0 14px" }}>{role}</p>
                <p style={{ fontSize: "0.84375rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#38bdf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚡</div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)" }}>Tigon<span style={{ color: "var(--accent-cyan)" }}>.</span></span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", margin: 0 }}>© 2026 Tigon Finance. All rights reserved.</p>
      </footer>
    </div>
  );
}