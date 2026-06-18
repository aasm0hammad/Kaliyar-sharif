const db = require('./db');

async function createSettingsTable() {
  try {
    const connection = await db.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value TEXT
      );
    `);
    
    // Insert default WhatsApp number if not exists
    await connection.query(`
      INSERT IGNORE INTO app_settings (setting_key, setting_value)
      VALUES ('mart_whatsapp_number', '917248187225')
    `);

    console.log('Settings table created and populated');
    connection.release();
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

createSettingsTable();
