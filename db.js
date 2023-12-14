const Pool = require("pg").Pool;

const DB_USER = process.env.DB_USER || "";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "";
const DB_PORT = process.env.DB_PORT || "";
const DB_DATABASE = process.env.DB_DATABASE || "";

const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
});

module.exports = pool;
