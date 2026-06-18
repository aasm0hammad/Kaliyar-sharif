const db = require('./db');

async function addVerificationColumns() {
  try {
    console.log("Adding verification columns to users table...");
    await db.query("ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 0");
    await db.query("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) DEFAULT NULL");
    console.log("Successfully added is_verified and verification_token.");
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

addVerificationColumns();
