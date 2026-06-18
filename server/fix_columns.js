const db = require('./db');

async function addCol(query) {
  try {
    await db.query(query);
    console.log("Success: ", query);
  } catch (e) {
    console.log("Ignored error for: ", query, e.code);
  }
}

async function run() {
  await addCol("ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL");
  await addCol("ALTER TABLE users ADD COLUMN dob DATE DEFAULT NULL");
  await addCol("ALTER TABLE users ADD COLUMN gender VARCHAR(10) DEFAULT NULL");
  await addCol("ALTER TABLE users ADD COLUMN address TEXT DEFAULT NULL");
  process.exit(0);
}

run();
