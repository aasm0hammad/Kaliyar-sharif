const db = require('./db');

async function createMartTable() {
  const connection = await db.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS mart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price INT NOT NULL,
        quantity_info VARCHAR(100) DEFAULT '',
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table mart_items created.');

    const items = [
      ['Chicken Changezi', 'CHICKEN ITEMS', 220, '(Qtr)'],
      ['Chicken Kadai', 'CHICKEN ITEMS', 220, '(Qtr)'],
      ['Chicken Kabab', 'CHICKEN ITEMS', 180, '(Half)'],
      ['Chicken Fry', 'CHICKEN ITEMS', 160, '(Qtr)'],
      ['Butter Chicken', 'CHICKEN ITEMS', 220, '(Qtr)'],
      ['Chicken Biryani', 'CHICKEN ITEMS', 160, '(500gm)'],
      ['Chicken Biryani', 'CHICKEN ITEMS', 320, '(1Kg)'],
      ['Chicken Korma', 'CHICKEN ITEMS', 220, '(Qtr)'],
      ['Chicken Stew', 'CHICKEN ITEMS', 220, '(Qtr)'],
      ['Chicken Rara', 'CHICKEN ITEMS', 220, '(Qtr)'],
      ['Chicken Malai Methi', 'CHICKEN ITEMS', 220, '(Qtr)'],
      ['Chicken Tandoori', 'CHICKEN ITEMS', 200, '(Qtr)'],
      ['Chicken Afghani', 'CHICKEN ITEMS', 220, '(Qtr)'],

      ['Korma Half', 'NON - VEG', 140, ''],
      ['Nihari Half', 'NON - VEG', 160, ''],
      ['Stew Half', 'NON - VEG', 190, ''],
      ['Keema Half', 'NON - VEG', 160, ''],
      ['Paya Half', 'NON - VEG', 160, ''],
      ['Haleem Biryani Half', 'NON - VEG', 160, ''],
      ['Kabab Kachori Full', 'NON - VEG', 120, ''],

      ['Matar Paneer', 'VEG ITEMS', 160, ''],
      ['Kadai Paneer', 'VEG ITEMS', 170, ''],
      ['Dal Fry', 'VEG ITEMS', 110, ''],
      ['Aloo Matar', 'VEG ITEMS', 110, ''],
      ['Mix Veg', 'VEG ITEMS', 160, ''],
      ['Shahi Paneer', 'VEG ITEMS', 160, ''],
      ['Dal Makhani', 'VEG ITEMS', 130, ''],

      ['Jeera Rice Full', 'RICE', 110, ''],
      ['Simple Rice Full', 'RICE', 90, ''],
      ['Veg Biryani Full', 'RICE', 160, ''],

      ['Tawa Roti (1 Pc)', 'ROTI', 10, ''],
      ['Tandoori Naan (1 Pc)', 'ROTI', 12, ''],

      ['Aloo Paratha', 'PARATHA', 60, ''],
      ['Onion Paratha', 'PARATHA', 70, ''],
      ['Paneer Paratha', 'PARATHA', 80, ''],

      ['Aloo Tikki Burger', 'FAST FOOD', 70, ''],
      ['Cheese Burger', 'FAST FOOD', 80, ''],
      ['Cheese Sandwich', 'FAST FOOD', 70, ''],
      ['Egg Roll (2 Egg)', 'FAST FOOD', 60, ''],
      ['Momos Steam (8 Pcs)', 'FAST FOOD', 60, ''],
      ['Momos Fry (8 Pcs)', 'FAST FOOD', 60, ''],

      ['Cheese Pizza', 'PIZZA', 200, ''],
      ['Double Cheese Pizza', 'PIZZA', 230, ''],
      ['Cheese Paneer Pizza', 'PIZZA', 250, ''],
      ['Chicken Cheese Pizza', 'PIZZA', 300, ''],

      ['Tea (1 Cup)', 'DRINKS', 20, ''],
      ['Lassi Cold (1 Glass)', 'DRINKS', 50, ''],
      ['Campa Cola Drink', 'DRINKS', 25, ''],
      ['Campa Orange Drink', 'DRINKS', 25, ''],
      ['Campa Cola Drink (1 Ltr)', 'DRINKS', 45, ''],
      ['Campa Orange Drink (1 Ltr)', 'DRINKS', 45, ''],
      ['Campa Cola Drink (2.25 Ltr)', 'DRINKS', 100, ''],
      ['Campa Orange Drink (2.25 Ltr)', 'DRINKS', 100, ''],
      ['Campa Energy Gold', 'DRINKS', 35, ''],
      ['Campa Energy Neon', 'DRINKS', 35, ''],
      ['Campa Cola Can', 'DRINKS', 35, ''],
      ['Campa Orange Can', 'DRINKS', 35, ''],
      ['Coca Cola Drink', 'DRINKS', 45, ''],
      ['Sting Energy Drink', 'DRINKS', 25, ''],
      ['Frooti Drink (1 Ltr)', 'DRINKS', 55, ''],
      ['Frooti Drink (2 Ltr)', 'DRINKS', 105, ''],
      ['Thums-Up Drink (1 Ltr)', 'DRINKS', 45, ''],
      ['Sprite Drink (1 Ltr)', 'DRINKS', 45, '']
    ];

    // Clear existing
    await connection.query('TRUNCATE TABLE mart_items;');

    for (const item of items) {
      await connection.query(
        'INSERT INTO mart_items (name, category, price, quantity_info) VALUES (?, ?, ?, ?)',
        item
      );
    }
    console.log('Inserted items.');
  } catch (err) {
    console.error(err);
  } finally {
    connection.release();
    process.exit(0);
  }
}

createMartTable();
