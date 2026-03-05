import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// This page lives at /auth/callback
// The backend redirects here after Google login with ?token=... or ?error=...

const ERROR_MESSAGES = {
  google_cancelled:    "Google sign-in was cancelled. Please try again.",
  google_token_failed: "Could not complete Google sign-in. Please try again.",
  google_no_email:     "Your Google account did not provide an email address.",
  google_server_error: "A server error occurred during Google sign-in.",
};

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const errorCode = searchParams.get("error");

    if (errorCode) {
      setError(ERROR_MESSAGES[errorCode] || "An unknown error occurred.");
      return;
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("role", decoded.role);
        navigate("/dashboard", { replace: true });
      } catch {
        setError("Received an invalid token. Please try signing in again.");
      }
      return;
    }

    // No token and no error — shouldn't happen, redirect to login
    navigate("/login", { replace: true });
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg-primary)",
      flexDirection: "column", gap: 20,
    }}>
      {error ? (
        <div style={{ textAlign: "center", maxWidth: 420, padding: "0 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1.25rem", color: "var(--text-primary)", margin: "0 0 12px" }}>
            Sign-in failed
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: 24 }}>
            {error}
          </p>
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: "0 auto 18px",
            background: "linear-gradient(135deg,#38bdf8,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
            animation: "pulseDot 1.2s infinite ease-in-out",
          }}>⚡</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
            Signing you in with Google...
          </p>
        </div>
      )}
    </div>
  );
}