import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home",    to: "/home" },
  { label: "About",   to: "/about" },
  { label: "Pricing", to: "/subscription" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar({ transparent = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (to) => location.pathname === to;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      borderBottom: transparent ? "1px solid transparent" : "1px solid var(--border)",
      background: transparent ? "transparent" : "rgba(8,12,20,0.95)",
      backdropFilter: "blur(20px)",
      padding: "0 24px", height: 68,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>

      {/* Logo */}
      <Link to="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#38bdf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 12px rgba(56,189,248,0.3)", flexShrink: 0 }}>⚡</div>
        <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
          Tigon<span style={{ color: "var(--accent-cyan)" }}>.</span>
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="nav-links-desktop" style={{ alignItems: "center", gap: 4 }}>
        {NAV_LINKS.map(({ label, to }) => (
          <Link key={to} to={to} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: "0.9rem", fontWeight: 500,
            color: isActive(to) ? "var(--accent-cyan)" : "var(--text-secondary)",
            background: isActive(to) ? "rgba(56,189,248,0.08)" : "transparent",
            textDecoration: "none", transition: "color 0.2s, background 0.2s",
            border: isActive(to) ? "1px solid rgba(56,189,248,0.15)" : "1px solid transparent",
          }}>{label}</Link>
        ))}
      </div>

      {/* Desktop auth */}
      <div className="nav-auth-desktop" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {token ? (
          <>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>Dashboard</button>
            </Link>
            <button className="btn-danger" style={{ padding: "8px 16px", fontSize: "0.875rem" }} onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>Sign In</button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.875rem" }}>Get Started →</button>
            </Link>
          </>
        )}
      </div>

      {/* Hamburger — mobile only */}
      <button className="nav-hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        {open ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="nav-mobile-menu" onClick={() => setOpen(false)}>
          {NAV_LINKS.map(({ label, to }) => (
            <Link key={to} to={to} className={`nav-mobile-link${isActive(to) ? " active" : ""}`}>{label}</Link>
          ))}
          <div className="nav-mobile-divider" />
          {token ? (
            <>
              <Link to="/dashboard" className="nav-mobile-link">📊 Dashboard</Link>
              <button onClick={handleLogout} style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", borderRadius: 10, padding: "11px 14px", color: "var(--accent-red)", fontFamily: "DM Sans", fontSize: "0.9375rem", fontWeight: 500, cursor: "pointer", textAlign: "left", width: "100%", marginTop: 4 }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-mobile-link">Sign In</Link>
              <Link to="/register" style={{ textDecoration: "none", marginTop: 4 }}>
                <button className="btn-primary" style={{ width: "100%", padding: "11px 16px" }}>Get Started →</button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}