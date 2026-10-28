<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acara Pernikahan - Admin Undangan</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>body{background-color:#f4f6f9;}</style>
</head>
<body>
<?= $this->include('admin/_navbar') ?>
<div class="container-fluid px-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="h3 mb-1"><i class="fas fa-calendar-alt me-2 text-primary"></i>Kelola Acara Pernikahan</h2>
            <p class="text-muted small mb-0">Atur rangkaian acara pernikahan (Akad, Resepsi, Tasyakuran, dsb) dan peruntukan tamunya.</p>
        </div>
        <a href="<?= base_url('admin/events/create') ?>" class="btn btn-primary shadow-sm"><i class="fas fa-plus me-1"></i>Tambah Acara</a>
    </div>

    <div class="card shadow border-0 rounded-3">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4">No</th>
                            <th>Nama Acara</th>
                            <th>Tanggal & Waktu</th>
                            <th>Lokasi & Alamat</th>
                            <th>Peruntukan Tamu</th>
                            <th>Urutan</th>
                            <th class="text-center pe-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($items as $i => $it): ?>
                    <tr>
                        <td class="ps-4 fw-bold"><?= $i + 1 ?></td>
                        <td>
                            <div class="fw-bold text-dark"><?= esc($it['title']) ?></div>
                            <?php if (!empty($it['maps_url'])): ?>
                                <a href="<?= esc($it['maps_url']) ?>" target="_blank" class="small text-decoration-none text-primary"><i class="fas fa-map-marker-alt me-1"></i>Google Maps</a>
                            <?php endif; ?>
                        </td>
                        <td>
                            <div class="badge bg-info text-dark mb-1"><i class="far fa-calendar me-1"></i><?= esc($it['date_label']) ?></div>
                            <div class="small text-muted"><i class="far fa-clock me-1"></i><?= esc($it['time_label']) ?></div>
                        </td>
                        <td>
                            <div class="fw-semibold text-secondary"><?= esc($it['location']) ?></div>
                            <small class="text-muted d-block text-truncate" style="max-width: 250px;"><?= esc($it['address'] ?: '-') ?></small>
                        </td>
                        <td>
                            <?php if ($it['target_gender'] === 'ALL'): ?>
                                <span class="badge bg-success px-3 py-2"><i class="fas fa-users me-1"></i>Semua Tamu</span>
                            <?php elseif ($it['target_gender'] === 'L'): ?>
                                <span class="badge bg-primary px-3 py-2"><i class="fas fa-mars me-1"></i>Khusus Pria (L)</span>
                            <?php elseif ($it['target_gender'] === 'P'): ?>
                                <span class="badge bg-danger px-3 py-2"><i class="fas fa-venus me-1"></i>Khusus Wanita (P)</span>
                            <?php endif; ?>
                        </td>
                        <td><span class="badge bg-secondary"><?= esc($it['sort_order']) ?></span></td>
                        <td class="text-center pe-4 text-nowrap">
                            <a href="<?= base_url('admin/events/edit/' . $it['id']) ?>" class="btn btn-sm btn-info text-white"><i class="fas fa-edit me-1"></i>Edit</a>
                            <a href="<?= base_url('admin/events/delete/' . $it['id']) ?>" class="btn btn-sm btn-danger" onclick="return confirm('Apakah Anda yakin ingin menghapus acara ini?')"><i class="fas fa-trash me-1"></i>Hapus</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                    <?php if (empty($items)): ?>
                    <tr>
                        <td colspan="7" class="text-center py-5 text-muted">
                            <i class="fas fa-calendar-times fa-3x mb-3 text-secondary"></i>
                            <p class="mb-0">Belum ada acara pernikahan yang ditambahkan. Klik tombol "Tambah Acara" di atas.</p>
                        </td>
                    </tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
