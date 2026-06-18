const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { sendVerificationEmail } = require('./mailer');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, webp, gif) are allowed!'));
  }
});

// Serve uploads statically under /api/uploads
router.use('/uploads', express.static(uploadDir));

// File Upload Route
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Please select an image file to upload.' });
    }
    const fileUrl = `/api/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  });
});

// --- FRONTEND GET ROUTES ---

router.get('/food', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM food_services");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/food', async (req, res) => {
  const { name, category, rating, distance, phone, address, img_url } = req.body;
  try {
    await db.query(
      "INSERT INTO food_services (name, category, rating, distance, phone, address, img_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, category, rating || 0.0, distance || null, phone || null, address || null, img_url || null]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/food/:id', async (req, res) => {
  const { name, category, rating, distance, phone, address, img_url } = req.body;
  try {
    await db.query(
      "UPDATE food_services SET name=?, category=?, rating=?, distance=?, phone=?, address=?, img_url=? WHERE id=?",
      [name, category, rating || 0.0, distance || null, phone || null, address || null, img_url || null, req.params.id]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/food/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM food_services WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/emergency', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM emergency_contacts");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- HERO SLIDES ---

// Public: Get active slides only (for frontend)
router.get('/hero-slides', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sequence_order ASC, id ASC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Get ALL slides (including inactive) — must be before :id
router.get('/hero-slides/all', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hero_slides ORDER BY sequence_order ASC, id ASC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Reorder slides — must be before :id
router.put('/hero-slides/reorder', async (req, res) => {
  const { orderedIds } = req.body;
  if (!orderedIds || !Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array is required' });
  }
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.query('UPDATE hero_slides SET sequence_order=? WHERE id=?', [i + 1, orderedIds[i]]);
    }
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Add new slide
router.post('/hero-slides', async (req, res) => {
  const { img_url, title_en, title_hi, title_ur, subtitle_en, subtitle_hi, subtitle_ur } = req.body;
  try {
    const [[maxRow]] = await db.query('SELECT COALESCE(MAX(sequence_order),0) as maxSeq FROM hero_slides');
    const nextSeq = (maxRow?.maxSeq || 0) + 1;
    await db.query(
      `INSERT INTO hero_slides (img_url, title_en, title_hi, title_ur, subtitle_en, subtitle_hi, subtitle_ur, sequence_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [img_url, title_en || null, title_hi || null, title_ur || null, subtitle_en || null, subtitle_hi || null, subtitle_ur || null, nextSeq]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Toggle active/inactive — must be before generic :id
router.put('/hero-slides/:id/toggle', async (req, res) => {
  const { is_active } = req.body;
  try {
    await db.query('UPDATE hero_slides SET is_active=? WHERE id=?', [is_active ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Update slide
router.put('/hero-slides/:id', async (req, res) => {
  const { img_url, title_en, title_hi, title_ur, subtitle_en, subtitle_hi, subtitle_ur } = req.body;
  try {
    await db.query(
      `UPDATE hero_slides SET img_url=?, title_en=?, title_hi=?, title_ur=?, subtitle_en=?, subtitle_hi=?, subtitle_ur=? WHERE id=?`,
      [img_url, title_en || null, title_hi || null, title_ur || null, subtitle_en || null, subtitle_hi || null, subtitle_ur || null, req.params.id]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Delete slide
router.delete('/hero-slides/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM hero_slides WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/ziyarat', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ziyarat_places ORDER BY sequence_order ASC, id ASC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Reorder ziyarat sequence
router.put('/ziyarat/reorder', async (req, res) => {
  const { orderedIds } = req.body; // array of IDs in new order
  if (!orderedIds || !Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array is required' });
  }
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.query('UPDATE ziyarat_places SET sequence_order=? WHERE id=?', [i + 1, orderedIds[i]]);
    }
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Toggle show_on_route for a ziyarat place
router.put('/ziyarat/:id/toggle-route', async (req, res) => {
  const { show_on_route } = req.body;
  try {
    await db.query('UPDATE ziyarat_places SET show_on_route=? WHERE id=?', [show_on_route ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/urs', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM urs_schedule ORDER BY event_date ASC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- ADMIN CRUD ROUTES (Examples for Hotels, Parking, etc.) ---

// Hotels
router.get('/hotels', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hotels ORDER BY id DESC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/hotels/:id', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hotels WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Hotel not found' });
    res.json(rows[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/hotels', async (req, res) => {
  const { name, category, price, rating, reviews, distance, img_url, video_url, gallery_images, phone, amenities, featured } = req.body;
  try {
    await db.query(
      "INSERT INTO hotels (name, category, price, rating, reviews, distance, img_url, video_url, gallery_images, phone, amenities, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, category, price, rating || 0, reviews || 0, distance, img_url || null, video_url || null, JSON.stringify(gallery_images || []), phone, JSON.stringify(amenities || []), featured ? 1 : 0]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/hotels/:id', async (req, res) => {
  const { name, category, price, rating, reviews, distance, img_url, video_url, gallery_images, phone, amenities, featured } = req.body;
  try {
    await db.query(
      "UPDATE hotels SET name=?, category=?, price=?, rating=?, reviews=?, distance=?, img_url=?, video_url=?, gallery_images=?, phone=?, amenities=?, featured=? WHERE id=?", 
      [name, category, price, rating || 0, reviews || 0, distance, img_url || null, video_url || null, JSON.stringify(gallery_images || []), phone, JSON.stringify(amenities || []), featured ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/hotels/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM hotels WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Parking
router.post('/parking', async (req, res) => {
  const { name, type, capacity, rate, distance } = req.body;
  try {
    await db.query("INSERT INTO parking (name, type, capacity, available_slots, rate, distance) VALUES (?, ?, ?, ?, ?, ?)", [name, type, capacity, capacity, rate, distance]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/parking/:id', async (req, res) => {
  const { available_slots, capacity, rate } = req.body;
  try {
    await db.query("UPDATE parking SET available_slots=?, capacity=?, rate=? WHERE id=?", [available_slots, capacity, rate, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/parking/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM parking WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Transport CRUD
router.post('/transport', async (req, res) => {
  const { route, distance, fare_min, fare_max, type } = req.body;
  try {
    await db.query("INSERT INTO transport (route, distance, fare_min, fare_max, type) VALUES (?, ?, ?, ?, ?)", [route, distance, fare_min, fare_max, type]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/transport/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM transport WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// News
router.post('/news', async (req, res) => {
  const { title_en, content_en, type, date_posted } = req.body;
  try {
    await db.query("INSERT INTO news (title_en, content_en, type, date_posted) VALUES (?, ?, ?, ?)", [title_en, content_en, type, date_posted]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/news/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM news WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Businesses CRUD
router.get('/businesses', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM businesses");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/businesses', async (req, res) => {
  const { name, category, description, phone, whatsapp, logo_url, address, rating, reviews_count, premium } = req.body;
  try {
    await db.query(
      "INSERT INTO businesses (name, category, description, phone, whatsapp, logo_url, address, rating, reviews_count, premium) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
      [
        name, category, description || null, phone || null, whatsapp || null, logo_url || null, address || null, 
        rating ? parseFloat(rating) : 0.0, reviews_count ? parseInt(reviews_count) : 0, premium ? 1 : 0
      ]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/businesses/:id', async (req, res) => {
  const { name, category, description, phone, whatsapp, logo_url, address, rating, reviews_count, premium } = req.body;
  try {
    await db.query(
      "UPDATE businesses SET name=?, category=?, description=?, phone=?, whatsapp=?, logo_url=?, address=?, rating=?, reviews_count=?, premium=? WHERE id=?", 
      [
        name, category, description || null, phone || null, whatsapp || null, logo_url || null, address || null, 
        rating ? parseFloat(rating) : 0.0, reviews_count ? parseInt(reviews_count) : 0, premium ? 1 : 0, req.params.id
      ]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/businesses/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM businesses WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Ziyarat CRUD
router.post('/ziyarat', async (req, res) => {
  const { 
    name_en, name_hi, name_ur, type, desc_en, desc_hi, desc_ur, img_url, timings,
    opening_time, closing_time, fajr_time, dhuhr_time, asr_time, maghrib_time, isha_time, lat, lng 
  } = req.body;
  try {
    // Get max sequence_order to append at end
    const [[maxRow]] = await db.query('SELECT COALESCE(MAX(sequence_order),0) as maxSeq FROM ziyarat_places');
    const nextSeq = (maxRow?.maxSeq || 0) + 1;
    await db.query(
      `INSERT INTO ziyarat_places (
        name_en, name_hi, name_ur, type, desc_en, desc_hi, desc_ur, img_url, timings,
        opening_time, closing_time, fajr_time, dhuhr_time, asr_time, maghrib_time, isha_time, lat, lng, sequence_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [
        name_en, name_hi || null, name_ur || null, type, desc_en || null, desc_hi || null, desc_ur || null, img_url || null, timings || '24 Hours',
        opening_time || null, closing_time || null, fajr_time || null, dhuhr_time || null, asr_time || null, maghrib_time || null, isha_time || null,
        lat ? parseFloat(lat) : null, lng ? parseFloat(lng) : null, nextSeq
      ]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/ziyarat/:id', async (req, res) => {
  const { 
    name_en, name_hi, name_ur, type, desc_en, desc_hi, desc_ur, img_url, timings,
    opening_time, closing_time, fajr_time, dhuhr_time, asr_time, maghrib_time, isha_time, lat, lng 
  } = req.body;
  try {
    await db.query(
      `UPDATE ziyarat_places SET 
        name_en=?, name_hi=?, name_ur=?, type=?, desc_en=?, desc_hi=?, desc_ur=?, img_url=?, timings=?,
        opening_time=?, closing_time=?, fajr_time=?, dhuhr_time=?, asr_time=?, maghrib_time=?, isha_time=?, lat=?, lng=?
       WHERE id=?`, 
      [
        name_en, name_hi || null, name_ur || null, type, desc_en || null, desc_hi || null, desc_ur || null, img_url || null, timings || '24 Hours',
        opening_time || null, closing_time || null, fajr_time || null, dhuhr_time || null, asr_time || null, maghrib_time || null, isha_time || null,
        lat ? parseFloat(lat) : null, lng ? parseFloat(lng) : null, req.params.id
      ]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/ziyarat/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM ziyarat_places WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// User Registration
router.post('/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    await db.query(
      "INSERT INTO users (name, email, password, verification_token, is_verified) VALUES (?, ?, ?, ?, ?)", 
      [name, email, hashedPassword, verificationToken, 0]
    );
    
    // Send email
    sendVerificationEmail(email, verificationToken);

    res.status(201).json({ success: true, message: 'Registration successful! Please check your email to verify your account.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Email Verification
router.post('/users/verify-email', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });
  try {
    const [users] = await db.query("SELECT id FROM users WHERE verification_token = ?", [token]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    await db.query("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?", [users[0].id]);
    res.json({ success: true, message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in. Check your inbox.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone || '', is_verified: user.is_verified } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Donations
router.post('/donations', async (req, res) => {
  const { userId, amount, type, transactionId } = req.body;
  try {
    await db.query("INSERT INTO donations (user_id, amount, type, transaction_id, status) VALUES (?, ?, ?, ?, 'completed')", [userId || null, amount, type, transactionId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/donations', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM donations ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, phone, state, district, city, created_at FROM users ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Profile Fetch & Update
router.get('/users/:userId/profile', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, phone, dob, gender, address, state, district, city, pincode, created_at FROM users WHERE id = ?", [req.params.userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:userId/profile', async (req, res) => {
  const { name, phone, dob, gender, address, state, district, city, pincode, password } = req.body;
  
  // Convert empty strings to null for strict MySQL columns (especially DATE)
  const cleanDob = dob && dob.trim() !== '' ? dob : null;
  const cleanPhone = phone && phone.trim() !== '' ? phone : null;
  const cleanGender = gender && gender.trim() !== '' ? gender : null;
  const cleanAddress = address && address.trim() !== '' ? address : null;
  const cleanState = state && state.trim() !== '' ? state : null;
  const cleanDistrict = district && district.trim() !== '' ? district : null;
  const cleanCity = city && city.trim() !== '' ? city : null;
  const cleanPincode = pincode && pincode.trim() !== '' ? pincode : null;

  try {
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        "UPDATE users SET name=?, phone=?, dob=?, gender=?, address=?, state=?, district=?, city=?, pincode=?, password=? WHERE id=?", 
        [name, cleanPhone, cleanDob, cleanGender, cleanAddress, cleanState, cleanDistrict, cleanCity, cleanPincode, hashedPassword, req.params.userId]
      );
    } else {
      await db.query(
        "UPDATE users SET name=?, phone=?, dob=?, gender=?, address=?, state=?, district=?, city=?, pincode=? WHERE id=?", 
        [name, cleanPhone, cleanDob, cleanGender, cleanAddress, cleanState, cleanDistrict, cleanCity, cleanPincode, req.params.userId]
      );
    }
    
    // Fetch updated user to return
    const [rows] = await db.query("SELECT id, name, email, phone, dob, gender, address, state, district, city, pincode FROM users WHERE id = ?", [req.params.userId]);
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Saved Places
router.get('/users/:userId/saved-places', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM saved_places WHERE user_id = ?", [userId]);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/users/:userId/saved-places', async (req, res) => {
  const { userId } = req.params;
  const { place_type, place_id } = req.body;
  try {
    // Check if already saved
    const [existing] = await db.query("SELECT * FROM saved_places WHERE user_id = ? AND place_type = ? AND place_id = ?", [userId, place_type, place_id]);
    if (existing.length > 0) {
      return res.json({ success: true, message: 'Already saved' });
    }
    await db.query("INSERT INTO saved_places (user_id, place_type, place_id) VALUES (?, ?, ?)", [userId, place_type, place_id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/users/:userId/saved-places', async (req, res) => {
  const { userId } = req.params;
  const { place_type, place_id } = req.body;
  try {
    await db.query("DELETE FROM saved_places WHERE user_id = ? AND place_type = ? AND place_id = ?", [userId, place_type, place_id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- LOST & FOUND ---

// Public: Get all approved items
router.get('/lost-found', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM lost_found WHERE status = 'approved' ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// User: Submit a new item
router.post('/lost-found', async (req, res) => {
  const { user_id, type, item_name, description, date, location, contact_name, contact_phone, image_url } = req.body;
  try {
    await db.query(
      `INSERT INTO lost_found (user_id, type, item_name, description, date, location, contact_name, contact_phone, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, type, item_name, description, date || null, location, contact_name, contact_phone, image_url || null]
    );
    res.json({ success: true, message: 'Submitted successfully. Waiting for admin approval.' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Get all items
router.get('/admin/lost-found', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT l.*, u.name as user_name FROM lost_found l LEFT JOIN users u ON l.user_id = u.id ORDER BY l.created_at DESC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Update status
router.put('/admin/lost-found/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await db.query("UPDATE lost_found SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin/User: Delete item
router.delete('/lost-found/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM lost_found WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- REVIEWS & RATINGS ---

router.get('/reviews/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.item_type = ? AND r.item_id = ? ORDER BY r.created_at DESC", 
      [type, id]
    );
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/reviews', async (req, res) => {
  const { user_id, item_type, item_id, rating, review_text } = req.body;
  if (!user_id || !item_type || !item_id || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert the new review
    await db.query(
      "INSERT INTO reviews (user_id, item_type, item_id, rating, review_text) VALUES (?, ?, ?, ?, ?)",
      [user_id, item_type, item_id, rating, review_text || null]
    );

    // Calculate new average and update the respective table
    let table = '';
    if (item_type === 'hotel') table = 'hotels';
    else if (item_type === 'food') table = 'food_services';
    else if (item_type === 'business') table = 'businesses';
    
    if (table) {
      const [stats] = await db.query(
        "SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE item_type = ? AND item_id = ?",
        [item_type, item_id]
      );
      
      const newCount = stats[0].count;
      const newAvg = stats[0].avg_rating ? parseFloat(stats[0].avg_rating).toFixed(1) : 0.0;
      
      // The columns in our DB might differ slightly per table.
      // hotels: rating, reviews
      // food_services: rating (no reviews count column currently, but we can update rating)
      // businesses: rating, reviews_count
      
      if (table === 'hotels') {
        await db.query("UPDATE hotels SET rating = ?, reviews = ? WHERE id = ?", [newAvg, newCount, item_id]);
      } else if (table === 'businesses') {
        await db.query("UPDATE businesses SET rating = ?, reviews_count = ? WHERE id = ?", [newAvg, newCount, item_id]);
      } else if (table === 'food_services') {
        await db.query("UPDATE food_services SET rating = ? WHERE id = ?", [newAvg, item_id]);
      }
    }

    res.json({ success: true, message: 'Review added successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- ALERTS / NOTIFICATIONS ---

// Public: Get active alerts
router.get('/alerts/active', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM alerts WHERE is_active = 1 ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Get all alerts
router.get('/admin/alerts', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM alerts ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Create alert
router.post('/admin/alerts', async (req, res) => {
  const { title, message, type } = req.body;
  try {
    await db.query("INSERT INTO alerts (title, message, type) VALUES (?, ?, ?)", [title, message, type || 'info']);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Toggle active
router.put('/admin/alerts/:id/toggle', async (req, res) => {
  const { is_active } = req.body;
  try {
    await db.query("UPDATE alerts SET is_active = ? WHERE id = ?", [is_active ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Admin: Delete alert
router.delete('/admin/alerts/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM alerts WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- MART ITEMS ---

router.get('/mart-items', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM mart_items ORDER BY id ASC");
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/mart-items', async (req, res) => {
  const { name, category, price, quantity_info, is_available, img_url } = req.body;
  try {
    await db.query(
      "INSERT INTO mart_items (name, category, price, quantity_info, is_available, img_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, category, price, quantity_info || '', is_available !== undefined ? is_available : 1, img_url || null]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/mart-items/:id', async (req, res) => {
  const { name, category, price, quantity_info, is_available, img_url } = req.body;
  try {
    await db.query(
      "UPDATE mart_items SET name=?, category=?, price=?, quantity_info=?, is_available=?, img_url=? WHERE id=?",
      [name, category, price, quantity_info || '', is_available !== undefined ? is_available : 1, img_url || null, req.params.id]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/mart-items/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM mart_items WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Settings Endpoints
router.get('/settings/:key', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT setting_value FROM app_settings WHERE setting_key = ?", [req.params.key]);
    if (rows.length > 0) {
      res.json({ value: rows[0].setting_value });
    } else {
      res.status(404).json({ error: 'Setting not found' });
    }
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/settings/:key', async (req, res) => {
  const { value } = req.body;
  try {
    await db.query(
      "INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      [req.params.key, value, value]
    );
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// My Hotel Routes
router.get('/users/:id/my-hotel', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hotels WHERE owner_id = ?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/my-hotel', async (req, res) => {
  const { total_rooms, available_rooms, phone } = req.body;
  try {
    await db.query('UPDATE hotels SET total_rooms = ?, available_rooms = ?, phone = ? WHERE owner_id = ?', [total_rooms, available_rooms, phone, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Dashboard Stats
router.get('/admin/dashboard-stats', async (req, res) => {
  try {
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const [hotels] = await db.query('SELECT COUNT(*) as count FROM hotels');
    const [donations] = await db.query('SELECT SUM(amount) as total FROM donations WHERE status="completed"');
    const [businesses] = await db.query('SELECT COUNT(*) as count FROM businesses');
    const [recentUsers] = await db.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');

    res.json({
      stats: {
        users: users[0].count,
        hotels: hotels[0].count,
        donations: donations[0].total || 0,
        businesses: businesses[0].count
      },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
