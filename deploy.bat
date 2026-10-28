@echo off
setlocal enabledelayedexpansion

REM ====================================================================
REM SCRIPT DEPLOY: COMPILE & AUTO-UPLOAD KE CPANEL FTP (WINDOWS BATCH)
REM Undangan Digital Pernikahan (React + CodeIgniter 4)
REM ====================================================================

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

echo ========================================================
echo  MEMULAI BUILD ^& DEPLOY KE SERVER CPANEL (WINDOWS)
echo  Root: %ROOT_DIR%
echo ========================================================

REM 1. PERIKSA & COMPILE FRONTEND DENGAN VITE
echo.
echo [Langkah 1/2] Menyiapkan dan meng-compile Frontend React...
cd /d "%ROOT_DIR%frontend"

REM Cek apakah node_modules dan vite.cmd sudah tersedia di Windows
if not exist "node_modules\.bin\vite.cmd" (
    echo.
    echo [INFO] Dependencies frontend belum terinstall untuk Windows.
    echo [INFO] Menjalankan npm install di folder frontend...
    call npm install
    if !errorlevel! neq 0 (
        echo.
        echo [ERROR] Gagal menjalankan npm install! Pastikan Node.js terinstall.
        cd /d "%ROOT_DIR%"
        pause
        exit /b !errorlevel!
    )
)

echo [INFO] Menjalankan vite build...
call npm run build
if %errorlevel% neq 0 (
    echo [INFO] Mencoba build via npx vite build...
    call npx vite build
    if !errorlevel! neq 0 (
        echo.
        echo [ERROR] Gagal meng-compile Frontend React!
        cd /d "%ROOT_DIR%"
        pause
        exit /b !errorlevel!
    )
)

echo [OK] Frontend berhasil di-compile ke frontend\dist!

REM 2. UPLOAD KE SERVER FTP
echo.
echo [Langkah 2/2] Mengunggah Frontend ^& Backend ke Server FTP...
cd /d "%ROOT_DIR%"

REM Deteksi python atau py launcher
where python >nul 2>nul
if %errorlevel% equ 0 (
    python "%ROOT_DIR%scripts\deploy.py"
) else (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        py "%ROOT_DIR%scripts\deploy.py"
    ) else (
        echo [ERROR] Python tidak ditemukan di sistem! Pastikan Python terinstall dan terdaftar di PATH.
        pause
        exit /b 1
    )
)

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Terjadi kesalahan saat proses upload FTP!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo  Build dan Upload selesai dengan sukses!
echo ========================================================
pause
