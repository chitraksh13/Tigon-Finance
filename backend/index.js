require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// -------------------- MIDDLEWARE --------------------
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// -------------------- AUTH MIDDLEWARE --------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// -------------------- AUTH ROUTES --------------------

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GOOGLE OAUTH --------------------

app.get("/auth/google", (req, res) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BACKEND_URL || `http://localhost:${PORT}`}/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${FRONTEND_URL}/login?error=google_cancelled`);
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BACKEND_URL || `http://localhost:${PORT}`}/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.redirect(`${FRONTEND_URL}/login?error=google_token_failed`);
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    const { email, name, id: googleId } = profile;
    if (!email) return res.redirect(`${FRONTEND_URL}/login?error=google_no_email`);
    let user;
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      user = existing.rows[0];
      if (!user.google_id)
        await pool.query("UPDATE users SET google_id = $1 WHERE id = $2", [googleId, user.id]);
    } else {
      const inserted = await pool.query(
        "INSERT INTO users (name, email, google_id, role) VALUES ($1, $2, $3, 'free') RETURNING *",
        [name, email, googleId]
      );
      user = inserted.rows[0];
    }
    const tigonToken = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${tigonToken}`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.redirect(`${FRONTEND_URL}/login?error=google_server_error`);
  }
});

// -------------------- PROFILE --------------------

app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1", [req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- EXPENSE ROUTES --------------------

app.get("/expenses", authenticateToken, async (req, res) => {
  const { month } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM expenses WHERE month = $1 AND user_id = $2 ORDER BY id ASC",
      [month, req.user.userId]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: "Database error" }); }
});

app.post("/add-expense", authenticateToken, async (req, res) => {
  const { amount, category, month } = req.body;
  if (!amount || amount <= 0 || !category || !month)
    return res.status(400).json({ message: "Invalid expense data" });
  try {
    await pool.query(
      "INSERT INTO expenses (amount, category, month, user_id) VALUES ($1, $2, $3, $4)",
      [amount, category, month, req.user.userId]
    );
    res.json({ message: "Expense added successfully" });
  } catch (err) { res.status(500).json({ error: "Database error" }); }
});

app.put("/expenses/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { amount, category } = req.body;
  if (!amount || amount <= 0 || !category)
    return res.status(400).json({ message: "Invalid update data" });
  try {
    await pool.query(
      "UPDATE expenses SET amount = $1, category = $2 WHERE id = $3 AND user_id = $4",
      [amount, category, id, req.user.userId]
    );
    res.json({ message: "Expense updated successfully" });
  } catch (err) { res.status(500).json({ error: "Database error" }); }
});

app.delete("/expenses/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM expenses WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
    res.json({ message: "Expense deleted successfully" });
  } catch (err) { res.status(500).json({ error: "Database error" }); }
});

// -------------------- INCOME ROUTES --------------------

app.get("/income", authenticateToken, async (req, res) => {
  const { month } = req.query;
  try {
    const result = await pool.query(
      "SELECT amount FROM income WHERE month = $1 AND user_id = $2",
      [month, req.user.userId]
    );
    res.json(result.rows.length === 0 ? { amount: 0 } : result.rows[0]);
  } catch (err) { res.status(500).json({ error: "Database error" }); }
});

app.post("/set-income", authenticateToken, async (req, res) => {
  const { amount, month } = req.body;
  if (!amount || !month) return res.status(400).json({ message: "Invalid income data" });
  try {
    await pool.query("DELETE FROM income WHERE month = $1 AND user_id = $2", [month, req.user.userId]);
    await pool.query("INSERT INTO income (amount, month, user_id) VALUES ($1, $2, $3)", [amount, month, req.user.userId]);
    res.json({ message: "Income saved successfully" });
  } catch (err) { res.status(500).json({ error: "Database error" }); }
});

// -------------------- STOCK ROUTE --------------------

async function fetchYahooStock(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "application/json",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const result = data?.chart?.result?.[0];
  if (!result) return null;
  const meta = result.meta;
  if (!meta?.regularMarketPrice) return null;
  return meta;
}

async function fetchYahooSummary(ticker) {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics%2CfinancialData%2CsummaryDetail`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "application/json",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.quoteSummary?.result?.[0] ?? null;
}

