#!/usr/bin/env python3
import os
import sys
import ftplib
import time

FTP_HOST = "101.50.1.120"
FTP_PORT = 21
FTP_USER = "weddinginvitation@klinikdokterku.com"
FTP_PASS = "RahasiaWedding"

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

def get_ftp():
    print(f"Connecting to {FTP_HOST}:{FTP_PORT}...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, FTP_PORT, timeout=30)
    ftp.login(FTP_USER, FTP_PASS)
    print("Connected & Logged in successfully!")
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
                print(f"  [MKDIR] Created remote dir: {current}")
            except Exception as e:
                pass
    ftp.cwd("/")

def upload_file(ftp, local_path, remote_path):
    remote_dir = os.path.dirname(remote_path)
    ensure_remote_dir(ftp, remote_dir)
    print(f"  [UPLOAD] {os.path.basename(local_path)} -> {remote_path}")
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_path}", f)

def upload_tree(ftp, local_dir, remote_base_dir):
    for root, dirs, files in os.walk(local_dir):
        # Skip node_modules, .git, etc.
        if "node_modules" in root or ".git" in root or "tests" in root:
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
                print(f"    Uploaded: {remote_file}")
            except Exception as e:
                print(f"    FAILED ({f}): {e}")

def main():
    print("==================================================")
    print("🚀 MULAI PROSES UPLOAD KE CPANEL VIA FTP")
    print("==================================================")
    
    ftp = get_ftp()
    
    # ----------------------------------------------------------------
    # 1. UPLOAD FRONTEND BUILD
    # ----------------------------------------------------------------
    print("\n📦 [1/3] Upload Frontend (Compiled React Build) ke /frontend ...")
    
    # Pastikan .htaccess untuk React SPA di frontend
    frontend_htaccess_content = """# Apache configuration for React Router SPA
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
"""
    local_fe_htaccess = os.path.join(FRONTEND_DIST, ".htaccess")
    with open(local_fe_htaccess, "w") as f:
        f.write(frontend_htaccess_content)
    
    # Upload seluruh isi frontend/dist ke /frontend dan /frontend/dist
    print("Uploading to /frontend ...")
    upload_tree(ftp, FRONTEND_DIST, "/frontend")
    
    print("Uploading to /frontend/dist ...")
    upload_tree(ftp, FRONTEND_DIST, "/frontend/dist")
    
    # ----------------------------------------------------------------
    # 2. UPLOAD BACKEND APP & CONFIG
    # ----------------------------------------------------------------
    print("\n⚙️  [2/3] Upload Backend CodeIgniter (app/ dan database) ke /backend ...")
    
    # Upload backend/app (Controllers, Models, Config, Filters, Migrations, Seeds, Views)
    local_backend_app = os.path.join(BACKEND_DIR, "app")
    print("Uploading /backend/app ...")
    upload_tree(ftp, local_backend_app, "/backend/app")
    
    # Upload database setup complete
    db_sql = os.path.join(BACKEND_DIR, "database_setup_complete.sql")
    if os.path.exists(db_sql):
        upload_file(ftp, db_sql, "/backend/database_setup_complete.sql")
        
    # Upload uploads directory if exists
    local_uploads = os.path.join(BACKEND_DIR, "public", "uploads")
    if os.path.exists(local_uploads):
        print("Uploading /backend/public/uploads ...")
        upload_tree(ftp, local_uploads, "/backend/public/uploads")
        
    # Pastikan .htaccess di backend/public melewatkan Authorization header
    local_be_htaccess = os.path.join(BACKEND_DIR, "public", ".htaccess")
    if os.path.exists(local_be_htaccess):
        upload_file(ftp, local_be_htaccess, "/backend/public/.htaccess")

    # ----------------------------------------------------------------
    # 3. BERSIHKAN FILE SISA DI ROOT (YANG SEBELUMNYA TEREKSTRAK DI /)
    # ----------------------------------------------------------------
    print("\n🧹 [3/3] Membersihkan file sisa all_in_one di root / agar bersih...")
    items_to_clean = [
        "undangan_cpanel_all_in_one.zip",
        "database_setup_complete.sql",
        "favicon.ico",
        "index.html",
        "index.php",
        "robots.txt",
        "spark",
        ".env",
        ".htaccess"
    ]
    for item in items_to_clean:
        try:
            ftp.delete(f"/{item}")
            print(f"  [REMOVED] /{item}")
        except Exception:
            pass

    # Bersihkan folder yang sempat terekstrak di root (jika ada)
    # Catatan: kita tidak menghapus /backend dan /frontend!
    dirs_to_clean = ["app", "vendor", "writable", "assets", "uploads"]
    for d in dirs_to_clean:
        try:
            # Hanya rmdir jika kosong atau biarkan jika cPanel melarang rmdir non-empty
            ftp.rmd(f"/{d}")
            print(f"  [RMDIR] /{d}")
        except Exception:
            pass

    ftp.quit()
    print("\n==================================================")
    print("🎉 SEMUA BERKAS BERHASIL DI-UPLOAD KE SERVER CPANEL!")
    print("==================================================")

if __name__ == "__main__":
    main()
