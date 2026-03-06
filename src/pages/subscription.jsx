import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    tagline: "Perfect for getting started",
    color: "var(--text-secondary)",
    accent: "rgba(255,255,255,0.08)",
    border: "var(--border)",
    features: [
      "✓ Expense tracking (up to 50/month)",
      "✓ Monthly income management",
      "✓ Basic insights & charts",
      "✓ 3-month history",
      "✗ AI Stock Scoring",
      "✗ Market sentiment",
      "✗ Export reports",
      "✗ Priority support",
    ],
    cta: "Get started free",
    ctaStyle: "btn-secondary",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "per month",
    tagline: "For serious personal finance",
    color: "var(--accent-cyan)",
    accent: "rgba(56,189,248,0.07)",
    border: "rgba(56,189,248,0.3)",
    features: [
      "✓ Unlimited expense tracking",
      "✓ Monthly income management",
      "✓ Advanced insights & charts",
      "✓ Full history",
      "✓ AI Stock Scoring (Indian markets)",
      "✓ Market sentiment signals",
      "✓ Export to CSV/PDF",
      "✓ Priority support",
    ],
    cta: "Start Pro →",
    ctaStyle: "btn-primary",
    popular: true,
  },
];

const FAQ = [
  { q: "Can I upgrade or downgrade at any time?", a: "Yes — changes take effect at your next billing cycle. You keep access to your current plan until then." },
  { q: "Is there a free trial for Pro?", a: "Yes, new users get a 7-day Pro trial with no credit card required." },
  { q: "What payment methods do you accept?", a: "UPI, Debit/Credit cards, Net Banking and Wallets via Razorpay." },
  { q: "Is my financial data secure?", a: "Absolutely. All data is encrypted at rest and in transit. We are SOC2 compliant." },
];

export default function Subscription() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="grid-bg" style={{ padding: "80px 24px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "30%", width: 600, height: 400, background: "radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Pricing</span>
          <h1 style={{ fontFamily: "Syne", fontSize: "clamp(2rem,5vw,2.75rem)", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 16px", letterSpacing: "-0.03em" }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            Start free. Upgrade when you need more power. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section style={{ padding: "0 24px 80px" }}>
        <div className="pricing-grid" style={{ maxWidth: 780, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24, alignItems: "start" }}>
          {PLANS.map((plan) => (
            <div key={plan.id} style={{
              background: plan.accent,
              border: `1px solid ${plan.border}`,
              borderRadius: 20, padding: 28, position: "relative",
              boxShadow: plan.popular ? `0 8px 40px rgba(56,189,248,0.12)` : "var(--shadow-card)",
              transform: plan.popular ? "translateY(-8px)" : "none",
              transition: "transform 0.2s",
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg,#38bdf8,#6366f1)",
                  color: "#fff", fontSize: "0.72rem", fontWeight: 700,
                  padding: "4px 14px", borderRadius: 100, letterSpacing: "0.06em",
                  textTransform: "uppercase", whiteSpace: "nowrap",
                }}>Most Popular</div>
              )}

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.25rem", color: plan.color, margin: "0 0 6px" }}>{plan.name}</h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "0 0 18px" }}>{plan.tagline}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "2.25rem", color: "var(--text-primary)" }}>{plan.price}</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>/ {plan.period}</span>
                </div>
              </div>

              <div style={{ height: 1, background: "var(--border)", marginBottom: 24 }} />

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.features.map((f) => {
                  const included = f.startsWith("✓");
                  return (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.875rem", color: included ? "var(--text-secondary)" : "var(--text-muted)", opacity: included ? 1 : 0.55 }}>
                      <span style={{ color: included ? "var(--accent-green)" : "var(--text-muted)", flexShrink: 0, marginTop: 1 }}>{included ? "✓" : "✗"}</span>
                      <span>{f.slice(2)}</span>
                    </li>
                  );
                })}
              </ul>

              <Link to="/register" style={{ textDecoration: "none", display: "block" }}>
                <button className={plan.ctaStyle} style={{ width: "100%", justifyContent: "center" }}>
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "0 24px 96px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 72 }}>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.75rem", color: "var(--text-primary)", textAlign: "center", margin: "0 0 44px", letterSpacing: "-0.02em" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQ.map(({ q, a }, i) => (
              <div key={q} className="fintech-card" style={{ padding: 0, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    color: "var(--text-primary)", fontFamily: "DM Sans", fontSize: "0.9375rem", fontWeight: 600,
                    textAlign: "left", gap: 12,
                  }}
                >
                  {q}
                  <span style={{ color: "var(--accent-cyan)", fontSize: "1.1rem", flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 22px 18px", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer-row" style={{ borderTop: "1px solid var(--border)", padding: "24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#38bdf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚡</div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)" }}>Tigon<span style={{ color: "var(--accent-cyan)" }}>.</span></span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", margin: 0 }}>© 2026 Tigon Finance. All rights reserved.</p>
      </footer>
    </div>
  );
}