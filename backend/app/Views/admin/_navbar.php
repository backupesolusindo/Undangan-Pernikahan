<nav class="navbar navbar-expand-lg navbar-dark mb-4 shadow-sm" style="background-color:#2c3e50;">
    <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="<?= base_url('admin') ?>">
            <i class="fas fa-envelope-open-text me-2"></i>Admin Undangan
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="adminNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="<?= base_url('admin') ?>"><i class="fas fa-users me-1"></i>Tamu</a></li>
                <li class="nav-item"><a class="nav-link" href="<?= base_url('admin/events') ?>"><i class="fas fa-calendar-alt me-1"></i>Acara Pernikahan</a></li>
                <li class="nav-item"><a class="nav-link" href="<?= base_url('admin/aset') ?>"><i class="fas fa-photo-film me-1"></i>Asset Tampilan</a></li>

            </ul>
        </div>
    </div>
</nav>
<?php if (session()->getFlashdata('success')): ?>
<div class="container-fluid px-4"><div class="alert alert-success alert-dismissible fade show"><i class="fas fa-check-circle me-2"></i><?= esc(session()->getFlashdata('success')) ?><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div></div>
<?php endif; ?>
<?php if (session()->getFlashdata('error')): ?>
<div class="container-fluid px-4"><div class="alert alert-danger alert-dismissible fade show"><i class="fas fa-exclamation-triangle me-2"></i><?= esc(session()->getFlashdata('error')) ?><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div></div>
<?php endif; ?>
