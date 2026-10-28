#!/usr/bin/env bash
set -e

# ====================================================================
# SCRIPT DEPLOY: COMPILE & AUTO-UPLOAD KE CPANEL FTP
# Undangan Digital Pernikahan (React + CodeIgniter 4)
# ====================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================================"
echo "🚀 MEMULAI BUILD & DEPLOY KE SERVER CPANEL"
echo "Root: $ROOT_DIR"
echo "========================================================"

# 1. COMPILE FRONTEND DENGAN VITE
echo ""
echo "🔨 [Langkah 1/2] Meng-compile Frontend React..."
cd "$ROOT_DIR/frontend"

# Pastikan permission binary node_modules aman
if [ -d "node_modules/.bin" ]; then
    chmod +x node_modules/.bin/* 2>/dev/null || true
fi

npm run build

echo "✅ Frontend berhasil di-compile ke frontend/dist!"

# 2. UPLOAD KE SERVER FTP
echo ""
echo "🚀 [Langkah 2/2] Mengunggah Frontend & Backend ke Server FTP..."
cd "$ROOT_DIR"
python3 "$ROOT_DIR/scripts/deploy.py"

echo ""
echo "🎉 Build dan Upload selesai dengan sukses!"
