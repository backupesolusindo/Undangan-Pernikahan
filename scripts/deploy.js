const fs = require("fs");
const path = require("path");
const ftp = require("basic-ftp");

const ROOT_DIR = path.resolve(__dirname, "..");
const SFTP_CONFIG_FILE = path.join(ROOT_DIR, ".vscode", "sftp.json");
const FRONTEND_DIR = path.join(ROOT_DIR, "frontend");
const FRONTEND_DIST = path.join(FRONTEND_DIR, "dist");
const BACKEND_DIR = path.join(ROOT_DIR, "backend");

// Server menolak berkas audio/video; media ini disajikan dari Git via CDN jsDelivr.
const MEDIA_EXT = new Set([".mp3", ".wav", ".m4a", ".ogg", ".mp4", ".webm", ".mov"]);

function loadFtpConfig() {
  if (!fs.existsSync(SFTP_CONFIG_FILE)) {
    console.error(`❌ Error: File ${SFTP_CONFIG_FILE} tidak ditemukan!`);
    process.exit(1);
  }
  try {
    const raw = fs.readFileSync(SFTP_CONFIG_FILE, "utf-8");
    const cfg = JSON.parse(raw);
    return {
      host: cfg.host || "101.50.1.120",
      port: parseInt(cfg.port || 21, 10),
      user: cfg.username || "weddinginvitation@klinikdokterku.com",
      password: cfg.password || "RahasiaWedding",
      secure: false
    };
  } catch (err) {
    console.error(`❌ Error membaca konfigurasi sftp.json: ${err.message}`);
    process.exit(1);
  }
}

async function uploadTree(client, localDir, remoteBaseDir) {
  let count = 0;
  if (!fs.existsSync(localDir)) return count;

  async function walk(currentLocal, currentRemote) {
    const items = fs.readdirSync(currentLocal, { withFileTypes: true });
    for (const item of items) {
      const name = item.name;
      if (name.startsWith(".DS_Store") || name === "node_modules" || name === ".git" || name === "tests") {
        continue;
      }
      if (MEDIA_EXT.has(path.extname(name).toLowerCase())) {
        console.log(`  [-] Lewati media (pakai CDN Git): ${name}`);
        continue;
      }
      const itemLocal = path.join(currentLocal, name);
      const itemRemote = `${currentRemote.replace(/\/+$/, "")}/${name}`;

      if (item.isDirectory()) {
        await client.ensureDir(itemRemote);
        await walk(itemLocal, itemRemote);
      } else if (item.isFile()) {
        try {
          await client.uploadFrom(itemLocal, itemRemote);
          count++;
          console.log(`  [↑] ${itemRemote}`);
        } catch (err) {
          console.warn(`  [✗] Gagal upload ${itemRemote}: ${err.message}`);
        }
      }
    }
  }

  await client.ensureDir(remoteBaseDir);
  await walk(localDir, remoteBaseDir);
  return count;
}

async function uploadSingleFile(client, localFile, remoteFile) {
  if (!fs.existsSync(localFile)) return;
  const remoteDir = path.posix.dirname(remoteFile);
  await client.ensureDir(remoteDir);
  try {
    await client.uploadFrom(localFile, remoteFile);
    console.log(`  [↑] ${remoteFile}`);
  } catch (err) {
    console.warn(`  [✗] Gagal upload ${remoteFile}: ${err.message}`);
  }
}

async function main() {
  const startTime = Date.now();
  const cfg = loadFtpConfig();
  const client = new ftp.Client();
  client.ftp.verbose = false;

  console.log(`📡 Menghubungkan ke FTP ${cfg.host}:${cfg.port}...`);
  try {
    await client.access({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      secure: false
    });
    console.log(`✅ Login berhasil sebagai: ${cfg.user}\n`);

    // 1. Pastikan file .htaccess ada di frontend/dist
    const frontendHtaccess = `# Apache configuration for React Router SPA
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;
    if (!fs.existsSync(FRONTEND_DIST)) {
      fs.mkdirSync(FRONTEND_DIST, { recursive: true });
    }
    fs.writeFileSync(path.join(FRONTEND_DIST, ".htaccess"), frontendHtaccess, "utf-8");

    // 2. Upload Frontend ke /frontend dan /frontend/dist
    console.log("📦 [1/2] Mengunggah Frontend (React Build) ke server...");
    const feCount = await uploadTree(client, FRONTEND_DIST, "/frontend");
    await uploadTree(client, FRONTEND_DIST, "/frontend/dist");
    console.log(`✅ ${feCount} berkas frontend berhasil diunggah!\n`);

    // 3. Upload Backend ke /backend
    console.log("⚙️  [2/2] Mengunggah Backend (CodeIgniter 4) ke server...");
    const localBackendApp = path.join(BACKEND_DIR, "app");
    const appCount = await uploadTree(client, localBackendApp, "/backend/app");

    // Upload uploads & .htaccess jika ada
    const localUploads = path.join(BACKEND_DIR, "public", "uploads");
    if (fs.existsSync(localUploads)) {
      await uploadTree(client, localUploads, "/backend/public/uploads");
    }

    const localBeHtaccess = path.join(BACKEND_DIR, "public", ".htaccess");
    if (fs.existsSync(localBeHtaccess)) {
      await uploadSingleFile(client, localBeHtaccess, "/backend/public/.htaccess");
    }

    const dbSql = path.join(BACKEND_DIR, "database_setup_complete.sql");
    if (fs.existsSync(dbSql)) {
      await uploadSingleFile(client, dbSql, "/backend/database_setup_complete.sql");
    }

    console.log(`✅ ${appCount} berkas backend berhasil diunggah!\n`);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("==================================================");
    console.log(`🎉 DEPLOY SELESAI DALAM ${elapsed} DETIK!`);
    console.log("🌐 Frontend: https://theweddingofdimasdevi.my.id/");
    console.log("🔒 Admin:    https://theweddingofdimasdevi.my.id/admin/login");
    console.log("🔌 API:      https://admin.theweddingofdimasdevi.my.id/api/settings");
    console.log("==================================================");
  } catch (err) {
    console.error(`❌ Terjadi kesalahan saat proses upload FTP: ${err.message}`);
    process.exit(1);
  } finally {
    client.close();
  }
}

main();
