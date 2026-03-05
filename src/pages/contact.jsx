import { useState } from "react";
import Navbar from "../components/Navbar";

const CONTACT_OPTIONS = [
  { icon: "💬", title: "General enquiry", desc: "Questions about Tigon Finance" },
  { icon: "🐞", title: "Bug report", desc: "Found something broken?" },
  { icon: "🚀", title: "Feature request", desc: "Have an idea to share?" },
  { icon: "💼", title: "Business / partnerships", desc: "Want to work with us?" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }));
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="grid-bg" style={{ padding: "80px 24px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: "20%", width: 500, height: 400, background: "radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-green)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Contact</span>
          <h1 style={{ fontFamily: "Syne", fontSize: "clamp(2rem,5vw,2.75rem)", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 16px", letterSpacing: "-0.03em" }}>
            We'd love to hear from you
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            Whether it's a bug, an idea, or a general question — we read every message.
          </p>
        </div>
      </section>

      {/* Main */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 32, alignItems: "start" }}>

          {/* Left — contact types */}
          <div>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1rem", color: "var(--text-secondary)", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>How can we help?</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CONTACT_OPTIONS.map(({ icon, title, desc }) => (
                <div key={title} className="fintech-card" style={{ padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(56,189,248,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, padding: "18px 20px", background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 14 }}>
              <p style={{ fontWeight: 600, color: "var(--accent-green)", fontSize: "0.875rem", margin: "0 0 4px" }}>⚡ Average response time</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.84375rem", margin: 0 }}>We typically reply within <strong style={{ color: "var(--text-primary)" }}>4–8 hours</strong> on working days.</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="fintech-card" style={{ padding: 32 }}>
            {submitted ? (
              <div className="fade-in" style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1.25rem", color: "var(--text-primary)", margin: "0 0 10px" }}>Message sent!</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>
                  Thanks for reaching out. We'll get back to you at <strong style={{ color: "var(--accent-cyan)" }}>{form.email}</strong> soon.
                </p>
                <button className="btn-secondary" style={{ marginTop: 24 }} onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", margin: "0 0 24px" }}>Send us a message</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {[
                    { label: "Your name", field: "name", type: "text", placeholder: "John Doe" },
                    { label: "Email address", field: "email", type: "email", placeholder: "you@example.com" },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                      <input type={type} placeholder={placeholder} value={form[field]} onChange={set(field)}
                        className={`fintech-input ${errors[field] ? "shake" : ""}`}
                        style={errors[field] ? { borderColor: "var(--accent-red)" } : {}}
                      />
                      {errors[field] && <p style={{ color: "var(--accent-red)", fontSize: "0.75rem", margin: "5px 0 0" }}>{errors[field]}</p>}
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject (optional)</label>
                  <input type="text" placeholder="What's this about?" value={form.subject} onChange={set("subject")} className="fintech-input" />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>Message</label>
                  <textarea
                    placeholder="Tell us what's on your mind..."
                    value={form.message} onChange={set("message")} rows={5}
                    className={`fintech-input ${errors.message ? "shake" : ""}`}
                    style={{ resize: "vertical", minHeight: 120, ...(errors.message ? { borderColor: "var(--accent-red)" } : {}) }}
                  />
                  {errors.message && <p style={{ color: "var(--accent-red)", fontSize: "0.75rem", margin: "5px 0 0" }}>{errors.message}</p>}
                </div>

                <button className="btn-primary" style={{ width: "100%" }} onClick={handleSubmit}>
                  Send message →
                </button>
              </>
            )}
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