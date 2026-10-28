<?php
require 'db.php';

if (!isset($_GET['id'])) {
    header("Location: admin.php");
    exit();
}

$id = $_GET['id'];
$stmt = $pdo->prepare("SELECT * FROM guests WHERE id = ?");
$stmt->execute([$id]);
$guest = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$guest) {
    header("Location: admin.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $status = $_POST['status'] ?? 'Hadir';
    $guest_count = (int)($_POST['guest_count'] ?? 1);
    $message = trim($_POST['message'] ?? '');

    if ($name && $phone) {
        $updateStmt = $pdo->prepare("UPDATE guests SET name = ?, phone = ?, status = ?, guest_count = ?, message = ? WHERE id = ?");
        $updateStmt->execute([$name, $phone, $status, $guest_count, $message, $id]);
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
    <title>Edit Data Pengunjung</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"], select, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .btn { padding: 10px 15px; background: #2980b9; color: #fff; border: none; border-radius: 4px; cursor: pointer; width: 100%; font-size: 16px; }
        .btn:hover { background: #3498db; }
        .error { color: red; margin-bottom: 15px; }
        a { display: inline-block; margin-top: 15px; text-decoration: none; color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Edit Data Pengunjung</h2>
        <?php if(isset($error)): ?><div class="error"><?= $error ?></div><?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" name="name" value="<?= htmlspecialchars($guest['name']) ?>" required>
            </div>
            <div class="form-group">
                <label>No Telepon</label>
                <input type="text" name="phone" value="<?= htmlspecialchars($guest['phone']) ?>" required>
            </div>
            <div class="form-group">
                <label>Kehadiran</label>
                <select name="status">
                    <option value="Hadir" <?= $guest['status'] === 'Hadir' ? 'selected' : '' ?>>Hadir</option>
                    <option value="Tidak Hadir" <?= $guest['status'] === 'Tidak Hadir' ? 'selected' : '' ?>>Tidak Hadir</option>
                    <option value="Ragu-ragu" <?= $guest['status'] === 'Ragu-ragu' ? 'selected' : '' ?>>Ragu-ragu</option>
                </select>
            </div>
            <div class="form-group">
                <label>Jumlah Tamu</label>
                <select name="guest_count">
                    <?php for($i=1; $i<=10; $i++): ?>
                    <option value="<?= $i ?>" <?= $guest['guest_count'] == $i ? 'selected' : '' ?>><?= $i ?> Orang</option>
                    <?php endfor; ?>
                </select>
            </div>
            <div class="form-group">
                <label>Pesan / Ucapan</label>
                <textarea name="message" rows="4"><?= htmlspecialchars($guest['message']) ?></textarea>
            </div>
            <button type="submit" class="btn">Update Data</button>
        </form>
        <a href="admin.php">&larr; Batal & Kembali</a>
    </div>
</body>
</html>
