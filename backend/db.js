const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tigon_finance",
  password: "tony13080911",
  port: 5432,
});

module.exports = pool;
