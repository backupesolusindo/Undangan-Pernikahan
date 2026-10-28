<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $item ? 'Edit' : 'Tambah' ?> Mempelai - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>body{background-color:#f4f6f9;}.preview{max-width:200px;max-height:260px;border-radius:14px;object-fit:cover;}</style>
</head>
<body>
<?= $this->include('admin/_navbar') ?>
<div class="container px-4" style="max-width:600px;">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0"><?= $item ? 'Edit Mempelai' : 'Tambah Mempelai' ?></h2>
        <a href="<?= base_url('admin/couple') ?>" class="btn btn-outline-secondary btn-sm"><i class="fas fa-arrow-left me-1"></i>Kembali</a>
    </div>
    <div class="card shadow"><div class="card-body p-4">
        <form method="POST" enctype="multipart/form-data" action="<?= $item ? base_url('admin/couple/update/' . $item['id']) : base_url('admin/couple/store') ?>">
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
            <div class="mb-3"><label class="form-label fw-bold">Foto <?= $item ? '(kosongkan jika tidak diganti)' : '(wajib, maks 5MB)' ?></label>
                <input type="file" name="image" class="form-control" accept="image/*" <?= $item ? '' : 'required' ?> onchange="previewImg(event)">
                <?php if ($item): ?><div class="mt-2"><img src="<?= base_url($item['image_path']) ?>" id="oldPrev" class="preview" alt="foto"></div><?php endif; ?>
                <div class="mt-2"><img id="prev" class="preview d-none" alt="preview"></div></div>
            <div class="d-grid"><button class="btn btn-primary btn-lg"><i class="fas fa-save me-2"></i><?= $item ? 'Update' : 'Simpan' ?></button></div>
        </form>
    </div></div>
</div>
<script>function previewImg(e){const f=e.target.files[0];if(!f)return;const img=document.getElementById('prev');img.src=URL.createObjectURL(f);img.classList.remove('d-none');const o=document.getElementById('oldPrev');if(o)o.classList.add('d-none');}</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
