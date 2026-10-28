<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Daftar Hadir</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body { background-color: #f4f6f9; }
        .navbar { background-color: #2c3e50; }
        .card { border: none; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .table-hover tbody tr:hover { background-color: #f1f3f5; }
        .action-btns .btn { padding: 0.375rem 0.5rem; }
        .border-left-primary { border-left: 0.25rem solid #4e73df !important; }
        .text-gray-800 { color: #5a5c69 !important; }
    </style>
</head>
<body>
    <?= $this->include('admin/_navbar') ?>

    <div class="container-fluid px-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h3 mb-0 text-gray-800"><i class="fas fa-users me-2"></i>Data Pengunjung Undangan</h2>
            <div>
                <a href="<?= base_url('admin/spreadsheet') ?>" class="btn btn-outline-success shadow-sm me-2" title="Buka tampilan tabel spreadsheet di browser">
                    <i class="fas fa-table me-1"></i> Web Spreadsheet
                </a>
                <a href="<?= base_url('admin/create') ?>" class="btn btn-primary shadow-sm">
                    <i class="fas fa-plus fa-sm text-white-50 me-1"></i> Tambah Data
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs fw-bold text-primary text-uppercase mb-1">
                                    Total Tamu (Kehadiran)
                                </div>
                                <div class="h5 mb-0 fw-bold text-gray-800"><?= count($guests) ?> Data</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-clipboard-list fa-2x text-secondary opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow mb-4">
            <div class="card-header py-3 bg-white d-flex justify-content-between align-items-center">
                <h6 class="m-0 fw-bold text-primary">Tabel Daftar Kehadiran</h6>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" width="100%" cellspacing="0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">No</th>
                                <th>Nama</th>
                                <th>No Telp</th>
                                <th>Kehadiran</th>
                                <th>Jumlah</th>
                                <th>Pesan</th>
                                <th>Waktu</th>
                                <th class="text-center pe-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach($guests as $index => $guest): ?>
                            <tr>
                                <td class="ps-4"><?= $index + 1 ?></td>
                                <td class="fw-bold text-dark"><?= esc($guest['name']) ?></td>
                                <td><?= esc($guest['phone']) ?></td>
                                <td>
                                    <?php if ($guest['status'] === 'Hadir'): ?>
                                        <span class="badge bg-success px-3 py-2">Hadir</span>
                                    <?php else: ?>
                                        <span class="badge bg-danger px-3 py-2">Tidak Hadir</span>
                                    <?php endif; ?>
                                </td>
                                <td><span class="badge bg-secondary"><?= esc($guest['guest_count']) ?></span></td>
                                <td><?= esc($guest['message']) ?: '<em class="text-muted">-</em>' ?></td>
                                <td><small class="text-muted"><?= date('d M Y, H:i', strtotime($guest['created_at'])) ?></small></td>
                                <td class="text-center action-btns pe-4">
                                    <?php
                                        $phone = preg_replace('/[^0-9]/', '', $guest['phone']);
                                        if (strpos($phone, '0') === 0) {
                                            $phone = '62' . substr($phone, 1);
                                        }
                                        $wa_text = urlencode("Terimakasih sudah datang, " . $guest['name'] . "!");
                                        $wa_link = "https://wa.me/{$phone}?text={$wa_text}";
                                    ?>
                                    <div class="btn-group shadow-sm" role="group">
                                        <a href="<?= $wa_link ?>" target="_blank" class="btn btn-success text-white" title="Kirim WA" data-bs-toggle="tooltip">
                                            <i class="fab fa-whatsapp"></i>
                                        </a>
                                        <a href="<?= base_url('admin/edit/'.$guest['id']) ?>" class="btn btn-info text-white" title="Edit Data" data-bs-toggle="tooltip">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="<?= base_url('admin/delete/'.$guest['id']) ?>" class="btn btn-danger text-white" onclick="return confirm('Apakah Anda yakin ingin menghapus data ini?')" title="Hapus Data" data-bs-toggle="tooltip">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            <?php if (count($guests) === 0): ?>
                            <tr>
                                <td colspan="8" class="text-center py-5 text-muted">
                                    <i class="fas fa-inbox fa-3x mb-3 d-block opacity-50"></i>
                                    <p class="mb-0">Belum ada data pengunjung.</p>
                                </td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Enable tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    </script>
</body>
</html>
