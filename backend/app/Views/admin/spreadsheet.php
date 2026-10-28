<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Data Tamu Undangan - Web Spreadsheet</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .spreadsheet-container { background: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        
        /* Styled Spreadsheet Table */
        .table-spreadsheet { border-collapse: collapse; width: 100%; font-size: 0.95rem; }
        .table-spreadsheet th, .table-spreadsheet td { border: 1px solid #dcdfe3; padding: 10px 14px; }
        .table-spreadsheet th { background-color: #107c41; color: #ffffff; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
        .table-spreadsheet tr:nth-child(even) { background-color: #f9fbf9; }
        .table-spreadsheet tr:hover { background-color: #e8f5e9; }
        .table-spreadsheet tfoot { background-color: #eef2f5; font-weight: bold; border-top: 2px solid #107c41; }
    </style>
</head>
<body class="py-4">

    <div class="container-fluid px-4">
        
        <!-- Action Header Bar -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div class="d-flex align-items-center gap-2">
                <a href="<?= base_url('admin') ?>" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left me-1"></i> Kembali ke Dashboard
                </a>
                <span class="badge bg-success py-2 px-3"><i class="fas fa-table me-1"></i> Tampilan Web Spreadsheet</span>
            </div>
            <div class="d-flex align-items-center flex-wrap gap-2">
                <button onclick="copyTableToClipboard()" class="btn btn-outline-secondary" title="Salin seluruh data tabel ke clipboard">
                    <i class="fas fa-copy me-1"></i> Salin Tabel
                </button>
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#googleSheetsModal" title="Integrasi Webhook Otomatis ke File Spreadsheet Lama">
                    <i class="fas fa-cog me-1"></i> Pengaturan Webhook
                </button>
                <button onclick="copyAndOpenGoogleSheets()" class="btn btn-success fw-bold shadow-sm" title="Otomatis salin data & buka Google Sheets baru">
                    <i class="fab fa-google-drive me-1"></i> ⚡ Buat Google Sheet Baru (1-Klik)
                </button>
            </div>
        </div>

        <?php if(session()->getFlashdata('success')): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i><?= session()->getFlashdata('success') ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <?php if(session()->getFlashdata('error')): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i><?= session()->getFlashdata('error') ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <!-- Spreadsheet Container -->
        <div class="spreadsheet-container">
            
            <!-- Header Title -->
            <div class="text-center mb-4">
                <h3 class="fw-bold text-success mb-1"><i class="fas fa-file-spreadsheet me-2"></i>LAPORAN DATA TAMU UNDANGAN</h3>
                <p class="text-muted mb-0">Diperbarui pada: <?= date('d F Y, H:i') ?> WIB</p>
            </div>

            <!-- Summary Cards / Stats -->
            <div class="row g-3 mb-4 text-center">
                <div class="col-12 col-md-4">
                    <div class="p-3 border rounded bg-light">
                        <small class="text-muted d-block text-uppercase fw-bold">Total Respon</small>
                        <span class="h4 fw-bold text-dark"><?= $stats['total_guests'] ?></span>
                    </div>
                </div>
                <div class="col-6 col-md-4">
                    <div class="p-3 border rounded bg-success bg-opacity-10">
                        <small class="text-success d-block text-uppercase fw-bold">Hadir</small>
                        <span class="h4 fw-bold text-success"><?= $stats['hadir'] ?></span>
                    </div>
                </div>
                <div class="col-6 col-md-4">
                    <div class="p-3 border rounded bg-danger bg-opacity-10">
                        <small class="text-danger d-block text-uppercase fw-bold">Tidak Hadir</small>
                        <span class="h4 fw-bold text-danger"><?= $stats['tidak_hadir'] ?></span>
                    </div>
                </div>
            </div>

            <!-- Main Table -->
            <div class="table-responsive">
                <table class="table-spreadsheet" id="tamuTable">
                    <thead>
                        <tr>
                            <th style="width: 50px;" class="text-center">No</th>
                            <th>Nama Lengkap</th>
                            <th>No. Telepon</th>
                            <th class="text-center">Kehadiran</th>
                            <th class="text-center">Jumlah Tamu</th>
                            <th>Pesan / Ucapan</th>
                            <th>Waktu RSVP</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($guests as $index => $guest): ?>
                        <tr>
                            <td class="text-center"><?= $index + 1 ?></td>
                            <td class="fw-bold"><?= esc($guest['name']) ?></td>
                            <td><?= esc($guest['phone']) ?></td>
                            <td class="text-center">
                                <?php if ($guest['status'] === 'Hadir'): ?>
                                    <span class="badge bg-success">Hadir</span>
                                <?php else: ?>
                                    <span class="badge bg-danger">Tidak Hadir</span>
                                <?php endif; ?>
                            </td>
                            <td class="text-center fw-bold"><?= esc($guest['guest_count']) ?> Orang</td>
                            <td><?= esc($guest['message']) ?: '-' ?></td>
                            <td><small><?= date('d M Y, H:i', strtotime($guest['created_at'])) ?></small></td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if (count($guests) === 0): ?>
                        <tr>
                            <td colspan="7" class="text-center py-4 text-muted">Belum ada data tamu.</td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" class="text-end">TOTAL KESELURUHAN JUMLAH TAMU (JIWA):</td>
                            <td class="text-center text-success h5 mb-0 fw-bold"><?= $stats['total_person'] ?> Orang</td>
                            <td colspan="2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </div>

    </div>

    <!-- Alert Copy Toast / Message -->
    <div class="position-fixed bottom-0 end-0 p-3 no-print" style="z-index: 9999">
        <div id="copyToast" class="toast align-items-center text-white bg-dark border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="7000">
            <div class="d-flex p-2">
                <div class="toast-body">
                    <div class="fw-bold text-success mb-1"><i class="fas fa-check-circle me-1"></i> Data Tabel Berhasil Disalin!</div>
                    <div class="small">Di tab Google Sheets yang baru terbuka, klik di sel <strong>A1</strong> lalu tekan <span class="badge bg-light text-dark fw-bold">Ctrl + V</span> (Paste).</div>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>

    <!-- Modal Google Sheets Webhook -->
    <div class="modal fade" id="googleSheetsModal" tabindex="-1" aria-labelledby="googleSheetsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form action="<?= base_url('admin/sync-google-sheets') ?>" method="POST">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title fw-bold" id="googleSheetsModalLabel">
                            <i class="fab fa-google-drive me-2"></i>1-Klik Kirim / Sync ke Google Sheets
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label fw-bold">URL Webhook Google Apps Script</label>
                            <input type="url" name="webhook_url" class="form-control" value="<?= esc($webhookUrl ?? '') ?>" placeholder="https://script.google.com/macros/s/.../exec" required>
                            <small class="text-muted">URL Webhook ini akan disimpan otomatis di sistem Anda.</small>
                        </div>

                        <div class="accordion" id="scriptGuide">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed fw-bold text-success" type="button" data-bs-toggle="collapse" data-bs-target="#collapseScript">
                                        <i class="fas fa-code me-2"></i>Panduan Cara Mendapatkan URL Webhook (1 Menit)
                                    </button>
                                </h2>
                                <div id="collapseScript" class="accordion-collapse collapse" data-bs-parent="#scriptGuide">
                                    <div class="accordion-body small">
                                        <ol class="mb-2">
                                            <li>Buka file <strong>Google Sheets</strong> Anda di browser.</li>
                                            <li>Klik menu <strong>Extensions (Ekstensi) &rarr; Apps Script</strong>.</li>
                                            <li>Hapus semua kode lama dan tempelkan (Paste) kode berikut:</li>
                                        </ol>
                                        <pre class="bg-dark text-light p-3 rounded" style="font-size: 0.8rem;">
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (data.action === "sync") {
    sheet.clear();
    sheet.appendRow(["No", "Nama", "No. Telepon", "Kehadiran", "Jumlah Tamu", "Pesan", "Waktu"]);
    data.guests.forEach(function(g) {
      sheet.appendRow([g.no, g.name, g.phone, g.status, g.guest_count, g.message, g.created_at]);
    });
    return ContentService.createTextOutput(JSON.stringify({result: "success"}))
           .setMimeType(ContentService.MimeType.JSON);
  }
}
</pre>
                                        <ol start="4" class="mb-0">
                                            <li>Klik <strong>Deploy (Terapkan) &rarr; New deployment (Terapkan baru)</strong>.</li>
                                            <li>Pilih jenis <strong>Web app (Aplikasi web)</strong>.</li>
                                            <li>Pada <em>Who has access (Siapa yang memiliki akses)</em>, pilih <strong>Anyone (Siapa saja)</strong>.</li>
                                            <li>Klik <strong>Deploy</strong>, izinkan akses, lalu salin <strong>Web App URL</strong> yang muncul dan masukkan ke kolom di atas.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-success fw-bold">
                            <i class="fas fa-paper-plane me-1"></i> Kirim Data Sekarang (1-Klik)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function getTableTSV() {
            var table = document.getElementById('tamuTable');
            var rows = table.querySelectorAll('tr');
            var tsv = [];
            rows.forEach(function(row) {
                var cols = row.querySelectorAll('th, td');
                var rowData = [];
                cols.forEach(function(col) {
                    var text = col.innerText.replace(/(\r\n|\n|\r)/gm, " ").trim();
                    rowData.push(text);
                });
                tsv.push(rowData.join("\t"));
            });
            return tsv.join("\n");
        }

        async function copyDataToClipboard() {
            var tsvData = getTableTSV();
            var table = document.getElementById('tamuTable');

            try {
                if (navigator.clipboard && window.ClipboardItem) {
                    var blobHtml = new Blob([table.outerHTML], { type: 'text/html' });
                    var blobText = new Blob([tsvData], { type: 'text/plain' });
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'text/html': blobHtml,
                            'text/plain': blobText
                        })
                    ]);
                } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(tsvData);
                } else {
                    throw new Error('Clipboard API not supported');
                }
            } catch (err) {
                // Fallback execCommand
                var range = document.createRange();
                range.selectNode(table);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
            }
        }

        async function copyAndOpenGoogleSheets() {
            await copyDataToClipboard();
            window.open('https://sheets.new', '_blank');

            var toastEl = document.getElementById('copyToast');
            var toast = new bootstrap.Toast(toastEl);
            toast.show();
        }

        async function copyTableToClipboard() {
            await copyDataToClipboard();

            var toastEl = document.getElementById('copyToast');
            var toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    </script>
</body>
</html>
