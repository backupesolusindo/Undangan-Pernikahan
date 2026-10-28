<?php
require 'db.php';
$stmt = $pdo->query("SELECT * FROM guests ORDER BY created_at DESC");
$guests = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Daftar Hadir</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f4; padding: 20px; }
        table { width: 100%; border-collapse: collapse; background: #fff; margin-top: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
        th { background: #2c3e50; color: #fff; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .container { max-width: 1000px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; }
        .btn { padding: 8px 12px; text-decoration: none; border-radius: 4px; color: white; display: inline-block; font-size: 14px; }
        .btn-add { background-color: #27ae60; }
        .btn-edit { background-color: #2980b9; margin-right: 5px; }
        .btn-delete { background-color: #c0392b; }
        .action-buttons { display: flex; gap: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Data Pengunjung Undangan</h2>
            <div>
                <a href="create.php" class="btn btn-add">+ Tambah Data Manual</a>
                <p style="margin-top: 5px; text-align: right;">Total: <?= count($guests) ?> Tamu</p>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>No Telp</th>
                    <th>Kehadiran</th>
                    <th>Jumlah</th>
                    <th>Pesan</th>
                    <th>Waktu</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($guests as $index => $guest): ?>
                <tr>
                    <td><?= $index + 1 ?></td>
                    <td><?= htmlspecialchars($guest['name']) ?></td>
                    <td><?= htmlspecialchars($guest['phone']) ?></td>
                    <td><?= htmlspecialchars($guest['status']) ?></td>
                    <td><?= htmlspecialchars($guest['guest_count']) ?></td>
                    <td><?= htmlspecialchars($guest['message']) ?></td>
                    <td><?= htmlspecialchars($guest['created_at']) ?></td>
                    <td class="action-buttons">
                        <a href="edit.php?id=<?= $guest['id'] ?>" class="btn btn-edit">Edit</a>
                        <a href="delete.php?id=<?= $guest['id'] ?>" class="btn btn-delete" onclick="return confirm('Apakah Anda yakin ingin menghapus data ini?')">Hapus</a>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php if (count($guests) === 0): ?>
                <tr>
                    <td colspan="8" style="text-align: center;">Belum ada data pengunjung.</td>
                </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
