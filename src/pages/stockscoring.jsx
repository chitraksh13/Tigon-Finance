import { useState } from "react";
import { Link } from "react-router-dom";
import { generateStockRecommendation } from "../modules/pro/ai/stockScoringEngine";
import { authFetch } from "../utils/api";

const POPULAR_STOCKS = ["RELIANCE", "TCS", "INFY", "HDFC", "WIPRO", "ICICIBANK", "SBIN", "BAJFINANCE"];

function ScoreMeter({ score }) {
  const color =
    score >= 70 ? "var(--accent-green)" :
    score >= 45 ? "var(--accent-amber)" :
    "var(--accent-red)";
  const label =
    score >= 70 ? "Strong" :
    score >= 45 ? "Moderate" :
    "Weak";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Score</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "2rem", color }}>{score}</span>
          <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>/100</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color, marginLeft: 4, padding: "2px 7px", background: `${color}18`, borderRadius: 6 }}>{label}</span>
        </div>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${score}%`, borderRadius: 4,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 12px ${color}60`,
        }} />
      </div>
    </div>
  );
}

function MetricPill({ label, value, good }) {
  const color = good ? "var(--accent-green)" : good === false ? "var(--accent-red)" : "var(--accent-amber)";
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "14px 16px",
    }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1.25rem", color }}>{value ?? "—"}</div>
    </div>
  );
}

