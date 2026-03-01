import { useEffect, useState } from "react";
import IncomeInput from "../components/IncomeInput";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import InsightsPanel from "../components/InsightsPanel";
import { generateInsights } from "../utils/insightsEngine";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import ProDashboard from "../modules/pro/ProDashboard";

function Dashboard() {
  // -------------------- STATE --------------------

  const [selectedMonth, setSelectedMonth] = useState("2026-01");

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

  const role = localStorage.getItem("role");

  // -------------------- FETCH DATA --------------------

  useEffect(() => {
    loadExpenses();
    loadIncome();
    loadProfile();
  }, [selectedMonth]);

  async function loadProfile() {
    const data = await apiGet("/profile");
    if (data) setUser(data);
  }

  async function loadExpenses() {
    try {
      const data = await apiGet(`/expenses?month=${selectedMonth}`);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setExpenses([]);
    }
  }

  async function loadIncome() {
    try {
      const data = await apiGet(`/income?month=${selectedMonth}`);
      setIncome(Number(data?.amount || 0));
    } catch (err) {
      console.error(err);
      setIncome(0);
    }
  }

  // -------------------- EXPENSE ACTIONS --------------------

  async function addExpenses() {
    if (Number(expenseAmount) <= 0) {
      setAmountError(true);
      setTimeout(() => setAmountError(false), 400);
      return;
    }

    try {
      await apiPost("/add-expense", {
        amount: Number(expenseAmount),
        category: expenseCategory,
        month: selectedMonth,
      });

      await loadExpenses();

      setExpenseAmount("");
      setExpenseCategory("");
    } catch (err) {
      console.error(err);
    }
  }

  async function saveEditExpense(id) {
    if (Number(editAmount) <= 0) {
      setEditAmountError(true);
      setTimeout(() => setEditAmountError(false), 400);
      return;
    }

    try {
      await apiPut(`/expenses/${id}`, {
        amount: Number(editAmount),
        category: editCategory,
        month: selectedMonth,
      });

      await loadExpenses();
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteExpense(id) {
    try {
      await apiDelete(`/expenses/${id}?month=${selectedMonth}`);
      await loadExpenses();
    } catch (err) {
      console.error(err);
    }
  }

  async function saveIncome() {
    try {
      await apiPost("/set-income", {
        amount: income,
        month: selectedMonth,
      });
    } catch (err) {
      console.error(err);
    }
  }

  // -------------------- CALCULATIONS --------------------

  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const totalExpense = safeExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const savings = income - totalExpense;

  const categoryTotals = safeExpenses.reduce((acc, exp) => {
    const amt = Number(exp.amount || 0);
    acc[exp.category] = (acc[exp.category] || 0) + amt;
    return acc;
  }, {});

  const insights = generateInsights(categoryTotals);

  const chartData = Object.entries(categoryTotals).map(
    ([name, value]) => ({ name, value })
  );

  // -------------------- UI --------------------

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Personal Finance Dashboard
          </h1>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-600 font-medium">
                Welcome, {user.name}
              </span>
            )}

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "/login";
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MONTH SELECTOR */}
        <div className="mb-6">
          <label className="mr-2 font-medium">
            Select Month:
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* UPGRADE BANNER */}
        {role === "free" && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6">
            Upgrade to Pro to access AI stock insights 🚀
          </div>
        )}

        {/* FINANCE COMPONENTS */}
        <IncomeInput
          income={income}
          setIncome={setIncome}
          onSave={saveIncome}
        />

        <ExpenseForm
          expenseAmount={expenseAmount}
          setExpenseAmount={setExpenseAmount}
          expenseCategory={expenseCategory}
          setExpenseCategory={setExpenseCategory}
          onAdd={addExpenses}
          amountError={amountError}
        />

        <ExpenseList
          expenses={safeExpenses}
          editingId={editingId}
          setEditingId={setEditingId}
          editAmount={editAmount}
          setEditAmount={setEditAmount}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          onSaveEdit={saveEditExpense}
          onDelete={deleteExpense}
          editAmountError={editAmountError}
        />

        <ExpenseChart chartData={chartData} />

        <InsightsPanel insights={insights} />

        <h2 className="text-2xl font-bold text-green-600 mt-6">
          Savings: ₹{savings}
        </h2>

        {/* PRO MODULE */}
        {(role === "pro" || role === "premium") && (
  <ProDashboard
    income={income}
    totalExpenses={totalExpense}
  />
)}

      </div>
    </div>
  );
}

export default Dashboard;
