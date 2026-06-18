const mysql = require('mysql2/promise');
require('dotenv').config();

const sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false;

const dbName = process.env.DB_NAME || 'kaliyar_db';

// Pehle bina database ke connect karo, phir database banao agar na ho
async function initPool() {
  // Step 1: Bina database ke connect karo
  const tempPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
  });

  try {
    // Step 2: Database create karo agar na ho
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' ready`);
  } catch (err) {
    console.error('❌ Database create error:', err.message);
  } finally {
    await tempPool.end();
  }

  // Step 3: Ab database ke saath pool banao
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Pool ko initialize karo aur export karo
const poolPromise = initPool();

// Proxy banao taaki pool ready hone ka wait kare
const handler = {
  get(target, prop) {
    if (prop === 'then' || prop === 'catch' || prop === 'finally') return undefined;
    return async (...args) => {
      const pool = await poolPromise;
      return pool[prop](...args);
    };
  }
};

module.exports = new Proxy({}, handler);
