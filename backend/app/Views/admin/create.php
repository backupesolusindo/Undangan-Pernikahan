<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Data - Dashboard Admin</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body { background-color: #f4f6f9; }
        .navbar { background-color: #2c3e50; }
        .card { border: none; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark mb-4 shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="<?= base_url('admin') ?>">
                <i class="fas fa-envelope-open-text me-2"></i>Admin Undangan
            </a>
        </div>
    </nav>

    <div class="container px-4" style="max-width: 600px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h4 mb-0 text-gray-800"><i class="fas fa-plus-circle me-2 text-primary"></i>Tambah Data Tamu</h2>
            <a href="<?= base_url('admin') ?>" class="btn btn-outline-secondary btn-sm shadow-sm">
                <i class="fas fa-arrow-left me-1"></i> Kembali
            </a>
        </div>

        <div class="card shadow">
            <div class="card-body p-4">
                <?php if(session()->getFlashdata('error')): ?>
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i><?= session()->getFlashdata('error') ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                <?php endif; ?>
                
                <form method="POST" action="<?= base_url('admin/store') ?>">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Nama Lengkap</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light"><i class="fas fa-user"></i></span>
                            <input type="text" name="name" class="form-control" value="<?= old('name') ?>" placeholder="Masukkan nama..." required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">No Telepon</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light"><i class="fas fa-phone"></i></span>
                            <input type="text" name="phone" class="form-control" value="<?= old('phone') ?>" placeholder="Contoh: 08123456789" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Kehadiran</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="fas fa-check-circle"></i></span>
                                <select name="status" class="form-select">
                                    <option value="Hadir" <?= old('status') === 'Hadir' ? 'selected' : '' ?>>Hadir</option>
                                    <option value="Tidak Hadir" <?= old('status') === 'Tidak Hadir' ? 'selected' : '' ?>>Tidak Hadir</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Jumlah Tamu</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="fas fa-users"></i></span>
                                <select name="guest_count" class="form-select">
                                    <?php for($i=1; $i<=10; $i++): ?>
                                    <option value="<?= $i ?>" <?= old('guest_count') == $i ? 'selected' : '' ?>><?= $i ?> Orang</option>
                                    <?php endfor; ?>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="form-label fw-bold">Pesan / Ucapan</label>
                        <textarea name="message" class="form-control" rows="3" placeholder="Tuliskan ucapan..."><?= old('message') ?></textarea>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg shadow-sm">
                            <i class="fas fa-save me-2"></i>Simpan Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
