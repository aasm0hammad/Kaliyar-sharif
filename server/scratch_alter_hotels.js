const db = require('./db');

async function alterHotels() {
  try {
    const connection = await db.getConnection();
    await connection.query(`
      ALTER TABLE hotels 
      ADD COLUMN video_url VARCHAR(500) DEFAULT NULL
    `);
    console.log('Added video_url to hotels table');
    connection.release();
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column video_url already exists.');
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}

alterHotels();
