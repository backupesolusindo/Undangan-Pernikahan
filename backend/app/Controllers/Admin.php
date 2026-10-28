<?php

namespace App\Controllers;

use App\Models\GuestModel;
use App\Models\GalleryModel;
use App\Models\StoryModel;
use App\Models\CoupleModel;
use App\Models\EventModel;

class Admin extends BaseController
{
    protected $guestModel;
    protected $galleryModel;
    protected $storyModel;
    protected $coupleModel;
    protected $eventModel;

    public function __construct()
    {
        $this->guestModel   = new GuestModel();
        $this->galleryModel = new GalleryModel();
        $this->storyModel   = new StoryModel();
        $this->coupleModel  = new CoupleModel();
        $this->eventModel   = new EventModel();
        helper(['form', 'url']);
    }

    // ================= TAMU =================

    public function index()
    {
        $data['guests'] = $this->guestModel->orderBy('created_at', 'DESC')->findAll();
        return view('admin/index', $data);
    }

    public function create()
    {
        return view('admin/create');
    }

    public function store()
    {
        $name  = trim((string) $this->request->getPost('name'));
        $phone = trim((string) $this->request->getPost('phone'));

        if ($name === '' || $phone === '') {
            return redirect()->back()->withInput()->with('error', 'Nama dan Nomor Telepon wajib diisi!');
        }

        $this->guestModel->save([
            'name'        => $name,
            'phone'       => $phone,
            'status'      => $this->request->getPost('status') ?? 'Hadir',
            'guest_count' => (int) ($this->request->getPost('guest_count') ?? 1),
            'message'     => $this->request->getPost('message') ?? '',
        ]);

        return redirect()->to('/admin')->with('success', 'Data tamu berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $guest = $this->guestModel->find($id);
        if (! $guest) {
            return redirect()->to('/admin')->with('error', 'Data tidak ditemukan.');
        }

        $data['guest'] = $guest;
        return view('admin/edit', $data);
    }

    public function update($id)
    {
        $name  = trim((string) $this->request->getPost('name'));
        $phone = trim((string) $this->request->getPost('phone'));

        if ($name === '' || $phone === '') {
            return redirect()->back()->withInput()->with('error', 'Nama dan Nomor Telepon wajib diisi!');
        }

        $this->guestModel->update($id, [
            'name'        => $name,
            'phone'       => $phone,
            'status'      => $this->request->getPost('status') ?? 'Hadir',
            'guest_count' => (int) ($this->request->getPost('guest_count') ?? 1),
            'message'     => $this->request->getPost('message') ?? '',
        ]);

        return redirect()->to('/admin')->with('success', 'Data tamu berhasil diupdate.');
    }

    public function delete($id)
    {
        $this->guestModel->delete($id);
        return redirect()->to('/admin')->with('success', 'Data tamu berhasil dihapus.');
    }

    public function export()
    {
        $guests = $this->guestModel->orderBy('created_at', 'DESC')->findAll();

        $filename = 'daftar_tamu_undangan_' . date('Ymd_His') . '.csv';

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');

        $output = fopen('php://output', 'w');

        // UTF-8 BOM for Microsoft Excel compatibility
        fputs($output, "\xEF\xBB\xBF");

        // Header kolom
        fputcsv($output, ['No', 'Nama', 'No Telepon', 'Kehadiran', 'Jumlah Tamu', 'Pesan / Ucapan', 'Waktu']);

        foreach ($guests as $index => $guest) {
            fputcsv($output, [
                $index + 1,
                $guest['name'],
                "'" . $guest['phone'],
                $guest['status'],
                $guest['guest_count'],
                $guest['message'],
                $guest['created_at'],
            ]);
        }

        fclose($output);
        exit();
    }

    public function spreadsheet()
    {
        $guests = $this->guestModel->orderBy('created_at', 'DESC')->findAll();

        $stats = [
            'total_guests' => count($guests),
            'hadir'        => 0,
            'tidak_hadir'  => 0,
            'total_person' => 0,
        ];

        foreach ($guests as $g) {
            if ($g['status'] === 'Hadir') {
                $stats['hadir']++;
            } elseif ($g['status'] === 'Tidak Hadir') {
                $stats['tidak_hadir']++;
            }
            $stats['total_person'] += (int) $g['guest_count'];
        }

        return view('admin/spreadsheet', [
            'guests'     => $guests,
            'stats'      => $stats,
            'webhookUrl' => env('googleSheets.webhookUrl') ?? '',
        ]);
    }

    public function syncGoogleSheets()
    {
        $webhookUrl = trim((string) ($this->request->getPost('webhook_url') ?? env('googleSheets.webhookUrl')));

        if (empty($webhookUrl)) {
            return redirect()->back()->with('error', 'URL Webhook Google Sheets belum diisi! Silakan masukkan URL Webhook Google Apps Script Anda.');
        }

        if ($this->request->getPost('webhook_url')) {
            $this->updateEnvFile('googleSheets.webhookUrl', $webhookUrl);
        }

        $guests = $this->guestModel->orderBy('created_at', 'ASC')->findAll();

        $formattedGuests = array_map(function ($g, $idx) {
            return [
                'no'          => $idx + 1,
                'name'        => $g['name'],
                'phone'       => "'" . $g['phone'],
                'status'      => $g['status'],
                'guest_count' => (int) $g['guest_count'],
                'message'     => $g['message'] ?: '-',
                'created_at'  => date('d-m-Y H:i', strtotime($g['created_at'])),
            ];
        }, $guests, array_keys($guests));

        try {
            $client = \Config\Services::curlrequest();
            $response = $client->post($webhookUrl, [
                'json' => [
                    'action' => 'sync',
                    'guests' => $formattedGuests,
                ],
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'http_errors' => false,
                'redirect'    => 5,
            ]);

            $statusCode = $response->getStatusCode();
            if ($statusCode >= 200 && $statusCode < 400) {
                return redirect()->back()->with('success', 'Berhasil 1-klik sync! ' . count($guests) . ' data tamu telah otomatis dikirim dan terisi di Google Sheets Anda.');
            }

            return redirect()->back()->with('error', 'Gagal terhubung ke Google Sheets (HTTP Status ' . $statusCode . '). Periksa kembali URL Webhook Anda.');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Gagal mengirim data: ' . $e->getMessage());
        }
    }

    private function updateEnvFile(string $key, string $value): void
    {
        $envPath = ROOTPATH . '.env';
        if (! is_file($envPath)) {
            return;
        }

        $content = file_get_contents($envPath);
        $pattern = '/^' . preg_quote($key, '/') . '=.*$/m';

        if (preg_match($pattern, $content)) {
            $content = preg_replace($pattern, "{$key} = '{$value}'", $content);
        } else {
            $content .= "\n{$key} = '{$value}'";
        }

        file_put_contents($envPath, $content);
    }

    // ================= HELPER UPLOAD =================

    private function uploadDir(): string
    {
        $dir = FCPATH . 'uploads' . DIRECTORY_SEPARATOR;
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * @return string|null relative path (uploads/xxx.jpg) atau null jika gagal + set flash error
     */
    private function handleUpload(string $field, ?string $oldPath = null): ?string
    {
        $file = $this->request->getFile($field);

        if (! $file || $file->getError() === UPLOAD_ERR_NO_FILE) {
            return $oldPath; // tidak ada file baru (mode edit)
        }

        if (! $file->isValid()) {
            session()->setFlashdata('error', 'Upload gagal: ' . $file->getErrorString());
            return '__ERROR__';
        }

        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        $mimes   = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        $ext = strtolower($file->getExtension());
        if (! in_array($ext, $allowed, true)) {
            session()->setFlashdata('error', 'Format file harus gambar (jpg, jpeg, png, webp, gif).');
            return '__ERROR__';
        }

        $mime = strtolower((string) $file->getMimeType());
        if ($mime !== '' && ! in_array($mime, $mimes, true)) {
            session()->setFlashdata('error', 'Isi file (' . $mime . ') tidak cocok dengan ekstensi .' . $ext . '.');
            return '__ERROR__';
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            session()->setFlashdata('error', 'Ukuran gambar maksimal 5MB.');
            return '__ERROR__';
        }

        $newName = $file->getRandomName();
        $file->move($this->uploadDir(), $newName);

        // Hapus file lama jika ada
        if ($oldPath && str_starts_with($oldPath, 'uploads/')) {
            $oldFull = FCPATH . str_replace('/', DIRECTORY_SEPARATOR, $oldPath);
            if (is_file($oldFull)) {
                @unlink($oldFull);
            }
        }

        return 'uploads/' . $newName;
    }

    private function deleteFile(?string $path): void
    {
        if ($path && str_starts_with($path, 'uploads/')) {
            $full = FCPATH . str_replace('/', DIRECTORY_SEPARATOR, $path);
            if (is_file($full)) {
                @unlink($full);
            }
        }
    }

    // ================= ASET TAMPILAN (MENU TUNGGAL) =================
    // Menggabungkan Galeri Foto + Kisah Cinta + We Are Wedding dalam 1 halaman tab.
    // $type: 'gallery' | 'stories' | 'couple'

    private function assetTypes(): array
    {
        return ['gallery', 'stories', 'couple'];
    }

    private function assetModel(string $type)
    {
        return match ($type) {
            'gallery' => $this->galleryModel,
            'stories' => $this->storyModel,
            'couple'  => $this->coupleModel,
            default   => null,
        };
    }

    private function assetTabUrl(string $tab): string
    {
        return site_url('admin/aset') . '?tab=' . $tab;
    }

    /** Buat tabel aset otomatis bila belum ada (anti error "Table not found"). */
    private function ensureAssetTables(): ?string
    {
        try {
            \Config\Services::migrations()->latest();
            return null;
        } catch (\Throwable $e) {
            return $e->getMessage();
        }
    }

    public function aset()
    {
        $tab = $this->request->getGet('tab');
        if (! in_array($tab, $this->assetTypes(), true)) {
            $tab = 'gallery';
        }

        $migrateError = $this->ensureAssetTables();
        $dbError = null;
        $galleries = $stories = $couples = [];

        try {
            $galleries = $this->galleryModel->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll();
            $stories   = $this->storyModel->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll();
            $couples   = $this->coupleModel->orderBy('id', 'ASC')->findAll();
        } catch (\Throwable $e) {
            $dbError = $e->getMessage();
        }

        if ($migrateError && ! $dbError) {
            $dbError = $migrateError;
        }

        return view('admin/aset', [
            'tab'       => $tab,
            'galleries' => $galleries,
            'stories'   => $stories,
            'couples'   => $couples,
            'dbError'   => $dbError,
        ]);
    }

    public function asetCreate(string $type)
    {
        if (! in_array($type, $this->assetTypes(), true)) {
            return redirect()->to($this->assetTabUrl('gallery'))->with('error', 'Tipe aset tidak dikenal.');
        }
        $this->ensureAssetTables();
        return view('admin/aset_form', ['type' => $type, 'item' => null]);
    }

    public function asetStore(string $type)
    {
        if (! in_array($type, $this->assetTypes(), true)) {
            return redirect()->to($this->assetTabUrl('gallery'))->with('error', 'Tipe aset tidak dikenal.');
        }
        $this->ensureAssetTables();
        $model = $this->assetModel($type);

        if ($type === 'gallery') {
            $path = $this->handleUpload('image');
            if ($path === '__ERROR__') {
                return redirect()->back()->withInput();
            }
            if (empty($path)) {
                return redirect()->back()->withInput()->with('error', 'Gambar wajib diupload!');
            }
            try {
                $model->save([
                    'caption'    => trim((string) $this->request->getPost('caption')),
                    'image_path' => $path,
                    'sort_order' => (int) ($this->request->getPost('sort_order') ?? 0),
                ]);
            } catch (\Throwable $e) {
                $this->deleteFile($path);
                return redirect()->back()->withInput()->with('error', 'Gagal menyimpan: ' . $e->getMessage());
            }
            return redirect()->to($this->assetTabUrl('gallery'))->with('success', 'Foto galeri berhasil ditambahkan.');
        }

        if ($type === 'stories') {
            $title = trim((string) $this->request->getPost('title'));
            if ($title === '') {
                return redirect()->back()->withInput()->with('error', 'Judul wajib diisi!');
            }
            $path = $this->handleUpload('image');
            if ($path === '__ERROR__') {
                return redirect()->back()->withInput();
            }
            if (empty($path)) {
                return redirect()->back()->withInput()->with('error', 'Gambar wajib diupload!');
            }
            try {
                $model->save([
                    'year'        => trim((string) $this->request->getPost('year')),
                    'title'       => $title,
                    'description' => $this->request->getPost('description') ?? '',
                    'image_path'  => $path,
                    'sort_order'  => (int) ($this->request->getPost('sort_order') ?? 0),
                ]);
            } catch (\Throwable $e) {
                $this->deleteFile($path);
                return redirect()->back()->withInput()->with('error', 'Gagal menyimpan: ' . $e->getMessage());
            }
            return redirect()->to($this->assetTabUrl('stories'))->with('success', 'Kisah cinta berhasil ditambahkan.');
        }

        // couple
        $role = $this->request->getPost('role');
        if (! in_array($role, ['bride', 'groom'], true)) {
            return redirect()->back()->withInput()->with('error', 'Peran harus bride atau groom!');
        }
        $path = $this->handleUpload('image');
        if ($path === '__ERROR__') {
            return redirect()->back()->withInput();
        }
        if (empty($path)) {
            return redirect()->back()->withInput()->with('error', 'Foto wajib diupload!');
        }
        try {
            $model->save([
                'role'       => $role,
                'nickname'   => trim((string) $this->request->getPost('nickname')),
                'name'       => trim((string) $this->request->getPost('name')),
                'father'     => trim((string) $this->request->getPost('father')),
                'mother'     => trim((string) $this->request->getPost('mother')),
                'instagram'  => trim((string) $this->request->getPost('instagram')),
                'image_path' => $path,
            ]);
        } catch (\Throwable $e) {
            $this->deleteFile($path);
            return redirect()->back()->withInput()->with('error', 'Gagal menyimpan: ' . $e->getMessage());
        }
        return redirect()->to($this->assetTabUrl('couple'))->with('success', 'Data mempelai berhasil ditambahkan.');
    }

    public function asetEdit(string $type, $id)
    {
        if (! in_array($type, $this->assetTypes(), true)) {
            return redirect()->to($this->assetTabUrl('gallery'))->with('error', 'Tipe aset tidak dikenal.');
        }
        $this->ensureAssetTables();
        try {
            $item = $this->assetModel($type)->find($id);
        } catch (\Throwable $e) {
            return redirect()->to($this->assetTabUrl($type))->with('error', 'Database error: ' . $e->getMessage());
        }
        if (! $item) {
            return redirect()->to($this->assetTabUrl($type))->with('error', 'Data tidak ditemukan.');
        }
        return view('admin/aset_form', ['type' => $type, 'item' => $item]);
    }

    public function asetUpdate(string $type, $id)
    {
        if (! in_array($type, $this->assetTypes(), true)) {
            return redirect()->to($this->assetTabUrl('gallery'))->with('error', 'Tipe aset tidak dikenal.');
        }
        $this->ensureAssetTables();
        $model = $this->assetModel($type);
        try {
            $item = $model->find($id);
        } catch (\Throwable $e) {
            return redirect()->to($this->assetTabUrl($type))->with('error', 'Database error: ' . $e->getMessage());
        }
        if (! $item) {
            return redirect()->to($this->assetTabUrl($type))->with('error', 'Data tidak ditemukan.');
        }

        if ($type === 'gallery') {
            $path = $this->handleUpload('image', $item['image_path']);
            if ($path === '__ERROR__') {
                return redirect()->back()->withInput();
            }
            try {
                $model->update($id, [
                    'caption'    => trim((string) $this->request->getPost('caption')),
                    'image_path' => $path,
                    'sort_order' => (int) ($this->request->getPost('sort_order') ?? 0),
                ]);
            } catch (\Throwable $e) {
                return redirect()->back()->withInput()->with('error', 'Gagal mengupdate: ' . $e->getMessage());
            }
            return redirect()->to($this->assetTabUrl('gallery'))->with('success', 'Foto galeri berhasil diupdate.');
        }

        if ($type === 'stories') {
            $title = trim((string) $this->request->getPost('title'));
            if ($title === '') {
                return redirect()->back()->withInput()->with('error', 'Judul wajib diisi!');
            }
            $path = $this->handleUpload('image', $item['image_path']);
            if ($path === '__ERROR__') {
                return redirect()->back()->withInput();
            }
            try {
                $model->update($id, [
                    'year'        => trim((string) $this->request->getPost('year')),
                    'title'       => $title,
                    'description' => $this->request->getPost('description') ?? '',
                    'image_path'  => $path,
                    'sort_order'  => (int) ($this->request->getPost('sort_order') ?? 0),
                ]);
            } catch (\Throwable $e) {
                return redirect()->back()->withInput()->with('error', 'Gagal mengupdate: ' . $e->getMessage());
            }
            return redirect()->to($this->assetTabUrl('stories'))->with('success', 'Kisah cinta berhasil diupdate.');
        }

        $path = $this->handleUpload('image', $item['image_path']);
        if ($path === '__ERROR__') {
            return redirect()->back()->withInput();
        }
        try {
            $model->update($id, [
                'role'       => $this->request->getPost('role') ?? $item['role'],
                'nickname'   => trim((string) $this->request->getPost('nickname')),
                'name'       => trim((string) $this->request->getPost('name')),
                'father'     => trim((string) $this->request->getPost('father')),
                'mother'     => trim((string) $this->request->getPost('mother')),
                'instagram'  => trim((string) $this->request->getPost('instagram')),
                'image_path' => $path,
            ]);
        } catch (\Throwable $e) {
            return redirect()->back()->withInput()->with('error', 'Gagal mengupdate: ' . $e->getMessage());
        }
        return redirect()->to($this->assetTabUrl('couple'))->with('success', 'Data mempelai berhasil diupdate.');
    }

    public function asetDelete(string $type, $id)
    {
        if (! in_array($type, $this->assetTypes(), true)) {
            return redirect()->to($this->assetTabUrl('gallery'))->with('error', 'Tipe aset tidak dikenal.');
        }
        $this->ensureAssetTables();
        try {
            $item = $this->assetModel($type)->find($id);
            if ($item) {
                $this->deleteFile($item['image_path']);
                $this->assetModel($type)->delete($id);
            }
        } catch (\Throwable $e) {
            return redirect()->to($this->assetTabUrl($type))->with('error', 'Database error: ' . $e->getMessage());
        }
        return redirect()->to($this->assetTabUrl($type))->with('success', 'Data berhasil dihapus.');
    }

    // ================= GALERI FOTO (redirect ke menu tunggal) =================

    public function gallery()
    {
        return redirect()->to($this->assetTabUrl('gallery'));
    }

    public function galleryCreate()
    {
        return redirect()->to(site_url('admin/aset/create/gallery'));
    }

    public function galleryStore()
    {
        return $this->asetStore('gallery');
    }

    public function galleryEdit($id)
    {
        return redirect()->to(site_url("admin/aset/edit/gallery/{$id}"));
    }

    public function galleryUpdate($id)
    {
        // Form lama POST ke URL lama: teruskan ke handler tunggal
        return $this->asetUpdate('gallery', $id);
    }

    public function galleryDelete($id)
    {
        return $this->asetDelete('gallery', $id);
    }

    // ================= KISAH CINTA (redirect ke menu tunggal) =================

    public function stories()
    {
        return redirect()->to($this->assetTabUrl('stories'));
    }

    public function storyCreate()
    {
        return redirect()->to(site_url('admin/aset/create/stories'));
    }

    public function storyStore()
    {
        return $this->asetStore('stories');
    }

    public function storyEdit($id)
    {
        return redirect()->to(site_url("admin/aset/edit/stories/{$id}"));
    }

    public function storyUpdate($id)
    {
        return $this->asetUpdate('stories', $id);
    }

    public function storyDelete($id)
    {
        return $this->asetDelete('stories', $id);
    }

    // ================= WE ARE WEDDING (redirect ke menu tunggal) =================

    public function couple()
    {
        return redirect()->to($this->assetTabUrl('couple'));
    }

    public function coupleCreate()
    {
        return redirect()->to(site_url('admin/aset/create/couple'));
    }

    public function coupleStore()
    {
        return $this->asetStore('couple');
    }

    public function coupleEdit($id)
    {
        return redirect()->to(site_url("admin/aset/edit/couple/{$id}"));
    }

    public function coupleUpdate($id)
    {
        return $this->asetUpdate('couple', $id);
    }

    public function coupleDelete($id)
    {
        return $this->asetDelete('couple', $id);
    }

    // ================= ACARA PERNIKAHAN (WEDDING EVENTS) =================
    // Menu dashboard: /admin/events — tambah/edit/hapus acara (Akad, Resepsi, dll).

    private function ensureEventsTable(): ?string
    {
        // Jalankan migrasi terbaru agar tabel `events` otomatis dibuat bila belum ada.
        try {
            \Config\Services::migrations()->latest();
            return null;
        } catch (\Throwable $e) {
            return $e->getMessage();
        }
    }

    private function validateEventInput(): ?string
    {
        $title      = trim((string) $this->request->getPost('title'));
        $dateLabel  = trim((string) $this->request->getPost('date_label'));
        $timeLabel  = trim((string) $this->request->getPost('time_label'));
        $location   = trim((string) $this->request->getPost('location'));
        $target     = $this->request->getPost('target_gender');

        if ($title === '' || $dateLabel === '' || $timeLabel === '' || $location === '') {
            return 'Nama Acara, Label Tanggal, Label Waktu, dan Lokasi wajib diisi!';
        }
        if (! in_array($target, ['ALL', 'L', 'P'], true)) {
            return 'Peruntukan tamu tidak valid (pilih ALL / L / P).';
        }
        return null;
    }

    private function eventPayload(): array
    {
        return [
            'title'         => trim((string) $this->request->getPost('title')),
            'date_label'    => trim((string) $this->request->getPost('date_label')),
            'time_label'    => trim((string) $this->request->getPost('time_label')),
            'location'      => trim((string) $this->request->getPost('location')),
            'address'       => trim((string) $this->request->getPost('address')),
            'maps_url'      => trim((string) $this->request->getPost('maps_url')),
            'target_gender' => $this->request->getPost('target_gender') ?? 'ALL',
            'sort_order'    => (int) ($this->request->getPost('sort_order') ?? 0),
        ];
    }

    public function events()
    {
        $this->ensureEventsTable();
        try {
            $items = $this->eventModel->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll();
        } catch (\Throwable $e) {
            return view('admin/events', [
                'items'   => [],
                'dbError' => $e->getMessage(),
            ]);
        }
        return view('admin/events', ['items' => $items]);
    }

    public function eventCreate()
    {
        $this->ensureEventsTable();
        return view('admin/event_form', ['item' => null]);
    }

    public function eventStore()
    {
        $this->ensureEventsTable();
        if ($err = $this->validateEventInput()) {
            return redirect()->back()->withInput()->with('error', $err);
        }
        try {
            $this->eventModel->save($this->eventPayload());
        } catch (\Throwable $e) {
            return redirect()->back()->withInput()->with('error', 'Gagal menyimpan acara: ' . $e->getMessage());
        }
        return redirect()->to('/admin/events')->with('success', 'Acara pernikahan berhasil ditambahkan.');
    }

    public function eventEdit($id)
    {
        $this->ensureEventsTable();
        try {
            $item = $this->eventModel->find($id);
        } catch (\Throwable $e) {
            return redirect()->to('/admin/events')->with('error', 'Database error: ' . $e->getMessage());
        }
        if (! $item) {
            return redirect()->to('/admin/events')->with('error', 'Data acara tidak ditemukan.');
        }
        return view('admin/event_form', ['item' => $item]);
    }

    public function eventUpdate($id)
    {
        $this->ensureEventsTable();
        try {
            $item = $this->eventModel->find($id);
        } catch (\Throwable $e) {
            return redirect()->to('/admin/events')->with('error', 'Database error: ' . $e->getMessage());
        }
        if (! $item) {
            return redirect()->to('/admin/events')->with('error', 'Data acara tidak ditemukan.');
        }
        if ($err = $this->validateEventInput()) {
            return redirect()->back()->withInput()->with('error', $err);
        }
        try {
            $this->eventModel->update($id, $this->eventPayload());
        } catch (\Throwable $e) {
            return redirect()->back()->withInput()->with('error', 'Gagal mengupdate acara: ' . $e->getMessage());
        }
        return redirect()->to('/admin/events')->with('success', 'Acara pernikahan berhasil diupdate.');
    }

    public function eventDelete($id)
    {
        $this->ensureEventsTable();
        try {
            $this->eventModel->delete($id);
        } catch (\Throwable $e) {
            return redirect()->to('/admin/events')->with('error', 'Database error: ' . $e->getMessage());
        }
        return redirect()->to('/admin/events')->with('success', 'Acara pernikahan berhasil dihapus.');
    }
}
