require("dotenv").config();
console.log("ALPHA KEY:", process.env.ALPHA_VANTAGE_API_KEY);
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db"); // Make sure db.js exports pool

const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.JWT_SECRET;

// -------------------- MIDDLEWARE --------------------

app.use(cors());
app.use(express.json());

// -------------------- AUTH MIDDLEWARE --------------------

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}
function authorizeRole(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

// -------------------- AUTH ROUTES --------------------

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email already exists or DB error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
  { 
    userId: user.id,
    role: user.role
  },
  SECRET_KEY,
  { expiresIn: "1h" }
);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- EXPENSE ROUTES --------------------

// GET Expenses
app.get("/expenses", authenticateToken, async (req, res) => {
  const { month } = req.query;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM expenses WHERE month = $1 AND user_id = $2 ORDER BY id ASC",
      [month, userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ADD Expense
app.post("/add-expense", authenticateToken, async (req, res) => {
  const { amount, category, month } = req.body;
  const userId = req.user.userId;

  if (!amount || amount <= 0 || !category || !month) {
    return res.status(400).json({ message: "Invalid expense data" });
  }

  try {
    await pool.query(
      "INSERT INTO expenses (amount, category, month, user_id) VALUES ($1, $2, $3, $4)",
      [amount, category, month, userId]
    );

    res.json({ message: "Expense added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE Expense
app.put("/expenses/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { amount, category } = req.body;
  const userId = req.user.userId;

  if (!amount || amount <= 0 || !category) {
    return res.status(400).json({ message: "Invalid update data" });
  }

  try {
    await pool.query(
      "UPDATE expenses SET amount = $1, category = $2 WHERE id = $3 AND user_id = $4",
      [amount, category, id, userId]
    );

    res.json({ message: "Expense updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE Expense
app.delete("/expenses/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    await pool.query(
      "DELETE FROM expenses WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// -------------------- INCOME ROUTES --------------------

// GET Income
app.get("/income", authenticateToken, async (req, res) => {
  const { month } = req.query;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "SELECT amount FROM income WHERE month = $1 AND user_id = $2",
      [month, userId]
    );

    if (result.rows.length === 0) {
      return res.json({ amount: 0 });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// SET Income
app.post("/set-income", authenticateToken, async (req, res) => {
  const { amount, month } = req.body;
  const userId = req.user.userId;

  if (!amount || !month) {
    return res.status(400).json({ message: "Invalid income data" });
  }

  try {
    await pool.query(
      "DELETE FROM income WHERE month = $1 AND user_id = $2",
      [month, userId]
    );

    await pool.query(
      "INSERT INTO income (amount, month, user_id) VALUES ($1, $2, $3)",
      [amount, month, userId]
    );

    res.json({ message: "Income saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// -------------------- START SERVER --------------------
app.get("/profile", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    res.json(result.rows[0]);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/stock/:symbol", authenticateToken, async (req, res) => {
  const { symbol } = req.params;

  try {
    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

    const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}.BSE&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

    console.log("Calling quote:", quoteUrl);
    console.log("Calling overview:", overviewUrl);

    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();

    const overviewResponse = await fetch(overviewUrl);
    const overviewData = await overviewResponse.json();
   // Detect AlphaVantage rate limit
   let peRatio = null;
let roe = null;
let eps = null;
let marketCap = null;

if (!overviewData.Information && !overviewData.Note) {
  peRatio = overviewData.PERatio
    ? Number(overviewData.PERatio)
    : null;

  roe = overviewData.ReturnOnEquityTTM
    ? Number(overviewData.ReturnOnEquityTTM)
    : null;

  eps = overviewData.EPS
    ? Number(overviewData.EPS)
    : null;

  marketCap = overviewData.MarketCapitalization
    ? Number(overviewData.MarketCapitalization)
    : null;
}
    console.log("Overview Data:", overviewData); // ✅ Now inside try

    if (!quoteData["Global Quote"]) {
      return res.status(400).json({
        message: "Invalid symbol or API limit reached",
      });
    }

    const quote = quoteData["Global Quote"];

res.json({
  symbol: quote["01. symbol"],
  price: Number(quote["05. price"]),
  changePercent: quote["10. change percent"],
  peRatio,
  roe,
  eps,
  marketCap,
});

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Stock API error",
    });
  }
});

app.post("/portfolio", authenticateToken, async (req, res) => {
  try {
    const { symbol, investedAmount, purchasePrice, quantity } = req.body;

    const result = await pool.query(
      `INSERT INTO portfolio 
       (user_id, symbol, invested_amount, purchase_price, quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, symbol, investedAmount, purchasePrice, quantity]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add investment" });
  }
});

app.get("/portfolio", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM portfolio WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});