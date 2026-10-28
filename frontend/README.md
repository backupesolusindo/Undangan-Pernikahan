# Undangan Digital Pernikahan (Digital Wedding Invitation)

Proyek undangan digital pernikahan berbasis web dengan desain elegan, animasi halus, dan fitur lengkap.

## 🚀 Fitur Utama
1. **Cover / Opening Card**: Animasi pembuka undangan dengan dukungan nama tamu dinamis melalui URL parameter (`?to=Nama+Tamu`).
2. **Music Background**: Floating audio player yang otomatis aktif saat tombol "Buka Undangan" diklik.
3. **Profil Mempelai**: Tampilan foto, nama, silsilah orang tua, dan link Instagram mempelai pria & wanita.
4. **Countdown Timer**: Penghitung mundur waktu menuju hari bahagia secara real-time.
5. **Detail Acara**: Informasi Akad & Resepsi pernikahan dilengkapi tombol petunjuk Google Maps & simpan ke Google Calendar.
6. **Love Story**: Timeline perjalanan kisah cinta pengantin.
7. **Galeri Foto**: Grid galeri prewedding dengan modal popup Lightbox.
8. **Amplop Digital**: Transfer bank / angpao digital dengan tombol *Salin Nomor Rekening* & feedback notifikasi.
9. **RSVP & Ucapan**: Form konfirmasi kehadiran dan kolom ucapan selamat yang langsung muncul secara real-time (tersimpan di LocalStorage).

## 🛠️ Cara Menjalankan Proyek

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Server Dev (Lokal)
```bash
npm run dev
```

### 3. Build untuk Production
```bash
npm run build
```

## ⚙️ Mengubah Data Pengantin & Konten
Semua data undangan (nama pengantin, tanggal acara, nomor rekening, cerita cinta, galeri foto) dapat diubah dengan sangat mudah melalui berkas:
`src/data/weddingConfig.js`
