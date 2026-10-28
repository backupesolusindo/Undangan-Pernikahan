# 🎊 Undangan Wedding — PHP Backend (CodeIgniter 4)

Backend REST API untuk proyek **Undangan Wedding Animation** berbasis **CodeIgniter 4**.  
Frontend React (Vite) tersedia di repository [undangan_animation](https://github.com/krizik74/undangan_animation).

---

## 🗂️ Struktur Proyek

```
undangan_php_backend/
├── app/
│   ├── Controllers/
│   │   ├── Api.php           ← REST API (gallery, stories, couple, events, rsvp)
│   │   ├── Admin.php         ← Admin Panel (CRUD tamu, galeri, cerita, acara)
│   │   └── ...
│   ├── Models/
│   │   ├── GuestModel.php    ← Model RSVP / tamu
│   │   ├── GalleryModel.php  ← Model galeri foto
│   │   ├── StoryModel.php    ← Model kisah cinta
│   │   ├── CoupleModel.php   ← Model data mempelai
│   │   └── EventModel.php    ← Model acara pernikahan
│   ├── Database/
│   │   ├── Migrations/       ← Schema tabel database
│   │   └── Seeds/            ← Data sample awal
│   └── Config/
│       └── Routes.php        ← Routing API + Admin
├── public/
│   └── uploads/              ← Folder upload gambar
├── .env                      ← Konfigurasi database (tidak di-commit)
├── env                       ← Template .env
└── README.md
```

---

## ⚙️ Persyaratan

- **PHP** ≥ 8.2
- **Composer** ≥ 2.x
- **MySQL / MariaDB**
- Extension PHP: `intl`, `mbstring`, `mysqlnd`, `curl`

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/krizik74/undangan_php_backend.git
cd undangan_php_backend
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Konfigurasi Environment

```bash
cp env .env
```

Edit file `.env`:

```env
CI_ENVIRONMENT = development

app.baseURL = 'http://localhost:8080/'

database.default.hostname = localhost
database.default.database = undangan_db
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
```

### 4. Buat Database

```sql
CREATE DATABASE undangan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Jalankan Migrasi

```bash
php spark migrate
```

### 6. (Opsional) Seed Data Sample

```bash
php spark db:seed AssetSeeder
```

### 7. Jalankan Server

```bash
php spark serve
```

Server berjalan di: **http://localhost:8080**

---

## 📡 Endpoint API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/gallery` | Daftar foto galeri |
| `GET` | `/api/stories` | Daftar kisah cinta / timeline |
| `GET` | `/api/couple` | Data mempelai (bride & groom) |
| `GET` | `/api/events` | Daftar acara pernikahan |
| `GET` | `/api/rsvp` | Daftar ucapan & konfirmasi tamu |
| `POST` | `/api/rsvp` | Submit RSVP baru |

### Contoh Response `GET /api/couple`

```json
{
  "bride": {
    "id": 1,
    "role": "bride",
    "name": "Juwita Sukma, S.Pd.",
    "nickname": "Juwita",
    "father": "Bpk. Bastian Edy (Alm)",
    "mother": "Ibu Romadona Noverina",
    "instagram": "@juwita_sukma",
    "photo": "http://localhost:8080/uploads/bride.jpg"
  },
  "groom": {
    "id": 2,
    "role": "groom",
    "name": "Raden Seno Wijaya, S.T.",
    "nickname": "Seno",
    "father": "Bpk. H. Bambang Wijayanto",
    "mother": "Ibu Hj. Sri Rahayu",
    "instagram": "@seno_wijaya",
    "photo": "http://localhost:8080/uploads/groom.jpg"
  }
}
```

### Contoh POST `POST /api/rsvp`

```json
{
  "name": "Ahmad Fauzi",
  "phone": "081234567890",
  "status": "Hadir",
  "guest_count": 2,
  "message": "Selamat menempuh hidup baru!"
}
```

**Response sukses:**
```json
{
  "status": "success",
  "message": "Data berhasil disimpan"
}
```

---

## 🖥️ Admin Panel

Akses admin di: **http://localhost:8080/admin**

Fitur admin panel:
- 📋 **Daftar Tamu** — lihat, tambah, edit, hapus data RSVP
- 📤 **Export CSV** — export daftar tamu ke file CSV
- 🔄 **Sync Google Sheets** — kirim data ke Google Sheets via Webhook
- 🖼️ **Aset Tampilan** — kelola galeri foto, kisah cinta, data mempelai
- 📅 **Acara Pernikahan** — kelola daftar acara (akad, resepsi, dll.)

---

## 🔗 Koneksi dengan Frontend

Set `VITE_API_URL` di file `.env` frontend (`undangan_animation`):

```env
VITE_API_URL=http://localhost:8080
```

Pastikan backend berjalan saat development frontend.

---

## 🌐 Deploy ke Hosting

1. Upload semua file **kecuali** `vendor/` ke hosting
2. Jalankan `composer install --no-dev` di server
3. Konfigurasi `.env` sesuai database hosting
4. Set `app.baseURL` ke URL domain hosting
5. Arahkan DocumentRoot web server ke folder `public/`

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan pribadi dan komersial.

---

> Dibuat dengan ❤️ untuk pernikahan Juwita & Seno