export default function StockScoring() {
  const [symbol, setSymbol] = useState("");
  const [result, setResult] = useState(null);
  const [stockRaw, setStockRaw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");
  const isPro = role === "pro" || role === "premium";

  async function handleAnalyze(sym) {
    const s = (sym || symbol).trim().toUpperCase();
    if (!s) return;
    setSymbol(s);
    setError("");
    setLoading(true);
    setResult(null);
    setStockRaw(null);
    try {
      const res = await authFetch(`/stock/${s}`);
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Stock API error."); return; }
      setStockRaw(data);
      const analysis = generateStockRecommendation(
        { peRatio: data.peRatio, roe: data.roe, changePercent: data.changePercent }
      );
      setResult(analysis);
    } catch {
      setError("Could not reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const recColor =
    result?.recommendation?.includes("Buy") ? "var(--accent-green)" :
    result?.recommendation?.includes("Sell") ? "var(--accent-red)" :
    "var(--accent-amber)";

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>

      {/* ── Inline navbar for authenticated page ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid var(--border)",
        background: "rgba(8,12,20,0.9)", backdropFilter: "blur(20px)",
        padding: "0 32px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#38bdf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 12px rgba(56,189,248,0.3)" }}>⚡</div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>Tigon<span style={{ color: "var(--accent-cyan)" }}>.</span></span>
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/dashboard" style={{ textDecoration: "none" }}><button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>← Dashboard</button></Link>
          <button className="btn-danger" style={{ padding: "8px 16px", fontSize: "0.875rem" }} onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("role"); window.location.href = "/login"; }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: "20%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle,rgba(56,189,248,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,rgba(56,189,248,0.2),rgba(99,102,241,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🤖</div>
            <div>
              <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.75rem", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>AI Stock Scoring</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>Proprietary scoring engine for Indian markets</p>
            </div>
            {isPro && (
              <span style={{ marginLeft: "auto", padding: "4px 12px", background: "linear-gradient(135deg,rgba(56,189,248,0.15),rgba(99,102,241,0.15))", border: "1px solid rgba(56,189,248,0.25)", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.08em" }}>PRO</span>
            )}
          </div>
        </div>

        {/* Pro gate */}
        {!isPro ? (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🔒</div>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)", margin: "0 0 12px" }}>Pro Feature</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: 28, maxWidth: 440, margin: "0 auto 28px" }}>
              AI Stock Scoring is available on the Pro and Premium plans. Upgrade to unlock in-depth analysis of Indian stocks.
            </p>
            <Link to="/subscription" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "13px 30px", fontSize: "1rem" }}>View Pricing Plans →</button>
            </Link>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="fintech-card" style={{ padding: 28, marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Enter NSE / BSE Symbol
              </label>
              <div className="stock-search-row" style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  placeholder="e.g. RELIANCE, TCS, INFY"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="fintech-input"
                  style={{ fontWeight: 700, letterSpacing: "0.05em", fontSize: "1rem" }}
                />
                <button className="btn-primary" onClick={() => handleAnalyze()} disabled={!symbol || loading} style={{ padding: "0 28px", height: 48, fontSize: "0.9375rem", whiteSpace: "nowrap" }}>
                  {loading ? "Analysing..." : "Analyse →"}
                </button>
              </div>

              {/* Quick picks */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>Quick pick:</span>
                {POPULAR_STOCKS.map(s => (
                  <button key={s} onClick={() => handleAnalyze(s)} style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "5px 12px", fontSize: "0.8rem", fontWeight: 600,
                    color: "var(--text-secondary)", cursor: "pointer",
                    transition: "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                    onMouseEnter={e => { e.target.style.background = "rgba(56,189,248,0.08)"; e.target.style.color = "var(--accent-cyan)"; e.target.style.borderColor = "rgba(56,189,248,0.2)"; }}
                    onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.color = "var(--text-secondary)"; e.target.style.borderColor = "var(--border)"; }}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, color: "var(--accent-red)", fontSize: "0.9rem" }}>
                ⚠ {error}
              </div>
            )}

            {/* Result */}
            {result && stockRaw && (
              <div className="fade-in">
                {/* Score card */}
                <div className="fintech-card" style={{ padding: 28, marginBottom: 20 }}>
                  <div className="stock-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div>
                      <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)", margin: "0 0 4px" }}>{symbol}</h2>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>AI analysis complete</p>
                    </div>
                    <div style={{
                      padding: "8px 20px", borderRadius: 10,
                      background: `${recColor}14`, border: `1px solid ${recColor}35`,
                      color: recColor, fontFamily: "Syne", fontWeight: 800, fontSize: "1.125rem", letterSpacing: "0.04em",
                    }}>
                      {result.recommendation}
                    </div>
                  </div>

                  <ScoreMeter score={result.finalScore} />

                  <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(255,255,255,0.025)", border: "1px solid var(--border)", borderRadius: 12 }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                      <strong style={{ color: "var(--text-primary)" }}>Analysis: </strong>{result.reasoning}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid-3" style={{ gap: 14, marginBottom: 20 }}>
                  <MetricPill label="PE Ratio" value={stockRaw.peRatio ? Number(stockRaw.peRatio).toFixed(2) : "N/A"} good={stockRaw.peRatio && stockRaw.peRatio < 30} />
                  <MetricPill label="ROE (%)" value={stockRaw.roe ? `${Number(stockRaw.roe).toFixed(1)}%` : "N/A"} good={stockRaw.roe && stockRaw.roe > 15} />
                  <MetricPill label="Day Change" value={stockRaw.changePercent ? `${Number(stockRaw.changePercent).toFixed(2)}%` : "N/A"} good={stockRaw.changePercent > 0} />
                </div>

                {/* Scoring breakdown */}
                <div className="fintech-card" style={{ padding: 24 }}>
                  <h4 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-secondary)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Score breakdown</h4>
                  {[
                    { label: "Valuation (PE Ratio)", max: 30, desc: "Lower PE = better value" },
                    { label: "Profitability (ROE)", max: 30, desc: "Higher ROE = stronger returns" },
                    { label: "Momentum (Day Change)", max: 40, desc: "Positive change = bullish signal" },
                  ].map(({ label, max, desc }) => (
                    <div key={label} style={{ marginBottom: 14 }}>
                      <div className="breakdown-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>{label}</span>
                        <span className="breakdown-desc" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{desc}</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${(max / 100) * 100}%`, background: "linear-gradient(90deg,#38bdf8,#6366f1)", borderRadius: 3, opacity: 0.5 }} />
                      </div>
                    </div>
                  ))}
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "12px 0 0", lineHeight: 1.6 }}>
                    ⚠ This is not financial advice. AI scoring is for informational purposes only. Always do your own research before investing.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}