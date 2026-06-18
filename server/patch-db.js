const db = require('./db');

async function patch() {
  try {
    console.log('Running database patch for food_services table...');
    
    // Add address column if not exists
    await db.query(`
      ALTER TABLE food_services 
      ADD COLUMN IF NOT EXISTS address TEXT
    `);
    
    // Add img_url column if not exists
    await db.query(`
      ALTER TABLE food_services 
      ADD COLUMN IF NOT EXISTS img_url VARCHAR(255)
    `);

    console.log('Database patch applied successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database patch failed:', error);
    process.exit(1);
  }
}

patch();
