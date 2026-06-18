const db = require('./db');

async function createLostFoundTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS lost_found (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        type ENUM('lost', 'found') NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE,
        location VARCHAR(255),
        contact_name VARCHAR(100),
        contact_phone VARCHAR(20),
        image_url VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected', 'resolved') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log("Table created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating table:", error);
    process.exit(1);
  }
}

createLostFoundTable();
