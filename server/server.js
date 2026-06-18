require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Vercel URL (set in Render env vars)
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

const db = require('./db');

// API Routes
app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM news ORDER BY date_posted DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hotels', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hotels");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/parking', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM parking");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transport', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM transport");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/businesses', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM businesses ORDER BY premium DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import additional routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

app.get('/api/status', async (req, res) => {
  let temp = '32°C';
  let humidity = '48%';
  let desc = 'Sunny';

  // Convert current time to India Time (IST, UTC+5:30) to get timezone-accurate hour for Kaliyar weather
  const utcDate = new Date();
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  const hour = istDate.getUTCHours();
  
  let simTemp = 32;
  let simHumid = 45;
  let simDesc = 'Sunny';

  if (hour >= 5 && hour < 12) {
    // 5 AM to 11 AM: rise from 27°C to 38°C
    simTemp = Math.round(27 + (hour - 5) * 1.6);
    simHumid = Math.round(55 - (hour - 5) * 3);
    simDesc = 'Sunny';
  } else if (hour >= 12 && hour < 17) {
    // 12 PM to 4 PM: hot peak between 39°C and 43°C
    simTemp = Math.round(39.5 + Math.random() * 2);
    simHumid = Math.round(30 + Math.random() * 5);
    simDesc = 'Hot & Sunny';
  } else if (hour >= 17 && hour < 21) {
    // 5 PM to 8 PM: cool down from 38°C to 32°C
    simTemp = Math.round(38 - (hour - 17) * 1.5);
    simHumid = Math.round(40 + (hour - 17) * 3);
    simDesc = 'Clear Sky';
  } else {
    // Night: 9 PM to 4 AM: cool down from 31°C to 26°C
    const diff = hour >= 21 ? (hour - 21) : (hour + 3);
    simTemp = Math.round(31 - diff * 0.6);
    simHumid = Math.round(50 + diff * 1.5);
    simDesc = 'Clear Sky';
  }

  temp = `${simTemp}°C`;
  humidity = `${simHumid}%`;
  desc = simDesc;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.932&longitude=77.935&current=temperature_2m,relative_humidity_2m,weather_code', { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.current) {
        temp = `${Math.round(data.current.temperature_2m)}°C`;
        humidity = `${data.current.relative_humidity_2m}%`;
        
        const code = data.current.weather_code;
        if (code === 0) desc = 'Clear Sky';
        else if (code >= 1 && code <= 3) desc = 'Partly Cloudy';
        else if (code === 45 || code === 48) desc = 'Foggy';
        else if (code >= 51 && code <= 55) desc = 'Drizzle';
        else if (code >= 61 && code <= 65) desc = 'Rainy';
        else if (code >= 80 && code <= 82) desc = 'Showers';
        else if (code >= 95) desc = 'Thunderstorm';
      }
    }
  } catch (error) {
    // Graceful fallback to simulated weather when offline
  }

  res.json({
    crowd: 'Medium',
    weather: { temp, desc, humidity },
    namaz: { next: 'Zuhr', time: '12:35 PM' }
  });
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
