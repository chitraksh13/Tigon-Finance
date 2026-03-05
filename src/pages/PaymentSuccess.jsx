import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so the animation feels intentional
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-primary)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{ position: "fixed", top: "20%", left: "30%", width: 600, height: 600, background: "radial-gradient(circle,rgba(52,211,153,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", right: "20%", width: 400, height: 400, background: "radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        maxWidth: 520, width: "100%", textAlign: "center",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        position: "relative", zIndex: 1,
      }}>
        {/* Success icon */}
        <div style={{
          width: 88, height: 88, borderRadius: "50%", margin: "0 auto 28px",
          background: "linear-gradient(135deg,rgba(52,211,153,0.2),rgba(56,189,248,0.15))",
          border: "1px solid rgba(52,211,153,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40,
        }}>✅</div>

        <h1 style={{
          fontFamily: "Syne", fontWeight: 800, fontSize: "2rem",
          color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.02em",
        }}>
          Welcome to Tigon Pro!
        </h1>

        <p style={{
          color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7,
          margin: "0 0 36px",
        }}>
          Your payment was successful and your account has been upgraded. You now have full access to AI Stock Scoring, market sentiment, and all Pro features.
        </p>

        {/* Pro features unlocked */}
        <div style={{
          background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)",
          borderRadius: 16, padding: "20px 24px", marginBottom: 36, textAlign: "left",
        }}>
          <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.875rem", color: "var(--accent-green)", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Now unlocked for you
          </p>
          {[
            "🤖 AI Stock Scoring for Indian markets",
            "📊 Market sentiment signals",
            "📅 Full expense history",
            "📤 Export to CSV/PDF",
            "💬 Priority support",
          ].map((f) => (
            <div key={f} style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>✓</span> {f}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ padding: "13px 28px", fontSize: "0.9375rem" }}>
              Go to Dashboard →
            </button>
          </Link>
          <Link to="/stocks" style={{ textDecoration: "none" }}>
            <button className="btn-secondary" style={{ padding: "13px 24px", fontSize: "0.9375rem" }}>
              Try AI Stock Scoring
            </button>
          </Link>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 28 }}>
          A payment receipt has been sent to your registered email via Razorpay.
        </p>
      </div>
    </div>
  );
}