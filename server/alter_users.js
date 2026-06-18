const db = require('./db');

async function alterUsersTable() {
  try {
    console.log("Altering users table...");
    await db.query("ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL");
    await db.query("ALTER TABLE users ADD COLUMN dob DATE DEFAULT NULL");
    await db.query("ALTER TABLE users ADD COLUMN gender VARCHAR(10) DEFAULT NULL");
    await db.query("ALTER TABLE users ADD COLUMN address TEXT DEFAULT NULL");
    console.log("Successfully added phone, dob, gender, and address columns to users table.");
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
