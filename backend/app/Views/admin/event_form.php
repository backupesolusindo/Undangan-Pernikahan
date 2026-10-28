<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($item) ? 'Edit Acara' : 'Tambah Acara' ?> - Admin Undangan</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>body{background-color:#f4f6f9;}</style>
</head>
<body>
<?= $this->include('admin/_navbar') ?>
<div class="container px-4" style="max-width: 800px;">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h3 mb-0"><i class="fas fa-calendar-plus me-2 text-primary"></i><?= isset($item) ? 'Edit Acara Pernikahan' : 'Tambah Acara Pernikahan' ?></h2>
        <a href="<?= base_url('admin/events') ?>" class="btn btn-outline-secondary"><i class="fas fa-arrow-left me-1"></i>Kembali</a>
    </div>

    <div class="card shadow border-0 rounded-3">
        <div class="card-body p-4">
            <form action="<?= isset($item) ? base_url('admin/events/update/' . $item['id']) : base_url('admin/events/store') ?>" method="post">
                <?= csrf_field() ?>

                <div class="row g-3">
                    <div class="col-md-8">
                        <label class="form-label fw-semibold">Nama / Judul Acara <span class="text-danger">*</span></label>
                        <input type="text" name="title" class="form-control" placeholder="Contoh: Akad Nikah, Resepsi, Tasyakuran" value="<?= esc(old('title', $item['title'] ?? '')) ?>" required>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Peruntukan Tamu <span class="text-danger">*</span></label>
                        <select name="target_gender" class="form-select" required>
                            <option value="ALL" <?= (old('target_gender', $item['target_gender'] ?? '') === 'ALL') ? 'selected' : '' ?>>Semua Tamu (Umum)</option>
                            <option value="L" <?= (old('target_gender', $item['target_gender'] ?? '') === 'L') ? 'selected' : '' ?>>Khusus Tamu Pria (L)</option>
                            <option value="P" <?= (old('target_gender', $item['target_gender'] ?? '') === 'P') ? 'selected' : '' ?>>Khusus Tamu Wanita (P)</option>
                        </select>
                        <div class="form-text">Fitur filter jenis kelamin tamu.</div>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Label Tanggal <span class="text-danger">*</span></label>
                        <input type="text" name="date_label" class="form-control" placeholder="Contoh: Sabtu, 12 Oktober 2026" value="<?= esc(old('date_label', $item['date_label'] ?? '')) ?>" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Label Waktu <span class="text-danger">*</span></label>
                        <input type="text" name="time_label" class="form-control" placeholder="Contoh: 08.00 - 10.00 WIB" value="<?= esc(old('time_label', $item['time_label'] ?? '')) ?>" required>
                    </div>

                    <div class="col-md-12">
                        <label class="form-label fw-semibold">Nama Lokasi / Tempat <span class="text-danger">*</span></label>
                        <input type="text" name="location" class="form-control" placeholder="Contoh: Kediaman Mempelai Pria / Masjid Agung / Gedung Serbaguna" value="<?= esc(old('location', $item['location'] ?? '')) ?>" required>
                    </div>

                    <div class="col-md-12">
                        <label class="form-label fw-semibold">Alamat Lengkap</label>
                        <textarea name="address" class="form-control" rows="2" placeholder="Contoh: Jl. Mawar No. 123, Sleman, Yogyakarta"><?= esc(old('address', $item['address'] ?? '')) ?></textarea>
                    </div>

                    <div class="col-md-9">
                        <label class="form-label fw-semibold">Link Google Maps (URL)</label>
                        <input type="url" name="maps_url" class="form-control" placeholder="https://maps.google.com/..." value="<?= esc(old('maps_url', $item['maps_url'] ?? '')) ?>">
                    </div>

                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Urutan Tampil</label>
                        <input type="number" name="sort_order" class="form-control" value="<?= esc(old('sort_order', $item['sort_order'] ?? '0')) ?>">
                    </div>

                    <div class="col-12 mt-4 text-end">
                        <a href="<?= base_url('admin/events') ?>" class="btn btn-secondary me-2">Batal</a>
                        <button type="submit" class="btn btn-success px-4"><i class="fas fa-save me-1"></i>Simpan Acara</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
