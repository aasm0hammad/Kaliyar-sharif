const db = require('./db');

async function alterUsersTable() {
  try {
    console.log("Altering users table for address fields...");
    await db.query("ALTER TABLE users ADD COLUMN state VARCHAR(100) DEFAULT NULL");
    await db.query("ALTER TABLE users ADD COLUMN district VARCHAR(100) DEFAULT NULL");
    await db.query("ALTER TABLE users ADD COLUMN city VARCHAR(100) DEFAULT NULL");
    await db.query("ALTER TABLE users ADD COLUMN pincode VARCHAR(20) DEFAULT NULL");
    console.log("Successfully added state, district, city, and pincode columns to users table.");
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Columns already exist.");
      process.exit(0);
    }
    console.error("Error altering table:", error);
    process.exit(1);
  }
}

alterUsersTable();
