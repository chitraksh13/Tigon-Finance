import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const FEATURES = [
  {
    icon: "📊",
    title: "Expense Tracking",
    desc: "Log, categorise and visualise every rupee you spend. Monthly breakdowns with smart pie charts.",
    color: "#38bdf8",
  },
  {
    icon: "🧠",
    title: "Smart Insights",
    desc: "AI-generated spending insights that flag overspending and celebrate healthy budget habits.",
    color: "#a78bfa",
  },
  {
    icon: "🤖",
    title: "AI Stock Scoring",
    desc: "Our proprietary scoring engine analyses Indian stocks using PE, ROE and momentum signals.",
    color: "#34d399",
  },
  {
    icon: "🔐",
    title: "Secure & Private",
    desc: "JWT-based authentication, encrypted storage. Your financial data stays yours.",
    color: "#fbbf24",
  },
  {
    icon: "📅",
    title: "Monthly Periods",
    desc: "Snap between months instantly. Compare spending patterns and track progress over time.",
    color: "#f87171",
  },
  {
    icon: "🚀",
    title: "Pro Features",
    desc: "Unlock advanced stock analysis, market sentiment and portfolio intelligence with Tigon Pro.",
    color: "#fb923c",
  },
];

const STATS = [
  { value: "₹2.4Cr+", label: "Tracked across users" },
  { value: "12k+", label: "Expenses logged" },
  { value: "98%", label: "Uptime reliability" },
  { value: "4.9★", label: "Average rating" },
];

export default function Home() {
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-pad grid-bg" style={{ position: "relative", overflow: "hidden" }}>
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 600, height: 600, background: "radial-gradient(circle,rgba(56,189,248,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "0%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="fade-in" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 32,
          }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-cyan)", display: "inline-block" }} />
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--accent-cyan)", letterSpacing: "0.04em" }}>
              Now with AI Stock Scoring for Indian markets
            </span>
          </div>

          <h1 className="fade-in" style={{
            fontFamily: "Syne", fontSize: "clamp(2.5rem,6vw,4rem)", fontWeight: 800,
            color: "var(--text-primary)", lineHeight: 1.1, marginBottom: 24,
            letterSpacing: "-0.03em",
          }}>
            Take control of your{" "}
            <span style={{ background: "linear-gradient(135deg,#38bdf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              financial future
            </span>
          </h1>

          <p className="fade-in" style={{
            fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: 1.7,
            marginBottom: 44, maxWidth: 580, margin: "0 auto 44px",
          }}>
            Tigon Finance combines expense tracking, AI-powered insights and Indian stock analysis into one beautifully simple dashboard.
          </p>

          <div className="fade-in" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
                Start for free →
              </button>
            </Link>
            <Link to="/subscription" style={{ textDecoration: "none" }}>
              <button className="btn-secondary" style={{ padding: "14px 28px", fontSize: "1rem" }}>
                View pricing
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "48px 24px" }}>
        <div className="grid-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Syne", fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{
              display: "inline-block", fontSize: "0.75rem", fontWeight: 700,
              color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
            }}>Everything you need</span>
            <h2 style={{ fontFamily: "Syne", fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 800, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.03em" }}>
              Built for serious personal finance
            </h2>
          </div>

          <div className="grid-3">
            {FEATURES.map(({ icon, title, desc, color }) => (
              <div key={title} className="fintech-card" style={{ padding: 28, cursor: "default" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, marginBottom: 18,
                }}>
                  {icon}
                </div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text-primary)", margin: "0 0 10px" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px 100px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg,rgba(56,189,248,0.08),rgba(99,102,241,0.08))",
            border: "1px solid rgba(56,189,248,0.18)", borderRadius: 24,
            textAlign: "center",
          }}>
            <h2 style={{ fontFamily: "Syne", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              Ready to get started?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 36px" }}>
              Join thousands of users managing their finances smarter with Tigon. Free to start, no credit card required.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ padding: "13px 30px", fontSize: "0.9375rem" }}>
                  Create free account →
                </button>
              </Link>
              <Link to="/contact" style={{ textDecoration: "none" }}>
                <button className="btn-secondary" style={{ padding: "13px 24px", fontSize: "0.9375rem" }}>
                  Talk to us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-row" style={{ borderTop: "1px solid var(--border)", padding: "24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#38bdf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚡</div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)" }}>Tigon<span style={{ color: "var(--accent-cyan)" }}>.</span></span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", margin: 0 }}>© 2026 Tigon Finance. All rights reserved.</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Support"].map(l => (
            <a key={l} href="#" style={{ color: "var(--text-muted)", fontSize: "0.8125rem", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}