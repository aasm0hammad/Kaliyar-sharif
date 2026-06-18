const mysql = require('mysql2/promise');
require('dotenv').config();

// TiDB Cloud (production) SSL required; localhost pe SSL nahi chahiye
const sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kaliyar_db',
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
