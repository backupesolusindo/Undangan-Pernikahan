 <?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $status = $_POST['status'] ?? 'Hadir';
    $guest_count = (int)($_POST['guest_count'] ?? 1);
    $message = trim($_POST['message'] ?? '');

    if ($name && $phone) {
        $stmt = $pdo->prepare("INSERT INTO guests (name, phone, status, guest_count, message) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $phone, $status, $guest_count, $message]);
        header("Location: admin.php");
        exit();
    } else {
        $error = "Nama dan Nomor Telepon wajib diisi!";
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Tambah Data Pengunjung</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"], select, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .btn { padding: 10px 15px; background: #27ae60; color: #fff; border: none; border-radius: 4px; cursor: pointer; width: 100%; font-size: 16px; }
        .btn:hover { background: #2ecc71; }
        .error { color: red; margin-bottom: 15px; }
        a { display: inline-block; margin-top: 15px; text-decoration: none; color: #2980b9; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Tambah Data Pengunjung</h2>
        <?php if(isset($error)): ?><div class="error"><?= $error ?></div><?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>No Telepon</label>
                <input type="text" name="phone" required>
            </div>
            <div class="form-group">
                <label>Kehadiran</label>
                <select name="status">
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                    <option value="Ragu-ragu">Ragu-ragu</option>
                </select>
            </div>
            <div class="form-group">
                <label>Jumlah Tamu</label>
                <select name="guest_count">
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3 Orang</option>
                    <option value="4">4 Orang</option>
                </select>
            </div>
            <div class="form-group">
                <label>Pesan / Ucapan</label>
                <textarea name="message" rows="4"></textarea>
            </div>
            <button type="submit" class="btn">Simpan Data</button>
        </form>
        <a href="admin.php">&larr; Kembali ke Dashboard</a>
    </div>
</body>
</html>
