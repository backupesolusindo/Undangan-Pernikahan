<?php
$titles = ['gallery' => 'Foto Galeri', 'stories' => 'Kisah Cinta', 'couple' => 'Mempelai (We Are Wedding)'];
$title = $titles[$type] ?? 'Aset';
$isEdit = ! empty($item);
$action = $isEdit ? base_url("admin/aset/update/{$type}/" . $item['id']) : base_url("admin/aset/store/{$type}");
$back = base_url('admin/aset?tab=' . $type);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $isEdit ? 'Edit' : 'Tambah' ?> <?= esc($title) ?> - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>body{background-color:#f4f6f9;}.preview{max-width:100%;max-height:250px;border-radius:10px;object-fit:cover;}</style>
</head>
<body>
<?= $this->include('admin/_navbar') ?>
<div class="container px-4 pb-5" style="max-width:600px;">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0"><?= $isEdit ? 'Edit' : 'Tambah' ?> <?= esc($title) ?></h2>
        <a href="<?= $back ?>" class="btn btn-outline-secondary btn-sm"><i class="fas fa-arrow-left me-1"></i>Kembali</a>
    </div>
    <div class="card shadow"><div class="card-body p-4">
        <form method="POST" enctype="multipart/form-data" action="<?= $action ?>">
            <?php if ($type === 'gallery'): ?>
            <div class="mb-3"><label class="form-label fw-bold">Caption</label>
                <input type="text" name="caption" class="form-control" value="<?= old('caption', $item['caption'] ?? '') ?>" placeholder="cth: Busana Adat Jawa"></div>
            <div class="mb-3"><label class="form-label fw-bold">Urutan Tampil</label>
                <input type="number" name="sort_order" class="form-control" value="<?= old('sort_order', $item['sort_order'] ?? 0) ?>" min="0"></div>
            <?php endif; ?>

            <?php if ($type === 'stories'): ?>
            <div class="row"><div class="col-md-4 mb-3"><label class="form-label fw-bold">Tahun</label>
                <input type="text" name="year" class="form-control" value="<?= old('year', $item['year'] ?? '') ?>" placeholder="2021"></div>
            <div class="col-md-8 mb-3"><label class="form-label fw-bold">Judul *</label>
                <input type="text" name="title" class="form-control" required value="<?= old('title', $item['title'] ?? '') ?>" placeholder="Pertama Bertemu"></div></div>
            <div class="mb-3"><label class="form-label fw-bold">Deskripsi</label>
                <textarea name="description" class="form-control" rows="3"><?= old('description', $item['description'] ?? '') ?></textarea></div>
            <div class="mb-3"><label class="form-label fw-bold">Urutan Tampil</label>
                <input type="number" name="sort_order" class="form-control" value="<?= old('sort_order', $item['sort_order'] ?? 0) ?>" min="0"></div>
            <?php endif; ?>

            <?php if ($type === 'couple'): ?>
            <div class="mb-3"><label class="form-label fw-bold">Peran *</label>
                <select name="role" class="form-select" required>
                    <option value="bride" <?= old('role', $item['role'] ?? '') === 'bride' ? 'selected' : '' ?>>Bride (Mempelai Wanita)</option>
                    <option value="groom" <?= old('role', $item['role'] ?? '') === 'groom' ? 'selected' : '' ?>>Groom (Mempelai Pria)</option>
                </select></div>
            <div class="row"><div class="col-md-6 mb-3"><label class="form-label fw-bold">Nama Panggilan</label>
                <input type="text" name="nickname" class="form-control" value="<?= old('nickname', $item['nickname'] ?? '') ?>" placeholder="Juwita"></div>
            <div class="col-md-6 mb-3"><label class="form-label fw-bold">Instagram</label>
                <input type="text" name="instagram" class="form-control" value="<?= old('instagram', $item['instagram'] ?? '') ?>" placeholder="@username"></div></div>
            <div class="mb-3"><label class="form-label fw-bold">Nama Lengkap</label>
                <input type="text" name="name" class="form-control" value="<?= old('name', $item['name'] ?? '') ?>" placeholder="Juwita Sukma, S.Pd."></div>
            <div class="row"><div class="col-md-6 mb-3"><label class="form-label fw-bold">Ayah</label>
                <input type="text" name="father" class="form-control" value="<?= old('father', $item['father'] ?? '') ?>"></div>
            <div class="col-md-6 mb-3"><label class="form-label fw-bold">Ibu</label>
                <input type="text" name="mother" class="form-control" value="<?= old('mother', $item['mother'] ?? '') ?>"></div></div>
            <?php endif; ?>

            <div class="mb-3"><label class="form-label fw-bold">Gambar <?= $isEdit ? '(kosongkan jika tidak diganti)' : '(wajib, maks 5MB)' ?></label>
                <input type="file" name="image" class="form-control" accept="image/*" <?= $isEdit ? '' : 'required' ?> onchange="previewImg(event)">
                <?php if ($isEdit && ! empty($item['image_path'])): ?><div class="mt-2"><img src="<?= base_url(esc($item['image_path'])) ?>" id="oldPrev" class="preview" alt="foto lama"></div><?php endif; ?>
                <div class="mt-2"><img id="prev" class="preview d-none" alt="preview"></div></div>
            <div class="d-grid"><button class="btn btn-primary btn-lg"><i class="fas fa-save me-2"></i><?= $isEdit ? 'Update' : 'Simpan' ?></button></div>
        </form>
    </div></div>
</div>
<script>function previewImg(e){const f=e.target.files[0];if(!f)return;const img=document.getElementById('prev');img.src=URL.createObjectURL(f);img.classList.remove('d-none');const o=document.getElementById('oldPrev');if(o)o.classList.add('d-none');}</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
