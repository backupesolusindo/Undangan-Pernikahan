<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asset Tampilan - Admin Undangan</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body{background-color:#f4f6f9;}
        .thumb{width:80px;height:80px;object-fit:cover;border-radius:10px;}
        .thumb-tall{width:64px;height:84px;object-fit:cover;border-radius:10px;}
        .nav-pills .nav-link{color:#2c3e50;font-weight:600;}
        .nav-pills .nav-link.active{background-color:#2c3e50;}
    </style>
</head>
<body>
<?= $this->include('admin/_navbar') ?>
<div class="container-fluid px-4 pb-5">
    <div class="d-flex justify-content-between align-items-center mb-1">
        <h2 class="h3 mb-0"><i class="fas fa-photo-film me-2 text-primary"></i>Asset Tampilan</h2>
    </div>
    <p class="text-muted mb-4">Satu menu untuk <b>Galeri Foto</b>, <b>Kisah Cinta Kami</b>, dan <b>We Are Wedding</b> yang tampil di undangan React.</p>

    <?php if (! empty($dbError)): ?>
    <div class="alert alert-danger shadow-sm">
        <i class="fas fa-database me-2"></i><b>Database bermasalah:</b> <?= esc($dbError) ?>
        <div class="mt-2 small">Pastikan MySQL berjalan (Laragon/XAMPP → Start), database <code>undangan_db</code> ada, lalu jalankan <code>php spark migrate --all</code>. Halaman ini otomatis membuat tabel yang belum ada saat database sudah bisa diakses.</div>
    </div>
    <?php endif; ?>

    <ul class="nav nav-pills gap-2 mb-4" role="tablist">
        <li class="nav-item" role="presentation">
            <a class="nav-link <?= $tab === 'gallery' ? 'active' : '' ?>" href="<?= base_url('admin/aset?tab=gallery') ?>"><i class="fas fa-images me-1"></i>Galeri Foto <span class="badge <?= $tab === 'gallery' ? 'bg-light text-dark' : 'bg-secondary' ?>"><?= count($galleries) ?></span></a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link <?= $tab === 'stories' ? 'active' : '' ?>" href="<?= base_url('admin/aset?tab=stories') ?>"><i class="fas fa-book-open me-1"></i>Kisah Cinta <span class="badge <?= $tab === 'stories' ? 'bg-light text-dark' : 'bg-secondary' ?>"><?= count($stories) ?></span></a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link <?= $tab === 'couple' ? 'active' : '' ?>" href="<?= base_url('admin/aset?tab=couple') ?>"><i class="fas fa-heart me-1"></i>We Are Wedding <span class="badge <?= $tab === 'couple' ? 'bg-light text-dark' : 'bg-secondary' ?>"><?= count($couples) ?></span></a>
        </li>
    </ul>

    <?php if ($tab === 'gallery'): ?>
    <div class="card shadow">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <b><i class="fas fa-images me-2 text-primary"></i>Daftar Foto Galeri</b>
            <a href="<?= base_url('admin/aset/create/gallery') ?>" class="btn btn-primary btn-sm"><i class="fas fa-plus me-1"></i>Tambah Foto</a>
        </div>
        <div class="card-body p-0"><div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light"><tr><th class="ps-4">No</th><th>Foto</th><th>Caption</th><th>Urutan</th><th class="text-center pe-4">Aksi</th></tr></thead>
                <tbody>
                <?php foreach ($galleries as $i => $it): ?>
                <tr>
                    <td class="ps-4"><?= $i + 1 ?></td>
                    <td><img src="<?= base_url(esc($it['image_path'] ?? '')) ?>" class="thumb" alt="galeri" onerror="this.src='https://via.placeholder.com/80'"></td>
                    <td class="fw-bold"><?= esc($it['caption'] ?? '-') ?></td>
                    <td><span class="badge bg-secondary"><?= esc($it['sort_order'] ?? 0) ?></span></td>
                    <td class="text-center pe-4 text-nowrap">
                        <a href="<?= base_url('admin/aset/edit/gallery/' . $it['id']) ?>" class="btn btn-sm btn-info text-white"><i class="fas fa-edit"></i> Edit</a>
                        <a href="<?= base_url('admin/aset/delete/gallery/' . $it['id']) ?>" class="btn btn-sm btn-danger" onclick="return confirm('Hapus foto ini?')"><i class="fas fa-trash"></i> Hapus</a>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php if (empty($galleries)): ?><tr><td colspan="5" class="text-center py-5 text-muted">Belum ada foto. Klik "Tambah Foto".</td></tr><?php endif; ?>
                </tbody>
            </table>
        </div></div>
    </div>
    <?php endif; ?>

    <?php if ($tab === 'stories'): ?>
    <div class="card shadow">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <b><i class="fas fa-book-open me-2 text-primary"></i>Daftar Kisah Cinta Kami</b>
            <a href="<?= base_url('admin/aset/create/stories') ?>" class="btn btn-primary btn-sm"><i class="fas fa-plus me-1"></i>Tambah Kisah</a>
        </div>
        <div class="card-body p-0"><div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light"><tr><th class="ps-4">No</th><th>Foto</th><th>Tahun</th><th>Judul</th><th>Deskripsi</th><th>Urutan</th><th class="text-center pe-4">Aksi</th></tr></thead>
                <tbody>
                <?php foreach ($stories as $i => $it): ?>
                <tr>
                    <td class="ps-4"><?= $i + 1 ?></td>
                    <td><img src="<?= base_url(esc($it['image_path'] ?? '')) ?>" class="thumb" alt="kisah" onerror="this.src='https://via.placeholder.com/80'"></td>
                    <td><span class="badge bg-warning text-dark"><?= esc($it['year'] ?? '-') ?></span></td>
                    <td class="fw-bold"><?= esc($it['title'] ?? '-') ?></td>
                    <td><small><?= esc(mb_strimwidth((string) ($it['description'] ?? ''), 0, 80, '...')) ?></small></td>
                    <td><span class="badge bg-secondary"><?= esc($it['sort_order'] ?? 0) ?></span></td>
                    <td class="text-center pe-4 text-nowrap">
                        <a href="<?= base_url('admin/aset/edit/stories/' . $it['id']) ?>" class="btn btn-sm btn-info text-white"><i class="fas fa-edit"></i></a>
                        <a href="<?= base_url('admin/aset/delete/stories/' . $it['id']) ?>" class="btn btn-sm btn-danger" onclick="return confirm('Hapus kisah ini?')"><i class="fas fa-trash"></i></a>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php if (empty($stories)): ?><tr><td colspan="7" class="text-center py-5 text-muted">Belum ada kisah. Klik "Tambah Kisah".</td></tr><?php endif; ?>
                </tbody>
            </table>
        </div></div>
    </div>
    <?php endif; ?>

    <?php if ($tab === 'couple'): ?>
    <div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>Isi 2 data: 1 <b>bride</b> (mempelai wanita) &amp; 1 <b>groom</b> (mempelai pria). Tampil di bagian "We Are Getting Married".</div>
    <div class="card shadow">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <b><i class="fas fa-heart me-2 text-danger"></i>Data Mempelai (We Are Wedding)</b>
            <a href="<?= base_url('admin/aset/create/couple') ?>" class="btn btn-primary btn-sm"><i class="fas fa-plus me-1"></i>Tambah Mempelai</a>
        </div>
        <div class="card-body p-0"><div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light"><tr><th class="ps-4">Foto</th><th>Peran</th><th>Panggilan / Nama</th><th>Orang Tua</th><th>Instagram</th><th class="text-center pe-4">Aksi</th></tr></thead>
                <tbody>
                <?php foreach ($couples as $it): ?>
                <tr>
                    <td class="ps-4"><img src="<?= base_url(esc($it['image_path'] ?? '')) ?>" class="thumb-tall" alt="mempelai" onerror="this.src='https://via.placeholder.com/64x84'"></td>
                    <td><?= ($it['role'] ?? '') === 'bride' ? '<span class="badge bg-danger">BRIDE</span>' : '<span class="badge bg-primary">GROOM</span>' ?></td>
                    <td class="fw-bold"><?= esc($it['nickname'] ?? '-') ?><br><small class="text-muted"><?= esc($it['name'] ?? '') ?></small></td>
                    <td><small><?= esc($it['father'] ?? '-') ?><br><?= esc($it['mother'] ?? '') ?></small></td>
                    <td><?= esc($it['instagram'] ?? '-') ?></td>
                    <td class="text-center pe-4 text-nowrap">
                        <a href="<?= base_url('admin/aset/edit/couple/' . $it['id']) ?>" class="btn btn-sm btn-info text-white"><i class="fas fa-edit"></i></a>
                        <a href="<?= base_url('admin/aset/delete/couple/' . $it['id']) ?>" class="btn btn-sm btn-danger" onclick="return confirm('Hapus data ini?')"><i class="fas fa-trash"></i></a>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php if (empty($couples)): ?><tr><td colspan="6" class="text-center py-5 text-muted">Belum ada data mempelai.</td></tr><?php endif; ?>
                </tbody>
            </table>
        </div></div>
    </div>
    <?php endif; ?>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
