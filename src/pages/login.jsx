import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

const GOOGLE_ERROR_MESSAGES = {
  google_cancelled:    "Google sign-in was cancelled.",
  google_token_failed: "Google sign-in failed. Please try again.",
  google_no_email:     "Your Google account did not provide an email.",
  google_server_error: "A server error occurred. Please try again.",
};

function Login() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [errors, setErrors]       = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]     = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Show error if redirected back from a failed Google login
  useEffect(() => {
    const errorCode = searchParams.get("error");
    if (errorCode) {
      setServerError(GOOGLE_ERROR_MESSAGES[errorCode] || "Google sign-in failed.");
    }
  }, []);

  function validate() {
    const errs = {};
    if (!email.trim())          errs.email = "Email is required";
    else if (!validateEmail(email)) errs.email = "Please enter a valid email address";
    if (!password)              errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  }

  async function handleLogin() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.message || "Invalid credentials."); return; }
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode(data.token);
      localStorage.setItem("role", decoded.role);
      navigate("/dashboard");
    } catch {
      setServerError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    // Redirect to backend which starts the Google OAuth flow
    window.location.href = "http://localhost:5000/auth/google";
  }

  const set = (field) => (e) => {
    if (field === "email") setEmail(e.target.value);
    else setPassword(e.target.value);
    if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }));
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4"
      style={{ background: "var(--bg-primary)" }}>
      <div style={{ position: "fixed", top: "20%", left: "15%", width: 400, height: 400, background: "radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "20%", right: "10%", width: 500, height: 500, background: "radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div className="fade-in w-full max-w-md relative" style={{ zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link to="/home" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 20 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#38bdf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, boxShadow: "0 4px 14px rgba(56,189,248,0.3)" }}>⚡</div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Tigon<span style={{ color: "var(--accent-cyan)" }}>.</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: "Syne", fontSize: "1.875rem", fontWeight: 700, color: "var(--text-primary)", margin: "16px 0 8px" }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", margin: 0 }}>
            Sign in to your financial dashboard
          </p>
        </div>

        <div className="fintech-card" style={{ padding: 32 }}>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "12px 20px", cursor: "pointer", marginBottom: 24,
              color: "var(--text-primary)", fontFamily: "DM Sans", fontSize: "0.9375rem", fontWeight: 500,
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
            <input
              type="email" placeholder="you@example.com"
              className={`fintech-input ${errors.email ? "shake" : ""}`}
              style={errors.email ? { borderColor: "var(--accent-red)" } : {}}
              value={email} onChange={set("email")}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {errors.email && <p style={{ color: "var(--accent-red)", fontSize: "0.75rem", margin: "5px 0 0" }}>⚠ {errors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
            <input
              type="password" placeholder="••••••••"
              className={`fintech-input ${errors.password ? "shake" : ""}`}
              style={errors.password ? { borderColor: "var(--accent-red)" } : {}}
              value={password} onChange={set("password")}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {errors.password && <p style={{ color: "var(--accent-red)", fontSize: "0.75rem", margin: "5px 0 0" }}>⚠ {errors.password}</p>}
          </div>

          {/* Server / Google error */}
          {serverError && (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, color: "var(--accent-red)", fontSize: "0.875rem" }}>
              ⚠ {serverError}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} className="btn-primary" style={{ width: "100%" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent-cyan)", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;