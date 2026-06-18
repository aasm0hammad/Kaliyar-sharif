const db = require('./db');

async function addImgUrl() {
  try {
    const connection = await db.getConnection();
    await connection.query('ALTER TABLE mart_items ADD COLUMN img_url VARCHAR(255) DEFAULT NULL;');
    console.log('Successfully added img_url column to mart_items');
    connection.release();
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column img_url already exists.');
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}

addImgUrl();