app.get("/stock/:symbol", authenticateToken, async (req, res) => {
  const clean = req.params.symbol.trim().toUpperCase();
  const tickers = [`${clean}.NS`, `${clean}.BO`, clean];
  for (const ticker of tickers) {
    try {
      const meta = await fetchYahooStock(ticker);
      if (!meta) continue;
      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
      const change = parseFloat((price - prevClose).toFixed(2));
      const changePercent = parseFloat(((change / prevClose) * 100).toFixed(4));
      let peRatio = null, roe = null, eps = null, marketCap = null;
      try {
        const summary = await fetchYahooSummary(ticker);
        if (summary) {
          const stats = summary.defaultKeyStatistics ?? {};
          const financial = summary.financialData ?? {};
          const detail = summary.summaryDetail ?? {};
          peRatio = detail.trailingPE?.raw ?? stats.trailingPE?.raw ?? null;
          eps = stats.trailingEps?.raw ?? null;
          marketCap = stats.marketCap?.raw ?? null;
          const rawRoe = financial.returnOnEquity?.raw;
          roe = rawRoe != null ? parseFloat((rawRoe * 100).toFixed(2)) : null;
        }
      } catch (e) {}
      return res.json({
        symbol: ticker, displaySymbol: clean, price, change, changePercent,
        peRatio, roe, eps, marketCap,
        currency: meta.currency ?? "INR",
        exchangeName: meta.exchangeName ?? null,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? null,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? null,
      });
    } catch (err) { continue; }
  }
  return res.status(404).json({ message: `Stock "${clean}" not found.` });
});

// -------------------- RAZORPAY PAYMENT ROUTES --------------------

// Step 1 — Frontend calls this to create a Razorpay order
app.post("/payment/create-order", authenticateToken, async (req, res) => {
  try {
    const AMOUNT_PAISE = 49900; // Rs.499 x 100
    const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: AMOUNT_PAISE,
        currency: "INR",
        receipt: `tigon_pro_${req.user.userId}_${Date.now()}`,
        notes: { userId: String(req.user.userId), plan: "pro" },
      }),
    });

    const order = await response.json();
    if (!response.ok || !order.id) {
      console.error("Razorpay order creation failed:", order);
      return res.status(500).json({ message: "Failed to create payment order. Please try again." });
    }

    console.log(`✅ Razorpay order created: ${order.id} for user ${req.user.userId}`);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: RAZORPAY_KEY_ID });

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error creating payment order." });
  }
});

// Step 2 — Frontend calls this after payment completes to verify + upgrade
app.post("/payment/verify", authenticateToken, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return res.status(400).json({ message: "Missing payment verification fields." });

  try {
    // Verify HMAC-SHA256 signature — Razorpay signs order_id + "|" + payment_id
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn(`Signature mismatch for user ${req.user.userId}`);
      return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
    }

    // Upgrade user to pro
    await pool.query("UPDATE users SET role = 'pro' WHERE id = $1", [req.user.userId]);

    // Log payment
    await pool.query(
      `INSERT INTO payments (user_id, razorpay_order_id, razorpay_payment_id, amount, status)
       VALUES ($1, $2, $3, $4, 'captured')`,
      [req.user.userId, razorpay_order_id, razorpay_payment_id, 49900]
    );

    // Issue fresh JWT with role: pro
    const newToken = jwt.sign(
      { userId: req.user.userId, role: "pro" },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log(`✅ User ${req.user.userId} upgraded to Pro. Payment: ${razorpay_payment_id}`);
    res.json({ message: "Payment verified. Welcome to Tigon Pro!", token: newToken });

  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ message: "Server error during payment verification." });
  }
});

// -------------------- PORTFOLIO ROUTES --------------------

app.post("/portfolio", authenticateToken, async (req, res) => {
  try {
    const { symbol, investedAmount, purchasePrice, quantity } = req.body;
    const result = await pool.query(
      `INSERT INTO portfolio (user_id, symbol, invested_amount, purchase_price, quantity)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.userId, symbol, investedAmount, purchasePrice, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add investment" });
  }
});

app.get("/portfolio", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM portfolio WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

// -------------------- AUTO MIGRATE + START SERVER --------------------
// Creates all tables automatically on first boot — no manual SQL needed.

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) UNIQUE NOT NULL,
      password   VARCHAR(255),
      google_id  VARCHAR(255),
      role       VARCHAR(50) DEFAULT 'free',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id         SERIAL PRIMARY KEY,
      amount     NUMERIC NOT NULL,
      category   VARCHAR(100) NOT NULL,
      month      VARCHAR(20) NOT NULL,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS income (
      id      SERIAL PRIMARY KEY,
      amount  NUMERIC NOT NULL,
      month   VARCHAR(20) NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS portfolio (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      symbol          VARCHAR(20) NOT NULL,
      invested_amount NUMERIC,
      purchase_price  NUMERIC,
      quantity        NUMERIC,
      created_at      TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payments (
      id                   SERIAL PRIMARY KEY,
      user_id              INTEGER REFERENCES users(id) ON DELETE CASCADE,
      razorpay_order_id    VARCHAR(255),
      razorpay_payment_id  VARCHAR(255),
      amount               INTEGER,
      status               VARCHAR(50),
      created_at           TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("✅ Database tables ready");
}

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Tigon backend running on port ${PORT}`);
      console.log(`📈 Stock data: Yahoo Finance direct API`);
      console.log(`🔐 Google OAuth: ${GOOGLE_CLIENT_ID ? "configured" : "⚠️  GOOGLE_CLIENT_ID missing"}`);
      console.log(`💳 Razorpay: ${RAZORPAY_KEY_ID ? "configured" : "⚠️  RAZORPAY_KEY_ID missing"}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialise database:", err.message);
    process.exit(1);
  });