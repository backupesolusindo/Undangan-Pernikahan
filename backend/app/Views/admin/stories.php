<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kisah Cinta Kami - Admin Undangan</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>body{background-color:#f4f6f9;}.thumb{width:90px;height:90px;object-fit:cover;border-radius:8px;}</style>
</head>
<body>
<?= $this->include('admin/_navbar') ?>
<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h3 mb-0"><i class="fas fa-book-open me-2 text-primary"></i>Kisah Cinta Kami</h2>
        <a href="<?= base_url('admin/stories/create') ?>" class="btn btn-primary shadow-sm"><i class="fas fa-plus me-1"></i>Tambah Kisah</a>
    </div>
    <div class="card shadow"><div class="card-body p-0"><div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light"><tr><th class="ps-4">No</th><th>Foto</th><th>Tahun</th><th>Judul</th><th>Deskripsi</th><th>Urutan</th><th class="text-center pe-4">Aksi</th></tr></thead>
            <tbody>
            <?php foreach ($items as $i => $it): ?>
            <tr>
                <td class="ps-4"><?= $i + 1 ?></td>
                <td><img src="<?= base_url($it['image_path']) ?>" class="thumb" alt="story" onerror="this.src='https://via.placeholder.com/90'"></td>
                <td><span class="badge bg-warning text-dark"><?= esc($it['year'] ?: '-') ?></span></td>
                <td class="fw-bold"><?= esc($it['title']) ?></td>
                <td><small><?= esc(mb_strimwidth($it['description'] ?? '', 0, 80, '...')) ?></small></td>
                <td><span class="badge bg-secondary"><?= esc($it['sort_order']) ?></span></td>
                <td class="text-center pe-4 text-nowrap">
                    <a href="<?= base_url('admin/stories/edit/' . $it['id']) ?>" class="btn btn-sm btn-info text-white"><i class="fas fa-edit"></i></a>
                    <a href="<?= base_url('admin/stories/delete/' . $it['id']) ?>" class="btn btn-sm btn-danger" onclick="return confirm('Hapus kisah ini?')"><i class="fas fa-trash"></i></a>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($items)): ?><tr><td colspan="7" class="text-center py-5 text-muted">Belum ada kisah. Klik "Tambah Kisah".</td></tr><?php endif; ?>
            </tbody>
        </table>
    </div></div></div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
