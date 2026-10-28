#!/usr/bin/env bash
set -e

# ====================================================================
# Build & Packaging Script untuk cPanel Deployment
# Undangan Digital Pernikahan (React + CodeIgniter 4)
# ====================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist_cpanel"

echo "========================================================"
echo "🚀 MEMULAI PROSES BUILD & COMPILE UNTUK CPANEL"
echo "Root Directory: $ROOT_DIR"
echo "========================================================"

# 1. COMPILE FRONTEND (VITE + REACT)
echo ""
echo "📦 [1/5] Meng-compile Frontend React dengan Vite..."
cd "$ROOT_DIR/frontend"

# Pastikan permission binary node_modules aman
if [ -d "node_modules/.bin" ]; then
    chmod +x node_modules/.bin/* 2>/dev/null || true
fi

npm run build
echo "✅ Frontend berhasil di-compile ke frontend/dist"

# 2. BERSIHKAN & SIAPKAN FOLDER DIST_CPANEL
echo ""
echo "📁 [2/5] Menyiapkan struktur folder output cPanel..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

METODE_1="$DIST_DIR/01_METODE_STANDAR_REKOMENDASI"
METODE_2="$DIST_DIR/02_METODE_ALL_IN_ONE"

mkdir -p "$METODE_1/public_html"
mkdir -p "$METODE_1/undangan_backend"
mkdir -p "$METODE_2/public_html"

# Salin database setup ke root dist
cp "$ROOT_DIR/backend/database_setup_complete.sql" "$DIST_DIR/database_setup_complete.sql"

# ====================================================================
# 3. RAKIT METODE 1: REKOMENDASI STANDAR (2 FOLDER TERPISAH)
# ====================================================================
echo ""
echo "⚙️  [3/5] Merakit Paket METODE 1 (Standar Keamanan CI4)..."

# A. Isi public_html
cp -r "$ROOT_DIR/frontend/dist/"* "$METODE_1/public_html/"
mkdir -p "$METODE_1/public_html/uploads"
if [ -d "$ROOT_DIR/backend/public/uploads" ]; then
    cp -r "$ROOT_DIR/backend/public/uploads/"* "$METODE_1/public_html/uploads/" 2>/dev/null || true
fi
# Salin media default ke uploads agar seeded data tidak broken
if [ -d "$ROOT_DIR/frontend/public/assets" ]; then
    cp -n "$ROOT_DIR/frontend/public/assets/"* "$METODE_1/public_html/uploads/" 2>/dev/null || true
fi
[ -f "$ROOT_DIR/backend/public/favicon.ico" ] && cp "$ROOT_DIR/backend/public/favicon.ico" "$METODE_1/public_html/"
[ -f "$ROOT_DIR/backend/public/robots.txt" ] && cp "$ROOT_DIR/backend/public/robots.txt" "$METODE_1/public_html/"

# B. index.php untuk public_html Metode 1 (merujuk ke ../undangan_backend)
cat << 'EOF' > "$METODE_1/public_html/index.php"
<?php

use CodeIgniter\Boot;
use Config\Paths;

// Check PHP Version (Minimal PHP 8.2)
$minPhpVersion = '8.2';
if (version_compare(PHP_VERSION, $minPhpVersion, '<')) {
    header('HTTP/1.1 503 Service Unavailable.', true, 503);
    echo sprintf('Versi PHP Anda harus %s atau lebih baru. Versi saat ini: %s', $minPhpVersion, PHP_VERSION);
    exit(1);
}

define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);

if (getcwd() . DIRECTORY_SEPARATOR !== FCPATH) {
    chdir(FCPATH);
}

// Menghubungkan ke folder backend di luar public_html (/home/username/undangan_backend)
// Jika Anda menamai folder backend berbeda di cPanel, ubah path di bawah ini:
$pathsFile = FCPATH . '../undangan_backend/app/Config/Paths.php';

if (! file_exists($pathsFile)) {
    // Fallback bila folder backend bernama 'backend'
    $pathsFile = FCPATH . '../backend/app/Config/Paths.php';
}

require $pathsFile;

$paths = new Paths();
require $paths->systemDirectory . '/Boot.php';
exit(Boot::bootWeb($paths));
EOF

# C. .htaccess untuk public_html Metode 1
cat << 'EOF' > "$METODE_1/public_html/.htaccess"
# ====================================================================
# Konfigurasi Apache .htaccess untuk React SPA + CodeIgniter 4 API
# ====================================================================

Options -Indexes
Options +FollowSymlinks
DirectoryIndex index.html index.php

<IfModule mod_rewrite.c>
    RewriteEngine On

    # Oper Header Authorization untuk Bearer Token login Admin API
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes (kecuali direktori asli)
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # 1. RUTE API & ENDPOINT KHUSUS -> Diteruskan ke CodeIgniter 4 (index.php)
    RewriteCond %{REQUEST_URI} ^/api(/.*)?$ [NC,OR]
    RewriteCond %{REQUEST_URI} ^/api_rsvp\.php [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php/$1 [L,QSA]

    # 2. BERKAS STATIS NYATA (assets, uploads, favicon, video, audio) -> Sajikan langsung
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # 3. SEMUA RUTE LAINNYA (React Router SPA: /, /admin, /admin/login, /admin/*)
    # Dialihkan ke index.html agar tidak 404 saat refresh browser
    RewriteRule ^ index.html [L]
</IfModule>

<IfModule !mod_rewrite.c>
    ErrorDocument 404 /index.html
</IfModule>

# Keamanan: Blokir akses ke file sensitif jika ada
<FilesMatch "^\.env|composer\.(json|lock)|package(-lock)?\.json|\.git">
    Order allow,deny
    Deny from all
</FilesMatch>

ServerSignature Off
EOF

# D. Isi undangan_backend Metode 1
cp -r "$ROOT_DIR/backend/app" "$METODE_1/undangan_backend/"
cp -r "$ROOT_DIR/backend/vendor" "$METODE_1/undangan_backend/"
mkdir -p "$METODE_1/undangan_backend/writable/cache"
mkdir -p "$METODE_1/undangan_backend/writable/logs"
mkdir -p "$METODE_1/undangan_backend/writable/session"
mkdir -p "$METODE_1/undangan_backend/writable/uploads"
echo '<html><head><title>403 Forbidden</title></head><body><p>Directory access is forbidden.</p></body></html>' > "$METODE_1/undangan_backend/writable/index.html"
echo '<html><head><title>403 Forbidden</title></head><body><p>Directory access is forbidden.</p></body></html>' > "$METODE_1/undangan_backend/writable/cache/index.html"
echo '<html><head><title>403 Forbidden</title></head><body><p>Directory access is forbidden.</p></body></html>' > "$METODE_1/undangan_backend/writable/logs/index.html"
echo '<html><head><title>403 Forbidden</title></head><body><p>Directory access is forbidden.</p></body></html>' > "$METODE_1/undangan_backend/writable/session/index.html"
echo '<html><head><title>403 Forbidden</title></head><body><p>Directory access is forbidden.</p></body></html>' > "$METODE_1/undangan_backend/writable/uploads/index.html"
cat << 'EOF' > "$METODE_1/undangan_backend/writable/.htaccess"
<IfModule authz_core_module>
    Require all denied
</IfModule>
<IfModule !authz_core_module>
    Deny from all
</IfModule>
EOF

cp "$ROOT_DIR/backend/.env.production" "$METODE_1/undangan_backend/.env"
cp "$ROOT_DIR/backend/database_setup_complete.sql" "$METODE_1/undangan_backend/database_setup_complete.sql"
[ -f "$ROOT_DIR/backend/spark" ] && cp "$ROOT_DIR/backend/spark" "$METODE_1/undangan_backend/"


# ====================================================================
# 4. RAKIT METODE 2: ALL-IN-ONE (SEMUA DI DALAM PUBLIC_HTML)
# ====================================================================
echo ""
echo "⚙️  [4/5] Merakit Paket METODE 2 (All-in-One dalam public_html)..."

# Salin frontend build & media
cp -r "$ROOT_DIR/frontend/dist/"* "$METODE_2/public_html/"
mkdir -p "$METODE_2/public_html/uploads"
if [ -d "$ROOT_DIR/backend/public/uploads" ]; then
    cp -r "$ROOT_DIR/backend/public/uploads/"* "$METODE_2/public_html/uploads/" 2>/dev/null || true
fi
if [ -d "$ROOT_DIR/frontend/public/assets" ]; then
    cp -n "$ROOT_DIR/frontend/public/assets/"* "$METODE_2/public_html/uploads/" 2>/dev/null || true
fi
[ -f "$ROOT_DIR/backend/public/favicon.ico" ] && cp "$ROOT_DIR/backend/public/favicon.ico" "$METODE_2/public_html/"
[ -f "$ROOT_DIR/backend/public/robots.txt" ] && cp "$ROOT_DIR/backend/public/robots.txt" "$METODE_2/public_html/"

# Salin backend core ke dalam public_html
cp -r "$ROOT_DIR/backend/app" "$METODE_2/public_html/"
cp -r "$ROOT_DIR/backend/vendor" "$METODE_2/public_html/"
mkdir -p "$METODE_2/public_html/writable/cache"
mkdir -p "$METODE_2/public_html/writable/logs"
mkdir -p "$METODE_2/public_html/writable/session"
mkdir -p "$METODE_2/public_html/writable/uploads"
echo '<html><head><title>403 Forbidden</title></head><body><p>Directory access is forbidden.</p></body></html>' > "$METODE_2/public_html/writable/index.html"
cat << 'EOF' > "$METODE_2/public_html/writable/.htaccess"
<IfModule authz_core_module>
    Require all denied
</IfModule>
<IfModule !authz_core_module>
    Deny from all
</IfModule>
EOF

cp "$ROOT_DIR/backend/.env.production" "$METODE_2/public_html/.env"
cp "$ROOT_DIR/backend/database_setup_complete.sql" "$METODE_2/public_html/database_setup_complete.sql"
[ -f "$ROOT_DIR/backend/spark" ] && cp "$ROOT_DIR/backend/spark" "$METODE_2/public_html/"

# index.php untuk Metode 2 (app ada di folder yang sama)
cat << 'EOF' > "$METODE_2/public_html/index.php"
<?php

use CodeIgniter\Boot;
use Config\Paths;

$minPhpVersion = '8.2';
if (version_compare(PHP_VERSION, $minPhpVersion, '<')) {
    header('HTTP/1.1 503 Service Unavailable.', true, 503);
    echo sprintf('Versi PHP Anda harus %s atau lebih baru. Versi saat ini: %s', $minPhpVersion, PHP_VERSION);
    exit(1);
}

define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);

if (getcwd() . DIRECTORY_SEPARATOR !== FCPATH) {
    chdir(FCPATH);
}

// Menghubungkan langsung ke folder app di direktori yang sama
require FCPATH . 'app/Config/Paths.php';

$paths = new Paths();
require $paths->systemDirectory . '/Boot.php';
exit(Boot::bootWeb($paths));
EOF

# .htaccess untuk Metode 2 (dengan proteksi folder app, vendor, writable, .env)
cat << 'EOF' > "$METODE_2/public_html/.htaccess"
# ====================================================================
# Konfigurasi Apache .htaccess All-in-One (React SPA + CI4 API)
# ====================================================================

Options -Indexes
Options +FollowSymlinks
DirectoryIndex index.html index.php

# PROTEKSI KETAT: Blokir akses langsung ke folder internal CI4 & berkas sensitif
<IfModule mod_authz_core.c>
    <FilesMatch "^\.env|composer\.(json|lock)|package(-lock)?\.json|\.git|database_setup.*\.sql">
        Require all denied
    </FilesMatch>
</IfModule>
<IfModule !mod_authz_core.c>
    <FilesMatch "^\.env|composer\.(json|lock)|package(-lock)?\.json|\.git|database_setup.*\.sql">
        Order allow,deny
        Deny from all
    </FilesMatch>
</IfModule>

RewriteEngine On

# Blokir request langsung ke folder app, vendor, writable
RewriteRule ^(app|vendor|writable)/ - [F,L,NC]

# Oper Header Authorization untuk Bearer Token login Admin API
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

# Redirect Trailing Slashes (kecuali direktori asli)
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} (.+)/$
RewriteRule ^ %1 [L,R=301]

# 1. RUTE API & ENDPOINT KHUSUS -> Diteruskan ke CodeIgniter 4 (index.php)
RewriteCond %{REQUEST_URI} ^/api(/.*)?$ [NC,OR]
RewriteCond %{REQUEST_URI} ^/api_rsvp\.php [NC]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php/$1 [L,QSA]

# 2. BERKAS STATIS NYATA (assets, uploads, favicon, video, audio) -> Sajikan langsung
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 3. SEMUA RUTE LAINNYA (React Router SPA: /, /admin, /admin/login, /admin/*)
# Dialihkan ke index.html agar tidak 404 saat refresh browser
RewriteRule ^ index.html [L]

<IfModule !mod_rewrite.c>
    ErrorDocument 404 /index.html
</IfModule>

ServerSignature Off
EOF

# ====================================================================
# 5. KOMPRESI KE ZIP SIAP UPLOAD
# ====================================================================
echo ""
echo "🗜️  [5/5] Membuat arsip ZIP siap upload ke cPanel..."

# ZIP Metode 1
cd "$METODE_1"
zip -rq "$DIST_DIR/undangan_cpanel_standard.zip" public_html undangan_backend

# ZIP Metode 2
cd "$METODE_2/public_html"
zip -rq "$DIST_DIR/undangan_cpanel_all_in_one.zip" .

cd "$ROOT_DIR"

echo "========================================================"
echo "🎉 COMPILE & PACKAGING CPANEL SELESAI!"
echo "Lokasi Hasil Output: $DIST_DIR"
echo "  1. Arsip ZIP Standar (Rekomendasi) : dist_cpanel/undangan_cpanel_standard.zip"
echo "  2. Arsip ZIP All-in-One (Praktis) : dist_cpanel/undangan_cpanel_all_in_one.zip"
echo "  3. Database SQL                  : dist_cpanel/database_setup_complete.sql"
echo "========================================================"
