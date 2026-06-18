-- Kaliyar Sharif Ziyarat Guide Database Schema
CREATE DATABASE IF NOT EXISTS kaliyar_db;
USE kaliyar_db;

-- Admin users
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users (Registration/Login)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News & Announcements
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_en VARCHAR(255),
  title_hi VARCHAR(255),
  title_ur VARCHAR(255),
  content_en TEXT,
  type ENUM('Announcement', 'News', 'Update', 'Urs') DEFAULT 'News',
  date_posted DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hotels
CREATE TABLE IF NOT EXISTS hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category ENUM('budget','family','guesthouse','ac','non-ac','dargah') DEFAULT 'budget',
  price INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INT DEFAULT 0,
  distance VARCHAR(50),
  phone VARCHAR(20),
  address TEXT,
  amenities JSON,
  featured BOOLEAN DEFAULT FALSE,
  sponsored BOOLEAN DEFAULT FALSE,
  `desc` TEXT,
  img_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parking
CREATE TABLE IF NOT EXISTS parking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type ENUM('car','bus','bike') DEFAULT 'car',
  capacity INT DEFAULT 0,
  available_slots INT DEFAULT 0,
  rate INT DEFAULT 0,
  rateType ENUM('hour','day','free') DEFAULT 'hour',
  distance VARCHAR(50),
  timing VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transport Routes
CREATE TABLE IF NOT EXISTS transport (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route VARCHAR(255),
  distance VARCHAR(50),
  fare_min INT DEFAULT 0,
  fare_max INT DEFAULT 0,
  type ENUM('train','bus','taxi','auto') DEFAULT 'bus',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food & Services
CREATE TABLE IF NOT EXISTS food_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category ENUM('restaurant','tea','sweet','atm','medical','hospital','toilet','water') DEFAULT 'restaurant',
  rating DECIMAL(2,1) DEFAULT 0,
  distance VARCHAR(50),
  phone VARCHAR(20),
  address TEXT,
  img_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category ENUM('police','ambulance','dargah','lost_found','fire') DEFAULT 'police',
  phone VARCHAR(20),
  location VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ziyarat Places
CREATE TABLE IF NOT EXISTS ziyarat_places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(200) NOT NULL,
  name_hi VARCHAR(200),
  name_ur VARCHAR(200),
  type ENUM('dargah','mazaraat','qawwali','langar','wuzu','toilet') DEFAULT 'mazaraat',
  desc_en TEXT,
  desc_hi TEXT,
  desc_ur TEXT,
  img_url VARCHAR(255),
  timings VARCHAR(100) DEFAULT '24 Hours',
  opening_time VARCHAR(50) DEFAULT '05:00 AM',
  closing_time VARCHAR(50) DEFAULT '10:00 PM',
  fajr_time VARCHAR(50),
  dhuhr_time VARCHAR(50),
  asr_time VARCHAR(50),
  maghrib_time VARCHAR(50),
  isha_time VARCHAR(50),
  lat DECIMAL(10,6),
  lng DECIMAL(10,6),
  sequence_order INT DEFAULT 0,
  show_on_route BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Urs Schedule
CREATE TABLE IF NOT EXISTS urs_schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(200),
  event_date DATE,
  event_time VARCHAR(50),
  location VARCHAR(200),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(10,2),
  type ENUM('general','chadar','langar','masjid') DEFAULT 'general',
  transaction_id VARCHAR(100),
  status ENUM('pending','completed','failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Business Directory
CREATE TABLE IF NOT EXISTS businesses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category ENUM('hotel','restaurant','chadar','attar','gift','transport') DEFAULT 'chadar',
  description TEXT,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  logo_url VARCHAR(255),
  address VARCHAR(255),
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews_count INT DEFAULT 0,
  premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved Places (User Favorites)
CREATE TABLE IF NOT EXISTS saved_places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  place_type ENUM('hotel','ziyarat','business') NOT NULL,
  place_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Hero Slider Images
CREATE TABLE IF NOT EXISTS hero_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  img_url VARCHAR(500) NOT NULL,
  title_en VARCHAR(255),
  title_hi VARCHAR(255),
  title_ur VARCHAR(255),
  subtitle_en VARCHAR(255),
  subtitle_hi VARCHAR(255),
  subtitle_ur VARCHAR(255),
  sequence_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
INSERT INTO admins (name, email, password) VALUES 
('Admin', 'admin@kaliyar.com', '$2b$10$PZcGAjd3RFDkLbjVVFALLundhUxGqLNcVn4w0f4Te6k29UAYnyU9S')
ON DUPLICATE KEY UPDATE name=name, password=VALUES(password);

-- Lost and Found
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
);
