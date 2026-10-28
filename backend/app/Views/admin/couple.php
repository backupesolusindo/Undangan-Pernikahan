<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We Are Wedding - Admin Undangan</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>body{background-color:#f4f6f9;}.thumb{width:70px;height:90px;object-fit:cover;border-radius:10px;}</style>
</head>
<body>
<?= $this->include('admin/_navbar') ?>
<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h3 mb-0"><i class="fas fa-heart me-2 text-danger"></i>We Are Wedding (Mempelai)</h2>
        <a href="<?= base_url('admin/couple/create') ?>" class="btn btn-primary shadow-sm"><i class="fas fa-plus me-1"></i>Tambah Mempelai</a>
    </div>
    <div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>Isi 2 data: 1 <b>bride</b> (mempelai wanita) & 1 <b>groom</b> (mempelai pria). Foto tampil di bagian "We Are Getting Married" pada undangan React.</div>
    <div class="card shadow"><div class="card-body p-0"><div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light"><tr><th class="ps-4">Foto</th><th>Peran</th><th>Panggilan / Nama</th><th>Orang Tua</th><th>Instagram</th><th class="text-center pe-4">Aksi</th></tr></thead>
            <tbody>
            <?php foreach ($items as $it): ?>
            <tr>
                <td class="ps-4"><img src="<?= base_url($it['image_path']) ?>" class="thumb" alt="couple" onerror="this.src='https://via.placeholder.com/70x90'"></td>
                <td><?= $it['role'] === 'bride' ? '<span class="badge bg-danger">BRIDE</span>' : '<span class="badge bg-primary">GROOM</span>' ?></td>
                <td class="fw-bold"><?= esc($it['nickname'] ?: '-') ?><br><small class="text-muted"><?= esc($it['name'] ?: '') ?></small></td>
                <td><small><?= esc($it['father'] ?: '-') ?><br><?= esc($it['mother'] ?: '') ?></small></td>
                <td><?= esc($it['instagram'] ?: '-') ?></td>
                <td class="text-center pe-4 text-nowrap">
                    <a href="<?= base_url('admin/couple/edit/' . $it['id']) ?>" class="btn btn-sm btn-info text-white"><i class="fas fa-edit"></i></a>
                    <a href="<?= base_url('admin/couple/delete/' . $it['id']) ?>" class="btn btn-sm btn-danger" onclick="return confirm('Hapus data ini?')"><i class="fas fa-trash"></i></a>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($items)): ?><tr><td colspan="6" class="text-center py-5 text-muted">Belum ada data mempelai.</td></tr><?php endif; ?>
            </tbody>
        </table>
    </div></div></div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
