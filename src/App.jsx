import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import About from "./pages/about";
import Subscription from "./pages/subscription";
import Contact from "./pages/contact";
import StockScoring from "./pages/stockscoring";
import AuthCallback from "./pages/AuthCallback";

function PrivateRoute({ children, authChecked }) {
  const token = localStorage.getItem("token");
  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, margin: "0 auto 16px", background: "linear-gradient(135deg,#38bdf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚡</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading Tigon...</p>
        </div>
      </div>
    );
  }
  return token ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setAuthChecked(true); return; }
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => { if (!res.ok) localStorage.removeItem("token"); })
      .finally(() => setAuthChecked(true));
  }, []);

  return (
    <Routes>
      {/* Public marketing pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected app pages */}
      <Route path="/dashboard" element={<PrivateRoute authChecked={authChecked}><Dashboard /></PrivateRoute>} />
      <Route path="/stocks" element={<PrivateRoute authChecked={authChecked}><StockScoring /></PrivateRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;