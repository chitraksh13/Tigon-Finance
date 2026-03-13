import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IncomeInput from "../components/IncomeInput";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import InsightsPanel from "../components/InsightsPanel";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [editAmountError, setEditAmountError] = useState(false);
  const [user, setUser] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const role = localStorage.getItem("role");
  const isPro = role === "pro" || role === "premium";

  useEffect(() => { loadExpenses(); loadIncome(); loadProfile(); }, [selectedMonth]);
  useEffect(() => {
  if (expenses.length > 0) loadAiInsights();
}, [expenses, income]);
  async function loadProfile() { const d = await apiGet("/profile"); if (d) setUser(d); }
  async function loadExpenses() { try { const d = await apiGet(`/expenses?month=${selectedMonth}`); setExpenses(Array.isArray(d) ? d : []); } catch { setExpenses([]); } }
  async function loadIncome() { try { const d = await apiGet(`/income?month=${selectedMonth}`); setIncome(Number(d?.amount || 0)); } catch { setIncome(0); } }

  async function addExpenses() {
    if (Number(expenseAmount) <= 0) { setAmountError(true); setTimeout(() => setAmountError(false), 400); return; }
    try { await apiPost("/add-expense", { amount: Number(expenseAmount), category: expenseCategory, month: selectedMonth }); await loadExpenses(); setExpenseAmount(""); setExpenseCategory(""); } catch {}
  }

  async function saveEditExpense(id) {
    if (Number(editAmount) <= 0) { setEditAmountError(true); setTimeout(() => setEditAmountError(false), 400); return; }
    try { await apiPut(`/expenses/${id}`, { amount: Number(editAmount), category: editCategory, month: selectedMonth }); await loadExpenses(); setEditingId(null); } catch {}
  }

  async function deleteExpense(id) { try { await apiDelete(`/expenses/${id}?month=${selectedMonth}`); await loadExpenses(); } catch {} }
  async function saveIncome() { try { await apiPost("/set-income", { amount: income, month: selectedMonth }); } catch {} }

  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const totalExpense = safeExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const savings = income - totalExpense;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const categoryTotals = safeExpenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0); return acc; }, {});
  <InsightsPanel insights={aiInsights} loading={insightsLoading} />
  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  async function loadAiInsights() {
  if (Object.keys(categoryTotals).length === 0) return;
  setInsightsLoading(true);
  try {
    const data = await apiPost("/ai-insights", {
      income,
      totalExpenses: expenses.reduce((s, e) => s + Number(e.amount), 0),
      categoryTotals,
      month: selectedMonth,
    });
    if (data?.insights) setAiInsights(data.insights);
  } catch {
    setAiInsights(["Could not load AI insights. Please try again."]);
  } finally {
    setInsightsLoading(false);
  }
}
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <div style={{ position: "fixed", top: "5%", right: "5%", width: 600, height: 600, background: "radial-gradient(circle,rgba(56,189,248,0.04) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border)", background: "rgba(8,12,20,0.9)", backdropFilter: "blur(20px)", padding: "0 28px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#38bdf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 12px rgba(56,189,248,0.3)" }}>⚡</div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.2rem", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>Tigon<span style={{ color: "var(--accent-cyan)" }}>.</span></span>
        </Link>

        {/* Nav links */}
        <div className="dash-nav-center" style={{ alignItems: "center", gap: 4 }}>
          {[
            { label: "Dashboard", to: "/dashboard", active: true },
            { label: "AI Stocks", to: "/stocks", active: false },
            { label: "Pricing", to: "/subscription", active: false },
          ].map(({ label, to, active }) => (
            <Link key={to} to={to} style={{
              padding: "7px 14px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 500,
              color: active ? "var(--accent-cyan)" : "var(--text-secondary)",
              background: active ? "rgba(56,189,248,0.08)" : "transparent",
              border: active ? "1px solid rgba(56,189,248,0.15)" : "1px solid transparent",
              textDecoration: "none", transition: "color 0.2s, background 0.2s",
            }}>
              {label}
            </Link>
          ))}
        </div>

        <div className="dash-nav-right">
          {/* Month selector */}
          <div className="dash-month-pick" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>Period</span>
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="fintech-input" style={{ width: "auto", padding: "7px 12px", fontSize: "0.875rem" }} />
          </div>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#38bdf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{user.name?.charAt(0).toUpperCase()}</div>
              <span style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>{user.name}</span>
            </div>
          )}
          <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("role"); window.location.href = "/login"; }} className="btn-danger" style={{ padding: "7px 14px", fontSize: "0.8125rem" }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 60px", position: "relative", zIndex: 1 }}>

        {/* Upgrade banner */}
        {role === "free" && (
          <div className="fade-in" style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(56,189,248,0.07))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: "14px 20px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>🚀</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9375rem" }}>Upgrade to Tigon Pro</p>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.8125rem", marginTop: 2 }}>Unlock AI stock insights, market sentiment & advanced analytics</p>
              </div>
            </div>
            <Link to="/subscription" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.875rem", whiteSpace: "nowrap" }}>Upgrade Now →</button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid-3" style={{ gap: 16, marginBottom: 28 }}>
          {[
            { label: "Monthly Income", value: `₹${income.toLocaleString("en-IN")}`, bar: "linear-gradient(90deg,#38bdf8,#6366f1)", icon: "↑", iconBg: "rgba(56,189,248,0.12)", iconColor: "var(--accent-cyan)" },
            { label: "Total Expenses", value: `₹${totalExpense.toLocaleString("en-IN")}`, bar: "linear-gradient(90deg,#f87171,#ef4444)", icon: "↓", iconBg: "rgba(248,113,113,0.12)", iconColor: "var(--accent-red)" },
            { label: "Net Savings", value: `₹${savings.toLocaleString("en-IN")}`, sub: `${savingsRate}% savings rate`, bar: savings >= 0 ? "linear-gradient(90deg,#34d399,#10b981)" : "linear-gradient(90deg,#f87171,#ef4444)", icon: savings >= 0 ? "✓" : "!", iconBg: savings >= 0 ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)", iconColor: savings >= 0 ? "var(--accent-green)" : "var(--accent-red)" },
          ].map(({ label, value, sub, bar, icon, iconBg, iconColor }) => (
            <div key={label} className="fintech-card fade-in" style={{ padding: "24px 24px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, fontSize: "0.875rem", fontWeight: 700 }}>{icon}</div>
              </div>
              <div style={{ fontFamily: "Syne", fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: sub ? 4 : 0 }}>{value}</div>
              {sub && <div style={{ fontSize: "0.8125rem", color: "var(--accent-green)", fontWeight: 500 }}>{sub}</div>}
              <div style={{ marginTop: 14, height: 3, borderRadius: 2, background: bar, opacity: 0.7 }} />
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
          <IncomeInput income={income} setIncome={setIncome} onSave={saveIncome} />
          <ExpenseForm expenseAmount={expenseAmount} setExpenseAmount={setExpenseAmount} expenseCategory={expenseCategory} setExpenseCategory={setExpenseCategory} onAdd={addExpenses} amountError={amountError} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 20 }}>
          <ExpenseList expenses={safeExpenses} editingId={editingId} setEditingId={setEditingId} editAmount={editAmount} setEditAmount={setEditAmount} editCategory={editCategory} setEditCategory={setEditCategory} onSaveEdit={saveEditExpense} onDelete={deleteExpense} editAmountError={editAmountError} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ExpenseChart chartData={chartData} />
            <InsightsPanel insights={insights} />
          </div>
        </div>

        {/* AI Stocks CTA */}
        {isPro && (
          <div style={{ background: "linear-gradient(135deg,rgba(56,189,248,0.07),rgba(99,102,241,0.07))", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(56,189,248,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
              <div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", margin: "0 0 4px" }}>AI Stock Scoring</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.84375rem", margin: 0 }}>Analyse Indian stocks with our proprietary AI scoring engine</p>
              </div>
            </div>
            <Link to="/stocks" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "10px 22px", whiteSpace: "nowrap" }}>Open Stock Analyser →</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;