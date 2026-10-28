#!/usr/bin/env python3
import os
import sys
import json
import ftplib
import time
import urllib.request

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SFTP_CONFIG_FILE = os.path.join(ROOT_DIR, ".vscode", "sftp.json")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
FRONTEND_DIST = os.path.join(FRONTEND_DIR, "dist")
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

def load_ftp_config():
    if not os.path.exists(SFTP_CONFIG_FILE):
        print(f"❌ Error: File {SFTP_CONFIG_FILE} tidak ditemukan!")
        sys.exit(1)
    try:
        with open(SFTP_CONFIG_FILE, "r") as f:
            cfg = json.load(f)
        return {
            "host": cfg.get("host", "101.50.1.120"),
            "port": int(cfg.get("port", 21)),
            "user": cfg.get("username", "weddinginvitation@klinikdokterku.com"),
            "password": cfg.get("password", "RahasiaWedding"),
            "remotePath": cfg.get("remotePath", "/")
        }
    except Exception as e:
        print(f"❌ Error membaca konfigurasi sftp.json: {e}")
        sys.exit(1)

def get_ftp(cfg):
    print(f"📡 Menghubungkan ke FTP {cfg['host']}:{cfg['port']}...")
    ftp = ftplib.FTP()
    ftp.connect(cfg["host"], cfg["port"], timeout=30)
    ftp.login(cfg["user"], cfg["password"])
    print(f"✅ Login berhasil sebagai: {cfg['user']}\n")
    return ftp

def ensure_remote_dir(ftp, remote_path):
    dirs = [d for d in remote_path.split("/") if d]
    current = "/"
    for d in dirs:
        current = current.rstrip("/") + "/" + d
        try:
            ftp.cwd(current)
        except ftplib.error_perm:
            try:
                ftp.mkd(current)
            except Exception:
                pass
    ftp.cwd("/")

def upload_file(ftp, local_path, remote_path):
    remote_dir = os.path.dirname(remote_path)
    ensure_remote_dir(ftp, remote_dir)
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_path}", f)

def upload_tree(ftp, local_dir, remote_base_dir):
    count = 0
    for root, dirs, files in os.walk(local_dir):
        # Lewati direktori yang tidak perlu di-upload
        if any(skip in root for skip in ["node_modules", ".git", "tests"]):
            continue
        rel_dir = os.path.relpath(root, local_dir)
        if rel_dir == ".":
            remote_dir = remote_base_dir
        else:
            remote_dir = remote_base_dir.rstrip("/") + "/" + rel_dir.replace("\\", "/")
        
        ensure_remote_dir(ftp, remote_dir)
        for f in files:
            if f.startswith(".DS_Store"):
                continue
            local_file = os.path.join(root, f)
            remote_file = remote_dir.rstrip("/") + "/" + f
            try:
                with open(local_file, "rb") as fp:
                    ftp.storbinary(f"STOR {remote_file}", fp)
                count += 1
                print(f"  [↑] {remote_file}")
            except Exception as e:
                print(f"  [✗] Gagal upload {remote_file}: {e}")
    return count

def main():
    start_time = time.time()
    cfg = load_ftp_config()
    ftp = get_ftp(cfg)

    # 1. Pastikan file .htaccess ada di frontend/dist
    frontend_htaccess = """# Apache configuration for React Router SPA
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
"""
    with open(os.path.join(FRONTEND_DIST, ".htaccess"), "w") as f:
        f.write(frontend_htaccess)

    # 2. Upload Frontend ke /frontend dan /frontend/dist
    print("📦 [1/2] Mengunggah Frontend (React Build) ke server...")
    fe_count = upload_tree(ftp, FRONTEND_DIST, "/frontend")
    upload_tree(ftp, FRONTEND_DIST, "/frontend/dist")
    print(f"✅ {fe_count} berkas frontend berhasil diunggah!\n")

    # 3. Upload Backend ke /backend
    print("⚙️  [2/2] Mengunggah Backend (CodeIgniter 4) ke server...")
    local_backend_app = os.path.join(BACKEND_DIR, "app")
    app_count = upload_tree(ftp, local_backend_app, "/backend/app")

    # Upload uploads & .htaccess jika ada
    local_uploads = os.path.join(BACKEND_DIR, "public", "uploads")
    if os.path.exists(local_uploads):
        upload_tree(ftp, local_uploads, "/backend/public/uploads")

    local_be_htaccess = os.path.join(BACKEND_DIR, "public", ".htaccess")
    if os.path.exists(local_be_htaccess):
        upload_file(ftp, local_be_htaccess, "/backend/public/.htaccess")

    db_sql = os.path.join(BACKEND_DIR, "database_setup_complete.sql")
    if os.path.exists(db_sql):
        upload_file(ftp, db_sql, "/backend/database_setup_complete.sql")

    print(f"✅ {app_count} berkas backend berhasil diunggah!\n")
    ftp.quit()

    elapsed = round(time.time() - start_time, 2)
    print("==================================================")
    print(f"🎉 DEPLOY SELESAI DALAM {elapsed} DETIK!")
    print("🌐 Frontend: https://theweddingofdimasdevi.my.id/")
    print("🔒 Admin:    https://theweddingofdimasdevi.my.id/admin/login")
    print("🔌 API:      https://admin.theweddingofdimasdevi.my.id/api/settings")
    print("==================================================")

if __name__ == "__main__":
    main()
