-- Database setup untuk undangan_db
-- Cara pakai: mysql -u root < database_setup.sql
-- atau import via phpMyAdmin, lalu jalankan: php spark migrate --all
CREATE DATABASE IF NOT EXISTS undangan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE undangan_db;

CREATE TABLE IF NOT EXISTS guests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Hadir',
    guest_count INT NOT NULL DEFAULT 1,
    message TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    caption VARCHAR(255) NULL,
    image_path VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    year VARCHAR(10) NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    image_path VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS couple_photos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(10) NOT NULL,
    nickname VARCHAR(100) NULL,
    name VARCHAR(255) NULL,
    father VARCHAR(255) NULL,
    mother VARCHAR(255) NULL,
    instagram VARCHAR(100) NULL,
    image_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date_label VARCHAR(255) NOT NULL,
    time_label VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT NULL,
    maps_url TEXT NULL,
    target_gender ENUM('ALL', 'L', 'P') NOT NULL DEFAULT 'ALL',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

