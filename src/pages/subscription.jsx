import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { authFetch } from "../utils/api";

const FAQ = [
  { q: "Can I upgrade or downgrade at any time?", a: "Yes — changes take effect at your next billing cycle. You keep Pro access until the period ends." },
  { q: "Is there a free trial for Pro?", a: "Yes, new users get a 7-day Pro trial with no credit card required." },
  { q: "What payment methods do you accept?", a: "UPI, Debit/Credit cards, Net Banking and Wallets via Razorpay." },
  { q: "Is my financial data secure?", a: "Absolutely. All data is encrypted at rest and in transit." },
];

// Loads the Razorpay checkout script dynamically
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Subscription() {
  const [openFaq, setOpenFaq] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;
  const isPro = role === "pro";

  async function handleUpgrade() {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (isPro) return;

    setPayError("");
    setPaying(true);

    // Load Razorpay SDK
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPayError("Could not load payment gateway. Please check your internet connection.");
      setPaying(false);
      return;
    }

    // Step 1 — Create order on backend
    let orderData;
    try {
      const res = await authFetch("/payment/create-order", { method: "POST" });
      orderData = await res.json();
      if (!res.ok) {
        setPayError(orderData.message || "Failed to create payment order.");
        setPaying(false);
        return;
      }
    } catch {
      setPayError("Server error. Please make sure the backend is running.");
      setPaying(false);
      return;
    }

    // Decode user info from token for prefilling Razorpay form
    let userName = "";
    let userEmail = "";
    try {
      const decoded = jwtDecode(token);
      // Fetch profile for name/email
      const profileRes = await authFetch("/profile");
      const profile = await profileRes.json();
      userName = profile.name || "";
      userEmail = profile.email || "";
    } catch {}

    // Step 2 — Open Razorpay checkout modal
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Tigon Finance",
      description: "Tigon Pro — Monthly Subscription",
      image: "", // Add your logo URL here if you have one
      order_id: orderData.orderId,
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: "#38bdf8", // Tigon cyan
        backdrop_color: "rgba(8,12,20,0.85)",
      },
      modal: {
        ondismiss: () => {
          setPaying(false);
          setPayError("Payment was cancelled. You can try again anytime.");
        },
      },
      handler: async function (response) {
        // Step 3 — Verify payment on backend
        try {
          const verifyRes = await authFetch("/payment/verify", {
            method: "POST",
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok) {
            setPayError(verifyData.message || "Payment verification failed.");
            setPaying(false);
            return;
          }

          // Step 4 — Store the new Pro JWT and update role in localStorage
          localStorage.setItem("token", verifyData.token);
          localStorage.setItem("role", "pro");

          // Navigate to success page
          navigate("/payment/success");

        } catch {
          setPayError("Payment completed but verification failed. Please contact support.");
          setPaying(false);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      setPayError(`Payment failed: ${response.error.description}`);
      setPaying(false);
    });
    rzp.open();
    setPaying(false);
  }

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
        <div style={{ maxWidth: 780, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24, alignItems: "start" }}>

          {/* Free Plan */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
            borderRadius: 20, padding: 28, boxShadow: "var(--shadow-card)",
          }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-secondary)", margin: "0 0 6px" }}>Free</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "0 0 18px" }}>Perfect for getting started</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
              <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "2.25rem", color: "var(--text-primary)" }}>₹0</span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>/ forever</span>
            </div>
            <div style={{ height: 1, background: "var(--border)", marginBottom: 24 }} />
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                [true,  "Expense tracking (up to 50/month)"],
                [true,  "Monthly income management"],
                [true,  "Basic insights & charts"],
                [true,  "3-month history"],
                [false, "AI Stock Scoring"],
                [false, "Market sentiment"],
                [false, "Export reports"],
                [false, "Priority support"],
              ].map(([included, label]) => (
                <li key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.875rem", color: included ? "var(--text-secondary)" : "var(--text-muted)", opacity: included ? 1 : 0.5 }}>
                  <span style={{ color: included ? "var(--accent-green)" : "var(--text-muted)", flexShrink: 0 }}>{included ? "✓" : "✗"}</span>
                  {label}
                </li>
              ))}
            </ul>
            <Link to="/register" style={{ textDecoration: "none", display: "block" }}>
              <button className="btn-secondary" style={{ width: "100%" }}>Get started free</button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div style={{
            background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.3)",
            borderRadius: 20, padding: 28, position: "relative",
            boxShadow: "0 8px 40px rgba(56,189,248,0.12)", transform: "translateY(-8px)",
          }}>
            {/* Popular badge */}
            <div style={{
              position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
              background: "linear-gradient(135deg,#38bdf8,#6366f1)",
              color: "#fff", fontSize: "0.72rem", fontWeight: 700,
              padding: "4px 14px", borderRadius: 100, letterSpacing: "0.06em",
              textTransform: "uppercase", whiteSpace: "nowrap",
            }}>Most Popular</div>

            <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.25rem", color: "var(--accent-cyan)", margin: "0 0 6px" }}>Pro</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "0 0 18px" }}>For serious personal finance</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
              <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "2.25rem", color: "var(--text-primary)" }}>₹499</span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>/ per month</span>
            </div>
            <div style={{ height: 1, background: "rgba(56,189,248,0.2)", marginBottom: 24 }} />
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Unlimited expense tracking",
                "Monthly income management",
                "Advanced insights & charts",
                "Full history",
                "AI Stock Scoring (Indian markets)",
                "Market sentiment signals",
                "Export to CSV/PDF",
                "Priority support",
              ].map((label) => (
                <li key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--accent-green)", flexShrink: 0 }}>✓</span>
                  {label}
                </li>
              ))}
            </ul>

            {/* Payment error */}
            {payError && (
              <div style={{
                background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 10, padding: "10px 14px", marginBottom: 14,
                color: "var(--accent-red)", fontSize: "0.8125rem", lineHeight: 1.5,
              }}>
                ⚠ {payError}
              </div>
            )}

            {isPro ? (
              <button className="btn-primary" disabled style={{ width: "100%", opacity: 0.7, cursor: "default" }}>
                ✓ You're on Pro
              </button>
            ) : (
              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={handleUpgrade}
                disabled={paying}
              >
                {paying ? "Opening payment..." : isLoggedIn ? "Upgrade to Pro →" : "Sign in to upgrade →"}
              </button>
            )}

            {!isLoggedIn && (
              <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 10 }}>
                You'll be redirected to sign in first
              </p>
            )}
          </div>
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