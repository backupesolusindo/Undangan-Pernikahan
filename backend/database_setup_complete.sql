-- ====================================================================
-- Database Setup Lengkap untuk Undangan Digital Pernikahan (CodeIgniter 4 + React)
-- Dapat langsung di-import melalui phpMyAdmin di cPanel
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------------------
-- 1. Table: guests (Buku Tamu / Konfirmasi RSVP & Ucapan)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `guests` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Hadir',
    `guest_count` INT NOT NULL DEFAULT 1,
    `message` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Table: gallery (Galeri Foto)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gallery` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `caption` VARCHAR(255) NULL,
    `image_path` VARCHAR(500) NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Table: stories (Love Story / Timeline Kisah Cinta)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `stories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `year` VARCHAR(10) NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image_path` VARCHAR(500) NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Table: couple_photos (Data Profil & Foto Mempelai)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `couple_photos` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `role` VARCHAR(10) NOT NULL,
    `nickname` VARCHAR(100) NULL,
    `name` VARCHAR(255) NULL,
    `father` VARCHAR(255) NULL,
    `mother` VARCHAR(255) NULL,
    `instagram` VARCHAR(100) NULL,
    `image_path` VARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Table: events (Rangkaian Acara: Akad & Resepsi)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `date_label` VARCHAR(255) NOT NULL,
    `time_label` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `address` TEXT NULL,
    `maps_url` TEXT NULL,
    `target_gender` ENUM('ALL', 'L', 'P') NOT NULL DEFAULT 'ALL',
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. Table: admins (Akun Administrator Login Panel React)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `api_token` VARCHAR(255) NULL DEFAULT NULL,
    `created_at` DATETIME NULL,
    `updated_at` DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. Table: wedding_settings (Pengaturan Teks & Aset Undangan)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedding_settings` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` TEXT NULL,
    `created_at` DATETIME NULL,
    `updated_at` DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. Table: invitees (Daftar Tamu Undangan Khusus / Custom Link)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `invitees` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(50) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME NULL,
    `updated_at` DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DATA AWAL (DEFAULT DATA)
-- ====================================================================

-- Default Admin (username: admin | password: admin123)
INSERT INTO `admins` (`id`, `username`, `password`, `name`, `api_token`, `created_at`, `updated_at`)
VALUES (1, 'admin', '$2y$10$5DpKTwIqF5vw2ddyeocpouyzs6f8wjt6qVuoyyO0hIiHyiZy2LUVO', 'Administrator', NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE `username` = `username`;

-- Default Settings
INSERT INTO `wedding_settings` (`setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES
('groom_name', 'Raden Seno Wijaya, S.T.', NOW(), NOW()),
('groom_nickname', 'Seno', NOW(), NOW()),
('groom_father', 'Bpk. H. Bambang Wijayanto', NOW(), NOW()),
('groom_mother', 'Ibu Hj. Sri Rahayu', NOW(), NOW()),
('groom_instagram', '@seno_wijaya', NOW(), NOW()),
('groom_photo', 'assets/groom.jpg', NOW(), NOW()),
('bride_name', 'Juwita Sukma, S.Pd.', NOW(), NOW()),
('bride_nickname', 'Juwita', NOW(), NOW()),
('bride_father', 'Bpk. Bastian Edy (Alm)', NOW(), NOW()),
('bride_mother', 'Ibu Romadona Noverina', NOW(), NOW()),
('bride_instagram', '@juwita_sukma', NOW(), NOW()),
('bride_photo', 'assets/bride.jpg', NOW(), NOW()),
('event_date', '2026-09-30T08:00:00+07:00', NOW(), NOW()),
('event_date_formatted', 'Minggu, 30 September 2026', NOW(), NOW()),
('audio_url', 'https://cdn.jsdelivr.net/gh/backupesolusindo/Undangan-Pernikahan@main/frontend/public/assets/wedding_music.mp3', NOW(), NOW()),
('video_url', 'https://cdn.jsdelivr.net/gh/backupesolusindo/Undangan-Pernikahan@main/frontend/public/assets/opening_video2.mp4', NOW(), NOW()),
('hero_image', 'assets/hero_cover.jpg', NOW(), NOW()),
('hero_fullscreen_image', 'assets/videoframe_17420.png', NOW(), NOW()),
('quote_text', 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga pernikahan ini keberkahan bagi kami, keluarga kami, dan keturunan kami di dunia & akhirat.', NOW(), NOW()),
('quote_source', 'QS. Ar-Rum: 21', NOW(), NOW()),
('akad_title', 'Akad Nikah', NOW(), NOW()),
('akad_date', 'Minggu, 30 September 2026', NOW(), NOW()),
('akad_time', '08:00 WIB - Selesai', NOW(), NOW()),
('akad_location', 'Pendopo Kedhaton Jawa', NOW(), NOW()),
('akad_address', 'Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah', NOW(), NOW()),
('akad_maps_url', 'https://maps.google.com/?q=Surakarta', NOW(), NOW()),
('resepsi_title', 'Upacara Panggih & Resepsi', NOW(), NOW()),
('resepsi_date', 'Minggu, 30 September 2026', NOW(), NOW()),
('resepsi_time', '11:00 - 14:00 WIB', NOW(), NOW()),
('resepsi_location', 'Grand Ballroom Pendopo Agung', NOW(), NOW()),
('resepsi_address', 'Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah', NOW(), NOW()),
('resepsi_maps_url', 'https://maps.google.com/?q=Surakarta', NOW(), NOW()),
('bank1_name', 'Bank BCA', NOW(), NOW()),
('bank1_account', '8830192841', NOW(), NOW()),
('bank1_holder', 'Juwita Sukma', NOW(), NOW()),
('bank1_icon', 'assets/bca_logo.svg', NOW(), NOW()),
('bank2_name', 'Bank Mandiri', NOW(), NOW()),
('bank2_account', '1380092104812', NOW(), NOW()),
('bank2_holder', 'Raden Seno Wijaya', NOW(), NOW()),
('bank2_icon', 'assets/mandiri_logo.svg', NOW(), NOW()),
('gift_name', 'Juwita & Seno', NOW(), NOW()),
('gift_address', 'Kediaman Mempelai, Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah', NOW(), NOW())
ON DUPLICATE KEY UPDATE `setting_key` = `setting_key`;

-- Default Galeri Foto
INSERT INTO `gallery` (`id`, `caption`, `image_path`, `sort_order`, `created_at`) VALUES
(1, 'Busana Adat Jawa Solo Basahan', 'assets/gallery1.jpg', 1, NOW()),
(2, 'Moments Juwita & Seno', 'assets/gallery2.jpg', 2, NOW()),
(3, 'Senyum Bahagia', 'assets/gallery3.jpg', 3, NOW()),
(4, 'Prosesi Siraman & Midodareni', 'assets/gallery4.jpg', 4, NOW()),
(5, 'Pendopo Ageng', 'assets/gallery5.jpg', 5, NOW()),
(6, 'Cinta Dalam Kebaya Javanese Art', 'assets/gallery6.jpg', 6, NOW())
ON DUPLICATE KEY UPDATE `id` = `id`;

-- Default Love Story
INSERT INTO `stories` (`id`, `year`, `title`, `description`, `image_path`, `sort_order`, `created_at`) VALUES
(1, '2021', 'Pisanan Kepanggih (Pertama Bertemu)', 'Awal mula takdir mempertemukan kami dalam suasana adat Jawa di kota Surakarta.', 'assets/story1.jpg', 1, NOW()),
(2, '2023', 'Manunggal Jiwo (Niat Suci)', 'Menyatukan niat dan tekad bersama untuk melangkah ke jenjang mahligai rumah tangga.', 'assets/story2.jpg', 2, NOW()),
(3, '2025', 'Lamar (Nembung)', 'Acara silaturahmi keluarga besar dan pengikatan janji suci lamaran.', 'assets/story3.jpg', 3, NOW())
ON DUPLICATE KEY UPDATE `id` = `id`;

-- Default Couple Profile
INSERT INTO `couple_photos` (`id`, `role`, `nickname`, `name`, `father`, `mother`, `instagram`, `image_path`, `created_at`) VALUES
(1, 'bride', 'Juwita', 'Juwita Sukma, S.Pd.', 'Bpk. Bastian Edy (Alm)', 'Ibu Romadona Noverina', '@juwita_sukma', 'assets/bride.jpg', NOW()),
(2, 'groom', 'Seno', 'Raden Seno Wijaya, S.T.', 'Bpk. H. Bambang Wijayanto', 'Ibu Hj. Sri Rahayu', '@seno_wijaya', 'assets/groom.jpg', NOW())
ON DUPLICATE KEY UPDATE `id` = `id`;

-- Default Events
INSERT INTO `events` (`id`, `title`, `date_label`, `time_label`, `location`, `address`, `maps_url`, `target_gender`, `sort_order`, `created_at`) VALUES
(1, 'Akad Nikah', 'Minggu, 30 September 2026', '08:00 WIB - Selesai', 'Pendopo Kedhaton Jawa', 'Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah', 'https://maps.google.com/?q=Surakarta', 'ALL', 1, NOW()),
(2, 'Upacara Panggih & Resepsi', 'Minggu, 30 September 2026', '11:00 - 14:00 WIB', 'Grand Ballroom Pendopo Agung', 'Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah', 'https://maps.google.com/?q=Surakarta', 'ALL', 2, NOW())
ON DUPLICATE KEY UPDATE `id` = `id`;

SET FOREIGN_KEY_CHECKS = 1;
