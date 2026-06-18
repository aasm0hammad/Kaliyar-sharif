const db = require('./db');

async function alterHotelsGallery() {
  try {
    const connection = await db.getConnection();
    await connection.query(`
      ALTER TABLE hotels 
      ADD COLUMN gallery_images JSON DEFAULT NULL
    `);
    console.log('Added gallery_images to hotels table');
    connection.release();
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column gallery_images already exists.');
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}

alterHotelsGallery();
