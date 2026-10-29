// Server hosting menolak berkas audio/video, jadi media disimpan di repo Git
// dan disajikan lewat CDN jsDelivr. Script ini menyalin berkas ke
// frontend/public/assets, commit + push, lalu mencetak link CDN-nya.
//
// Pemakaian: npm run media -- <berkas> [berkas lain...]
//            npm run media            (tampilkan link media yang sudah ada)

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT_DIR, "frontend", "public", "assets");
const REPO = "backupesolusindo/Undangan-Pernikahan";
const BRANCH = "main";
const MEDIA_EXT = new Set([".mp3", ".wav", ".m4a", ".ogg", ".mp4", ".webm", ".mov"]);
const MAX_SIZE = 20 * 1024 * 1024; // Batas berkas GitHub di jsDelivr

function git(...args) {
  return execFileSync("git", args, { cwd: ROOT_DIR, encoding: "utf-8" }).trim();
}

function cdnUrl(ref, name) {
  return `https://cdn.jsdelivr.net/gh/${REPO}@${ref}/frontend/public/assets/${encodeURIComponent(name)}`;
}

function printLinks(names, sha) {
  console.log("\n🔗 Link CDN (tempel ke kolom URL Audio/Video di panel admin):");
  for (const name of names) {
    console.log(`\n  ${name}`);
    console.log(`    Permanen : ${cdnUrl(sha, name)}`);
    console.log(`    @${BRANCH}    : ${cdnUrl(BRANCH, name)}`);
  }
  console.log("\nℹ️  Link @<commit> langsung aktif & tidak terkena cache lama.");
  console.log(`   Link @${BRANCH} bisa butuh hingga 12 jam untuk ikut berubah bila berkas ditimpa dengan nama sama.`);
}

function main() {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    const names = fs.readdirSync(ASSETS_DIR).filter((n) => MEDIA_EXT.has(path.extname(n).toLowerCase()));
    printLinks(names, git("rev-parse", `origin/${BRANCH}`));
    return;
  }

  const names = [];
  for (const file of files) {
    const src = path.resolve(file);
    const name = path.basename(src).replace(/\s+/g, "_");
    const ext = path.extname(name).toLowerCase();

    if (!fs.existsSync(src)) throw new Error(`Berkas tidak ditemukan: ${file}`);
    if (!MEDIA_EXT.has(ext)) throw new Error(`${name}: bukan berkas audio/video (${[...MEDIA_EXT].join(", ")}).`);
    const size = fs.statSync(src).size;
    if (size > MAX_SIZE) {
      throw new Error(`${name}: ${(size / 1048576).toFixed(1)}MB melebihi batas 20MB jsDelivr. Kompres dulu.`);
    }

    const dest = path.join(ASSETS_DIR, name);
    if (src !== dest) fs.copyFileSync(src, dest);
    names.push(name);
    console.log(`  [+] frontend/public/assets/${name}`);
  }

  git("add", "--", ...names.map((n) => path.join("frontend", "public", "assets", n)));
  if (git("diff", "--cached", "--name-only")) {
    git("commit", "-m", `chore(media): add ${names.join(", ")}`, "--", ...names.map((n) => path.join("frontend", "public", "assets", n)));
  } else {
    console.log("ℹ️  Berkas tidak berubah, tidak ada commit baru.");
  }

  console.log(`📤 Push ke origin/${BRANCH}...`);
  execFileSync("git", ["push", "origin", `HEAD:${BRANCH}`], { cwd: ROOT_DIR, stdio: "inherit" });

  printLinks(names, git("rev-parse", "HEAD"));
}

try {
  main();
} catch (err) {
  console.error(`❌ ${err.message}`);
  process.exit(1);
}
