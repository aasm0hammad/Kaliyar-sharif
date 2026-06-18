const db = require('./db');

async function seed() {
  try {
    console.log('Seeding database...');
    
    // Clear existing data to avoid duplicates
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE news");
    await db.query("TRUNCATE TABLE hotels");
    await db.query("TRUNCATE TABLE businesses");
    await db.query("TRUNCATE TABLE parking");
    await db.query("TRUNCATE TABLE transport");
    await db.query("TRUNCATE TABLE ziyarat_places");
    await db.query("TRUNCATE TABLE food_services");
    await db.query("TRUNCATE TABLE urs_schedule");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");

    // Seed News
    await db.query(`INSERT INTO news (title_en, content_en, type, date_posted) VALUES 
      ('Urs 2024 Dates Announced', 'The official dates for this year''s Urs Mubarak have been released by the Dargah committee. The main event will fall on the 13th of Rabi al-Awwal.', 'Announcement', '2024-10-15'),
      ('New Parking Area Opened', 'A new massive parking lot for buses and cars has been inaugurated near the main canal to handle the festive rush.', 'News', '2024-10-10'),
      ('Route Diversion on Friday', 'Due to heavy crowds, the main approach road from Roorkee will be one-way this Friday.', 'Update', '2024-10-08')
    `);

    // Seed Hotels
    await db.query(`INSERT INTO hotels (name, category, price, rating, reviews, distance, phone, amenities, featured, img_url) VALUES 
      ('Hotel Noor Palace', 'family', 1200, 4.3, 120, '500m', '+91 9876543210', '["AC", "WiFi", "Family Room"]', true, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'),
      ('Jannat Guest House', 'guesthouse', 800, 4.1, 98, '300m', '+91 9876543211', '["Non-AC", "Attached Bath"]', false, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'),
      ('Sabiri Dargah Musafirkhana', 'dargah', 100, 4.5, 210, '50m', '+91 9876543213', '["Dormitory", "Langar Facility"]', true, 'https://images.unsplash.com/photo-1551882547-ff40c0d13969?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80')
    `);

    // Seed Businesses
    await db.query(`INSERT INTO businesses (name, category, description, phone, whatsapp, logo_url, address, rating, reviews_count, premium) VALUES 
      ('Haji Attar Wale', 'attar', 'Pure non-alcoholic attars and perfumes imported from Dubai.', '+91 9876543210', '919876543210', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80', 'Shop 12, Main Bazar Road, Kaliyar Sharif', 4.8, 142, true),
      ('Madina Chadar Palace', 'chadar', 'Beautifully crafted Chadars and floral offerings for Dargah Sharif.', '+91 9876543211', '919876543211', 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?auto=format&fit=crop&w=600&q=80', 'Opposite Buland Darwaza, Kaliyar Sharif', 4.6, 89, true),
      ('Kaliyar Travels', 'transport', 'Reliable local and outstation taxi bookings, tour guides, and 24/7 travel services.', '+91 9876543212', '919876543212', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80', 'Near Bus Stand, Kaliyar Sharif', 4.2, 53, false),
      ('Sabri Mughlai Restaurant', 'restaurant', 'Authentic Mughlai dishes, Biryani, and traditional local cuisine.', '+91 9876543214', '919876543214', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', 'Dargah Chowk, Kaliyar Sharif', 4.5, 178, true)
    `);

    // Seed Parking
    await db.query(`INSERT INTO parking (name, type, capacity, available_slots, rate, distance) VALUES
      ('Main Dargah Parking', 'car', 200, 45, 50, '100m'),
      ('Bus Stand Parking', 'bus', 50, 12, 200, '800m'),
      ('Canal Road Parking', 'bike', 500, 320, 20, '300m')
    `);

    // Seed Transport
    await db.query(`INSERT INTO transport (route, distance, fare_min, fare_max, type) VALUES
      ('Roorkee Railway Station → Kaliyar', '25 km', 50, 100, 'auto'),
      ('Haridwar → Kaliyar', '45 km', 80, 150, 'bus'),
      ('Delhi → Kaliyar', '220 km', 600, 1200, 'taxi')
    `);

    // Seed Ziyarat Places
    await db.query(`INSERT INTO ziyarat_places (
      name_en, name_hi, name_ur, type, desc_en, desc_hi, desc_ur, img_url, timings, opening_time, closing_time, fajr_time, dhuhr_time, asr_time, maghrib_time, isha_time, lat, lng
    ) VALUES
      (
        'Main Dargah - Sabir Piya', 
        'मुख्य दरगाह - साबिर पिया', 
        'مرکزی درگاہ - صابر پیا', 
        'dargah', 
        'The holy shrine of Hazrat Makhdoom Alauddin Ali Ahmed Sabir Kalyari.', 
        'हज़रत मखदूम अलाउद्दीन अली अहमद साबिर कलियरी की पवित्र दरगाह।', 
        'حضرت مخدوم علاؤ الدین علی احمد صابر کلیری کا مقدس مزار۔', 
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80', 
        '24 Hours', '04:00 AM', '11:30 PM', '05:00 AM', '01:30 PM', '05:45 PM', '07:25 PM', '09:00 PM', 
        29.9324, 77.9322
      ),
      (
        'Imam Sahab Mazar', 
        'इमाम साहब मज़ार', 
        'امام صاحب مزار', 
        'mazaraat', 
        'Mazar of the Imam who served during Sabir Piya''s time.', 
        'इमाम साहब का मज़ार जिन्होंने साबिर पिया के समय सेवा की थी।', 
        'امام صاحب کا مزار جنہوں نے صابر پیا کے وقت خدمت کی تھی۔', 
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', 
        '6:00 AM - 10:00 PM', '06:00 AM', '10:00 PM', '05:15 AM', '01:30 PM', '05:30 PM', '07:20 PM', '08:45 PM', 
        29.9310, 77.9315
      ),
      (
        'Main Qawwali Courtyard', 
        'मुख्य कव्वाली प्रांगण', 
        'مرکزی قوالی صحن', 
        'qawwali', 
        'The central courtyard where renowned Qawwals perform daily.', 
        'केंद्रीय प्रांगण जहां प्रसिद्ध कव्वाल प्रतिदिन प्रस्तुति देते हैं।', 
        'مرکزی صحن جہاں مشہور قوال روزانہ پرفارم کرتے ہیں۔', 
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', 
        '8:00 PM - 2:00 AM', '08:00 PM', '02:00 AM', NULL, NULL, NULL, NULL, NULL, 
        29.9320, 77.9325
      ),
      (
        'Sabiri Langar Khana', 
        'साबिरी लंगर खाना', 
        'صابری لنگر خانہ', 
        'langar', 
        'Free food distribution center operating daily for all visitors.', 
        'सभी आगंतुकों के लिए दैनिक रूप से संचालित होने वाला मुफ्त भोजन वितरण केंद्र।', 
        'مفت کھانا تقسیم کرنے کا مرکز جو تمام زائرین کے لیے روزانہ کام کرتا ہے۔', 
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80', 
        '12:00 PM & 8:00 PM', '11:00 AM', '09:00 PM', NULL, NULL, NULL, NULL, NULL, 
        29.9335, 77.9330
      ),
      (
        'Main Wuzu Khana', 
        'मुख्य वज़ू खाना', 
        'مرکزی وضو خانہ', 
        'wuzu', 
        'Ablution area with fresh running water.', 
        'ताजे बहते पानी के साथ वज़ू करने का स्थान।', 
        'تازہ بہتے پانی کے ساتھ وضو کا علاقہ۔', 
        'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?auto=format&fit=crop&w=600&q=80', 
        '24 Hours', '12:00 AM', '12:00 AM', NULL, NULL, NULL, NULL, NULL, 
        29.9328, 77.9318
      )
    `);

    // Seed Food & Services
    await db.query(`INSERT INTO food_services (name, category, rating, distance, phone) VALUES
      ('Al Madina Restaurant', 'restaurant', 4.5, '100m', '+91 9876543220'),
      ('Sabri Tea Stall', 'tea', 4.2, '50m', '+91 9876543221'),
      ('Dargah Medical Store', 'medical', 4.0, '200m', '+91 9876543222'),
      ('SBI ATM', 'atm', 3.8, '150m', '')
    `);

    // Seed Urs Schedule
    await db.query(`INSERT INTO urs_schedule (event_name, event_date, event_time, location, description) VALUES
      ('Ghusl Sharif (Bathing of the Shrine)', '2024-09-15', '10:00 AM', 'Inside Main Dargah', 'The ritual bathing of the holy tomb of Sabir Pak.'),
      ('Mehfil-e-Sama (Grand Qawwali)', '2024-09-24', '09:00 PM', 'Dargah Courtyard', 'Renowned Sufi singers perform traditional Qawwali.'),
      ('Qul Sharif (Grand Conclusion)', '2024-09-27', '04:00 PM', 'Main Assembly', 'Final prayers and distribution of special tabarruk.')
    `);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
