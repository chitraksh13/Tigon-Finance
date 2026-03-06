const { Pool } = require("pg");

// Locally: uses individual fields from .env
// On Railway: uses DATABASE_URL (auto-provided by Railway Postgres)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER || "postgres",
      host: process.env.DB_HOST || "localhost",
      database: process.env.DB_NAME || "tigon_finance",
      password: process.env.DB_PASSWORD || "tony13080911",
      port: process.env.DB_PORT || 5432,
    });

module.exports = pool;