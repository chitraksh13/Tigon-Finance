import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/home" },
  { label: "About", to: "/about" },
  { label: "Pricing", to: "/subscription" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar({ transparent = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      borderBottom: transparent ? "1px solid transparent" : "1px solid var(--border)",
      background: transparent ? "transparent" : "rgba(8,12,20,0.9)",
      backdropFilter: "blur(20px)",
      padding: "0 32px",
      height: 68,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Logo */}
      <Link to="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg,#38bdf8,#6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, boxShadow: "0 4px 12px rgba(56,189,248,0.3)",
          flexShrink: 0,
        }}>⚡</div>
        <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
          Tigon<span style={{ color: "var(--accent-cyan)" }}>.</span>
        </span>
      </Link>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {NAV_LINKS.map(({ label, to }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} style={{
              padding: "7px 14px", borderRadius: 8,
              fontSize: "0.9rem", fontWeight: 500,
              color: active ? "var(--accent-cyan)" : "var(--text-secondary)",
              background: active ? "rgba(56,189,248,0.08)" : "transparent",
              textDecoration: "none",
              transition: "color 0.2s, background 0.2s",
              border: active ? "1px solid rgba(56,189,248,0.15)" : "1px solid transparent",
            }}
              onMouseEnter={e => { if (!active) { e.target.style.color = "var(--text-primary)"; e.target.style.background = "rgba(255,255,255,0.04)"; } }}
              onMouseLeave={e => { if (!active) { e.target.style.color = "var(--text-secondary)"; e.target.style.background = "transparent"; } }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Auth buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {token ? (
          <>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>
                Dashboard
              </button>
            </Link>
            <button className="btn-danger" style={{ padding: "8px 16px", fontSize: "0.875rem" }} onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>
                Sign In
              </button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.875rem" }}>
                Get Started →
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}