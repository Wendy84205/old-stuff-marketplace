CREATE DATABASE IF NOT EXISTS old_marketplace
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE old_marketplace;

-- USERS
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  display_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url VARCHAR(500),
  role VARCHAR(50),
  rating_avg DECIMAL(3,2),
  rating_count INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  label VARCHAR(100),
  country VARCHAR(100),
  province VARCHAR(100),
  district VARCHAR(100),
  ward VARCHAR(100),
  street VARCHAR(255),
  lat DECIMAL(10,6),
  lon DECIMAL(10,6),
  is_default BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- CATEGORIES
CREATE TABLE categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  parent_id BIGINT,
  path VARCHAR(500),
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- LISTINGS
CREATE TABLE listings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  seller_id CHAR(36),
  title TEXT,
  description TEXT,
  category_id BIGINT,
  `condition` VARCHAR(50),
  price DECIMAL(12,2),
  currency CHAR(3),
  status VARCHAR(50),
  location_lat DECIMAL(10,6),
  location_lon DECIMAL(10,6),
  views_count INT DEFAULT 0,
  favorites_count INT DEFAULT 0,
  ai_price_suggestion DECIMAL(12,2),
  ai_category_id BIGINT,
  ai_risk_score DECIMAL(5,2),
  moderation_status VARCHAR(50),
  moderation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  sold_at TIMESTAMP NULL,
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (ai_category_id) REFERENCES categories(id)
);

CREATE TABLE listing_images (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT,
  url TEXT,
  width INT,
  height INT,
  bytes BIGINT,
  phash VARCHAR(64),
  ai_labels JSON,
  safe_flags JSON,
  order_index INT,
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

-- OFFERS & ORDERS
CREATE TABLE offers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT,
  buyer_id CHAR(36),
  offer_price DECIMAL(12,2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE TABLE orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT,
  buyer_id CHAR(36),
  seller_id CHAR(36),
  price_final DECIMAL(12,2),
  shipping_fee DECIMAL(12,2),
  total_amount DECIMAL(12,2),
  payment_status VARCHAR(50),
  order_status VARCHAR(50),
  shipping_address_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (shipping_address_id) REFERENCES addresses(id)
);

-- FAVORITES
CREATE TABLE favorites (
  user_id CHAR(36),
  listing_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, listing_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

-- CHATS & MESSAGES
CREATE TABLE chats (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT,
  buyer_id CHAR(36),
  seller_id CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  chat_id BIGINT,
  sender_id CHAR(36),
  content TEXT,
  attachments JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- REVIEWS
CREATE TABLE reviews (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT,
  rater_id CHAR(36),
  ratee_id CHAR(36),
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (rater_id) REFERENCES users(id),
  FOREIGN KEY (ratee_id) REFERENCES users(id)
);

-- AI & SEARCH
CREATE TABLE embeddings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  object_type VARCHAR(50),
  object_id BIGINT,
  model VARCHAR(100),
  embedding JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_suggestions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT,
  type VARCHAR(50),
  suggested_value JSON,
  model VARCHAR(100),
  parameters JSON,
  accepted BOOLEAN,
  accepted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

CREATE TABLE moderation_jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  target_type VARCHAR(50),
  target_id BIGINT,
  status VARCHAR(50),
  result JSON,
  action_taken VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE risk_scores (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  subject_type VARCHAR(50),
  subject_id BIGINT,
  features JSON,
  risk_score DECIMAL(5,2),
  explanation JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE search_queries (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  raw_query TEXT,
  normalized_query TEXT,
  filters JSON,
  results_count INT,
  latency_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE rec_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  listing_id BIGINT,
  event VARCHAR(50),
  context JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

-- GOVERNANCE & LOGS
CREATE TABLE reports (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  reporter_id CHAR(36),
  target_type VARCHAR(50),
  target_id BIGINT,
  reason TEXT,
  details TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  actor_type VARCHAR(50),
  actor_id CHAR(36),
  action VARCHAR(100),
  target_type VARCHAR(50),
  target_id BIGINT,
  diff JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  type VARCHAR(50),
  payload JSON,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
