const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    // Create DB if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS kaliyar_db;');
    
    // Switch to the db for running the full schema
    await connection.query('USE kaliyar_db;');

    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    if(fs.existsSync(schemaPath)){
      const schema = fs.readFileSync(schemaPath, 'utf8');
      console.log('Executing schema...');
      await connection.query(schema);
      console.log('Database initialized successfully.');
    }
    
    await connection.end();
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

initDB();
