<?php

namespace App\Controllers;

use App\Models\GuestModel;
use App\Models\GalleryModel;
use App\Models\StoryModel;
use App\Models\CoupleModel;
use App\Models\EventModel;
use App\Models\WeddingSettingModel;
use App\Models\InviteeModel;
use CodeIgniter\API\ResponseTrait;

class AdminApi extends BaseController
{
    use ResponseTrait;

    protected $guestModel;
    protected $galleryModel;
    protected $storyModel;
    protected $coupleModel;
    protected $eventModel;
    protected $settingModel;
    protected $inviteeModel;

    public function __construct()
    {
        $this->guestModel   = new GuestModel();
        $this->galleryModel = new GalleryModel();
        $this->storyModel   = new StoryModel();
        $this->coupleModel  = new CoupleModel();
        $this->eventModel   = new EventModel();
        $this->settingModel = new WeddingSettingModel();
        $this->inviteeModel = new InviteeModel();
        helper(['url', 'form']);
    }

    private function cors()
    {
        $this->response->setHeader('Access-Control-Allow-Origin', '*');
        $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }

    private function imageUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        return rtrim(base_url(), '/') . '/' . ltrim($path, '/');
    }

    private function uploadDir(): string
    {
        $dir = FCPATH . 'uploads' . DIRECTORY_SEPARATOR;
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Batas upload per jenis berkas (dalam byte).
     * Foto 5MB, audio 20MB, video 50MB.
     */
    private const UPLOAD_GROUPS = [
        'image' => [
            'max'  => 5 * 1024 * 1024,
            'ext'  => ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            'mime' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        ],
        'audio' => [
            'max'  => 20 * 1024 * 1024,
            'ext'  => ['mp3', 'wav', 'm4a', 'ogg'],
            'mime' => ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/ogg'],
        ],
        'video' => [
            'max'  => 50 * 1024 * 1024,
            'ext'  => ['mp4', 'webm'],
            'mime' => ['video/mp4', 'video/webm'],
        ],
    ];

    /**
     * Cari kelompok upload yang cocok untuk ekstensi berkas.
     */
    private function uploadGroup(string $ext): ?string
    {
        foreach (self::UPLOAD_GROUPS as $name => $group) {
            if (in_array($ext, $group['ext'], true)) {
                return $name;
            }
        }

        return null;
    }

    /**
     * Jalankan upload satu field berkas.
     *
     * Mengembalikan path relatif 'uploads/<nama>' bila sukses, path lama bila
     * tidak ada berkas baru, atau sentinel '__ERROR__:Pesan' bila gagal.
     * Pemanggil wajib memeriksa awalan '__ERROR__' sebelum memakai hasil.
     */
    private function handleUpload(string $field, ?string $oldPath = null): ?string
    {
        $file = $this->request->getFile($field);

        if (! $file || $file->getError() === UPLOAD_ERR_NO_FILE) {
            return $oldPath;
        }

        if (! $file->isValid()) {
            $code = $file->getError();
            $msg  = $code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE
                ? 'Ukuran berkas melebihi batas server PHP (upload_max_filesize/post_max_size).'
                : 'Berkas tidak valid atau gagal diunggah (kode ' . $code . ').';

            return '__ERROR__:' . $msg;
        }

        $ext = strtolower($file->getExtension());
        $groupName = $this->uploadGroup($ext);

        if ($groupName === null) {
            return '__ERROR__:Format berkas .' . $ext . ' tidak diizinkan.';
        }

        $group = self::UPLOAD_GROUPS[$groupName];

        $mime = strtolower((string) $file->getMimeType());
        if ($mime !== '' && ! in_array($mime, $group['mime'], true)) {
            return '__ERROR__:Isi berkas (' . $mime . ') tidak cocok dengan ekstensi .' . $ext . '.';
        }

        $size = (int) $file->getSize();
        if ($size > $group['max']) {
            $limitMb = (int) ($group['max'] / 1024 / 1024);

            return '__ERROR__:Ukuran ' . $this->humanSize($size)
                . ' melebihi batas ' . $limitMb . 'MB untuk berkas ' . $groupName . '.';
        }

        $newName = $file->getRandomName();
        $file->move($this->uploadDir(), $newName);

        if ($oldPath && str_starts_with($oldPath, 'uploads/')) {
            $oldFull = FCPATH . str_replace('/', DIRECTORY_SEPARATOR, $oldPath);
            if (is_file($oldFull)) {
                @unlink($oldFull);
            }
        }

        return 'uploads/' . $newName;
    }

    private function humanSize(int $bytes): string
    {
        return $bytes >= 1048576
            ? round($bytes / 1048576, 1) . 'MB'
            : round($bytes / 1024) . 'KB';
    }

    private function isUploadError(?string $value): bool
    {
        return $value !== null && str_starts_with($value, '__ERROR__');
    }

    private function uploadErrorMessage(?string $value, string $fallback): string
    {
        if (! $this->isUploadError($value)) {
            return $fallback;
        }

        return trim(substr((string) $value, strlen('__ERROR__:'))) ?: $fallback;
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

    // ========================================================
    // PUBLIC ENDPOINTS
    // ========================================================

    /**
     * GET /api/settings
     * Public endpoint for wedding invitation page to load all dynamic config.
     */
    public function publicSettings()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $settings = $this->settingModel->getAll();
            return $this->respond($settings);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    /**
     * GET /api/invitees/check?to=...
     * Checks if an invitee slug or name exists, returns formatted invitee object.
     */
    public function checkInvitee()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $to = $this->request->getGet('to') ?? $this->request->getGet('slug') ?? '';
        $to = trim($to);

        if ($to === '') {
            return $this->respond(['found' => false, 'name' => null]);
        }

        $slugWithPlus   = str_replace(' ', '+', $to);
        $slugWithDash   = str_replace(' ', '-', $to);
        $nameWithSpaces = str_replace(['+', '_', '-'], ' ', $to);

        // Search by slug or name variation
        $invitee = $this->inviteeModel
            ->where('slug', $to)
            ->orWhere('slug', $slugWithPlus)
            ->orWhere('slug', $slugWithDash)
            ->orWhere('name', $to)
            ->orWhere('name', $nameWithSpaces)
            ->first();

        if ($invitee) {
            return $this->respond([
                'found' => true,
                'name'  => $invitee['name'],
                'slug'  => $invitee['slug'],
                'phone' => $invitee['phone'] ?? null,
            ]);
        }

        // If not found in DB, return clean formatted text from $to param
        // Example: "Budi+Prasetyo" -> "Budi Prasetyo"
        $formatted = ucwords($nameWithSpaces);
        return $this->respond([
            'found' => false,
            'name'  => $formatted,
            'slug'  => $to,
        ]);
    }

    // ========================================================
    // PROTECTED ADMIN ENDPOINTS
    // ========================================================

    /**
     * GET /api/admin/dashboard
     */
    public function dashboard()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $guests = $this->guestModel->findAll();
            $hadirCount = 0;
            $tidakHadirCount = 0;
            $raguCount = 0;
            $totalPax = 0;

            foreach ($guests as $g) {
                $status = strtolower($g['status'] ?? '');
                if ($status === 'hadir') {
                    $hadirCount++;
                } elseif ($status === 'tidak hadir') {
                    $tidakHadirCount++;
                } else {
                    $raguCount++;
                }
                $totalPax += (int) ($g['guest_count'] ?? 1);
            }

            $totalInvitees = $this->inviteeModel->countAllResults();
            $totalGallery  = $this->galleryModel->countAllResults();
            $totalStories  = $this->storyModel->countAllResults();
            $totalEvents   = $this->eventModel->countAllResults();

            return $this->respond([
                'status' => 'success',
                'stats'  => [
                    'total_rsvp'        => count($guests),
                    'hadir'             => $hadirCount,
                    'tidak_hadir'       => $tidakHadirCount,
                    'ragu'              => $raguCount,
                    'total_pax'         => $totalPax,
                    'total_invitees'    => $totalInvitees,
                    'total_gallery'     => $totalGallery,
                    'total_stories'     => $totalStories,
                    'total_events'      => $totalEvents,
                ],
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // --- SETTINGS ---

    /**
     * Daftar kunci pengaturan yang boleh ditulis lewat endpoint ini.
     * Mencegah penyimpanan key asing (atau payload file) ke tabel settings.
     */
    private const SETTING_KEYS = [
        'groom_name', 'groom_nickname', 'groom_father', 'groom_mother', 'groom_instagram', 'groom_photo',
        'bride_name', 'bride_nickname', 'bride_father', 'bride_mother', 'bride_instagram', 'bride_photo',
        'event_date', 'event_date_formatted',
        'audio_url', 'video_url',
        'hero_image', 'hero_fullscreen_image',
        'quote_text', 'quote_source',
        'akad_title', 'akad_date', 'akad_time', 'akad_location', 'akad_address', 'akad_maps_url',
        'resepsi_title', 'resepsi_date', 'resepsi_time', 'resepsi_location', 'resepsi_address', 'resepsi_maps_url',
        'bank1_name', 'bank1_account', 'bank1_holder', 'bank1_icon',
        'bank2_name', 'bank2_account', 'bank2_holder', 'bank2_icon',
        'gift_name', 'gift_address',
    ];

    /**
     * Kunci settings yang diisi lewat upload berkas.
     * value => nama field berkas pada request multipart.
     */
    private const SETTING_FILE_FIELDS = [
        'hero_image'             => 'hero_image_file',
        'hero_fullscreen_image'  => 'hero_fullscreen_image_file',
        'video_url'              => 'video_url_file',
        'audio_url'              => 'audio_url_file',
    ];

    public function getSettings()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $data = $this->settingModel->getAll();
            return $this->respond(['status' => 'success', 'data' => $data]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function updateSettings()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        // Mendukung dua mode: application/json dan multipart/form-data (upload).
        // getJSON(true) pada multipart akan throw, jadi cek Content-Type dulu.
        $contentType = $this->request->getHeaderLine('Content-Type');
        $isMultipart = stripos($contentType, 'multipart/form-data') !== false;

        if ($isMultipart) {
            // Mode multipart: langsung ambil POST fields, jangan coba JSON.
            $payload = $this->request->getPost();
        } else {
            // Mode JSON (atau form-urlencoded): coba JSON dulu, lalu fallback POST.
            $payload = $this->request->getJSON(true);
            if (! is_array($payload) || $payload === []) {
                $payload = $this->request->getPost();
            }
        }

        if (! is_array($payload) || $payload === []) {
            return $this->failValidationErrors('Data pengaturan kosong.');
        }

        $current = $this->settingModel->getAll();
        $data    = [];

        foreach ($payload as $key => $value) {
            if (! in_array($key, self::SETTING_KEYS, true)) {
                continue;
            }

            if (! is_scalar($value)) {
                return $this->failValidationErrors('Nilai untuk "' . $key . '" harus berupa teks.');
            }

            $data[$key] = trim((string) $value);
        }

        // Foto sampul & frame diunggah sebagai berkas terpisah, bukan field teks.
        foreach (self::SETTING_FILE_FIELDS as $settingKey => $fileField) {
            $path = $this->handleUpload($fileField, $current[$settingKey] ?? null);

            if ($this->isUploadError($path)) {
                return $this->failValidationErrors(
                    $this->uploadErrorMessage($path, 'Upload foto gagal.') . ' (' . $settingKey . ')'
                );
            }

            if ($path !== null) {
                $data[$settingKey] = $path;
            }
        }

        if ($data === []) {
            return $this->failValidationErrors('Tidak ada pengaturan valid untuk disimpan.');
        }

        try {
            $this->settingModel->setMany($data);
            return $this->respond([
                'status'  => 'success',
                'message' => 'Pengaturan berhasil disimpan.',
                'data'    => $this->settingModel->getAll(),
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // --- INVITEES (DAFTAR TAMU YANG DIUNDANG) ---

    public function listInvitees()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $rows = $this->inviteeModel->orderBy('created_at', 'DESC')->findAll();
            return $this->respond(['status' => 'success', 'data' => $rows]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function createInvitee()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $json = $this->request->getJSON(true) ?? $this->request->getPost();
        $name = trim($json['name'] ?? '');

        if ($name === '') {
            return $this->failValidationErrors('Nama tamu wajib diisi.');
        }

        $slug = trim($json['slug'] ?? '');
        if ($slug === '') {
            // Auto generate slug from name: replace spaces with + or -
            $slug = url_title($name, '+', false);
        }

        // Ensure unique slug
        $existing = $this->inviteeModel->where('slug', $slug)->first();
        if ($existing) {
            $slug .= '-' . rand(10, 99);
        }

        try {
            $id = $this->inviteeModel->insert([
                'name'  => $name,
                'slug'  => $slug,
                'phone' => trim($json['phone'] ?? ''),
                'notes' => trim($json['notes'] ?? ''),
            ]);

            return $this->respondCreated([
                'status'  => 'success',
                'message' => 'Tamu undangan berhasil ditambahkan.',
                'data'    => $this->inviteeModel->find($id),
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function updateInvitee($id)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $item = $this->inviteeModel->find($id);
        if (! $item) {
            return $this->failNotFound('Data tamu tidak ditemukan.');
        }

        $json = $this->request->getJSON(true) ?? $this->request->getPost();
        $name = trim($json['name'] ?? $item['name']);
        $slug = trim($json['slug'] ?? $item['slug']);

        if ($name === '') {
            return $this->failValidationErrors('Nama tamu tidak boleh kosong.');
        }

        try {
            $this->inviteeModel->update($id, [
                'name'  => $name,
                'slug'  => $slug,
                'phone' => trim($json['phone'] ?? $item['phone']),
                'notes' => trim($json['notes'] ?? $item['notes']),
            ]);

            return $this->respond([
                'status'  => 'success',
                'message' => 'Data tamu berhasil diperbarui.',
                'data'    => $this->inviteeModel->find($id),
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function deleteInvitee($id)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $this->inviteeModel->delete($id);
            return $this->respond([
                'status'  => 'success',
                'message' => 'Tamu berhasil dihapus.',
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // --- RSVP GUESTS ---

    public function listGuests()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $rows = $this->guestModel->orderBy('created_at', 'DESC')->findAll();
            return $this->respond(['status' => 'success', 'data' => $rows]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function deleteGuest($id)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $this->guestModel->delete($id);
            return $this->respond(['status' => 'success', 'message' => 'Data RSVP berhasil dihapus.']);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // --- GALLERY ---

    public function listGallery()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $rows = $this->galleryModel->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll();
            $out = array_map(function ($r) {
                return [
                    'id'         => (int) $r['id'],
                    'caption'    => $r['caption'] ?? '',
                    'image_path' => $r['image_path'] ?? '',
                    'url'        => $this->imageUrl($r['image_path']),
                    'sort_order' => (int) ($r['sort_order'] ?? 0),
                ];
            }, $rows);
            return $this->respond(['status' => 'success', 'data' => $out]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function createGallery()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $imagePath = $this->handleUpload('image');
        if ($this->isUploadError($imagePath)) {
            return $this->failValidationErrors($this->uploadErrorMessage($imagePath, 'Foto galeri wajib diunggah.'));
        }
        if (empty($imagePath)) {
            // Check if image URL was sent as text
            $imagePath = trim((string) $this->request->getPost('image_url'));
            if (empty($imagePath)) {
                return $this->failValidationErrors('Foto wajib diunggah.');
            }
        }

        try {
            $id = $this->galleryModel->insert([
                'caption'    => trim((string) $this->request->getPost('caption')),
                'image_path' => $imagePath,
                'sort_order' => (int) ($this->request->getPost('sort_order') ?? 0),
            ]);

            return $this->respondCreated([
                'status'  => 'success',
                'message' => 'Foto galeri berhasil ditambahkan.',
                'data'    => $this->galleryModel->find($id),
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function updateGallery($id)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $item = $this->galleryModel->find($id);
        if (! $item) {
            return $this->failNotFound('Foto tidak ditemukan.');
        }

        $imagePath = $this->handleUpload('image', $item['image_path']);
        if ($this->isUploadError($imagePath)) {
            return $this->failValidationErrors($this->uploadErrorMessage($imagePath, 'Upload gambar gagal.'));
        }

        // Support direct text URL update if provided
        $directUrl = trim((string) $this->request->getPost('image_url'));
        if (! empty($directUrl)) {
            $imagePath = $directUrl;
        }

        try {
            $this->galleryModel->update($id, [
                'caption'    => trim((string) ($this->request->getPost('caption') ?? $item['caption'])),
                'image_path' => $imagePath ?? $item['image_path'],
                'sort_order' => (int) ($this->request->getPost('sort_order') ?? $item['sort_order']),
            ]);

            return $this->respond([
                'status'  => 'success',
                'message' => 'Foto galeri berhasil diupdate.',
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function deleteGallery($id)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $item = $this->galleryModel->find($id);
            if ($item) {
                $this->deleteFile($item['image_path']);
                $this->galleryModel->delete($id);
            }
            return $this->respond(['status' => 'success', 'message' => 'Foto berhasil dihapus.']);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // --- STORIES ---

    public function listStories()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $rows = $this->storyModel->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll();
            $out = array_map(function ($r) {
                return [
                    'id'          => (int) $r['id'],
                    'year'        => $r['year'] ?? '',
                    'title'       => $r['title'] ?? '',
                    'description' => $r['description'] ?? '',
                    'image_path'  => $r['image_path'] ?? '',
                    'url'         => $this->imageUrl($r['image_path']),
                    'sort_order'  => (int) ($r['sort_order'] ?? 0),
                ];
            }, $rows);
            return $this->respond(['status' => 'success', 'data' => $out]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function createStory()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $title = trim((string) $this->request->getPost('title'));
        if ($title === '') {
            return $this->failValidationErrors('Judul cerita wajib diisi.');
        }

        $imagePath = $this->handleUpload('image');
        if ($this->isUploadError($imagePath)) {
            return $this->failValidationErrors($this->uploadErrorMessage($imagePath, 'Upload gambar gagal.'));
        }
        if (empty($imagePath)) {
            $imagePath = trim((string) $this->request->getPost('image_url'));
        }

        try {
            $id = $this->storyModel->insert([
                'year'        => trim((string) $this->request->getPost('year')),
                'title'       => $title,
                'description' => trim((string) $this->request->getPost('description')),
                'image_path'  => $imagePath ?: '',
                'sort_order'  => (int) ($this->request->getPost('sort_order') ?? 0),
            ]);

            return $this->respondCreated([
                'status'  => 'success',
                'message' => 'Cerita berhasil ditambahkan.',
                'data'    => $this->storyModel->find($id),
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function updateStory($id)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $item = $this->storyModel->find($id);
        if (! $item) {
            return $this->failNotFound('Cerita tidak ditemukan.');
        }

        $imagePath = $this->handleUpload('image', $item['image_path']);
        if ($this->isUploadError($imagePath)) {
            return $this->failValidationErrors($this->uploadErrorMessage($imagePath, 'Upload gambar gagal.'));
        }

        $directUrl = trim((string) $this->request->getPost('image_url'));
        if (! empty($directUrl)) {
            $imagePath = $directUrl;
        }

        try {
            $this->storyModel->update($id, [
                'year'        => trim((string) ($this->request->getPost('year') ?? $item['year'])),
                'title'       => trim((string) ($this->request->getPost('title') ?? $item['title'])),
                'description' => trim((string) ($this->request->getPost('description') ?? $item['description'])),
                'image_path'  => $imagePath ?? $item['image_path'],
                'sort_order'  => (int) ($this->request->getPost('sort_order') ?? $item['sort_order']),
            ]);

            return $this->respond(['status' => 'success', 'message' => 'Cerita berhasil diupdate.']);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function deleteStory($id)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $item = $this->storyModel->find($id);
            if ($item) {
                $this->deleteFile($item['image_path']);
                $this->storyModel->delete($id);
            }
            return $this->respond(['status' => 'success', 'message' => 'Cerita berhasil dihapus.']);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // --- COUPLE ---

    public function listCouple()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $rows = $this->coupleModel->orderBy('id', 'ASC')->findAll();
            $out = [];
            foreach ($rows as $r) {
                $out[$r['role']] = [
                    'id'         => (int) $r['id'],
                    'role'       => $r['role'],
                    'nickname'   => $r['nickname'] ?? '',
                    'name'       => $r['name'] ?? '',
                    'father'     => $r['father'] ?? '',
                    'mother'     => $r['mother'] ?? '',
                    'instagram'  => $r['instagram'] ?? '',
                    'image_path' => $r['image_path'] ?? '',
                    'photo'      => $this->imageUrl($r['image_path']),
                ];
            }
            return $this->respond(['status' => 'success', 'data' => $out]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function getCoupleByRole($role)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        if (! in_array($role, ['bride', 'groom'], true)) {
            return $this->failValidationErrors('Role tidak valid (bride / groom).');
        }

        try {
            $row = $this->coupleModel->where('role', $role)->first();
            if (! $row) {
                return $this->respond(['status' => 'success', 'data' => null]);
            }
            return $this->respond([
                'status' => 'success',
                'data'   => [
                    'id'         => (int) $row['id'],
                    'role'       => $row['role'],
                    'nickname'   => $row['nickname'] ?? '',
                    'name'       => $row['name'] ?? '',
                    'father'     => $row['father'] ?? '',
                    'mother'     => $row['mother'] ?? '',
                    'instagram'  => $row['instagram'] ?? '',
                    'image_path' => $row['image_path'] ?? '',
                    'photo'      => $this->imageUrl($row['image_path']),
                ],
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function updateCouple($role)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        if (! in_array($role, ['bride', 'groom'], true)) {
            return $this->failValidationErrors('Role tidak valid (bride / groom).');
        }

        $existing = $this->coupleModel->where('role', $role)->first();
        $oldPath  = $existing['image_path'] ?? null;

        $imagePath = $this->handleUpload('image', $oldPath);
        if ($this->isUploadError($imagePath)) {
            return $this->failValidationErrors($this->uploadErrorMessage($imagePath, 'Upload gambar gagal.'));
        }

        $directUrl = trim((string) $this->request->getPost('image_url'));
        if (! empty($directUrl)) {
            $imagePath = $directUrl;
        }

        $payload = [
            'role'       => $role,
            'nickname'   => trim((string) $this->request->getPost('nickname')),
            'name'       => trim((string) $this->request->getPost('name')),
            'father'     => trim((string) $this->request->getPost('father')),
            'mother'     => trim((string) $this->request->getPost('mother')),
            'instagram'  => trim((string) $this->request->getPost('instagram')),
            'image_path' => $imagePath ?: ($oldPath ?? ''),
        ];

        try {
            if ($existing) {
                $this->coupleModel->update($existing['id'], $payload);
            } else {
                $this->coupleModel->insert($payload);
            }

            // Also synchronize with wedding_settings
            $this->settingModel->setMany([
                "{$role}_name"      => $payload['name'],
                "{$role}_nickname"  => $payload['nickname'],
                "{$role}_father"    => $payload['father'],
                "{$role}_mother"    => $payload['mother'],
                "{$role}_instagram" => $payload['instagram'],
                "{$role}_photo"     => $this->imageUrl($payload['image_path']),
            ]);

            return $this->respond([
                'status'  => 'success',
                'message' => 'Data mempelai berhasil diperbarui.',
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // --- EVENTS ---

    public function listEvents()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $rows = $this->eventModel->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll();
            return $this->respond(['status' => 'success', 'data' => $rows]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function createEvent()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $json = $this->request->getJSON(true) ?? $this->request->getPost();
        $title = trim($json['title'] ?? '');

        if ($title === '') {
            return $this->failValidationErrors('Nama acara wajib diisi.');
        }

        try {
            $id = $this->eventModel->insert([
                'title'         => $title,
                'date_label'    => trim($json['date_label'] ?? $json['date'] ?? ''),
                'time_label'    => trim($json['time_label'] ?? $json['time'] ?? ''),
                'location'      => trim($json['location'] ?? ''),
                'address'       => trim($json['address'] ?? ''),
                'maps_url'      => trim($json['maps_url'] ?? $json['mapsUrl'] ?? ''),
                'target_gender' => $json['target_gender'] ?? 'ALL',
                'sort_order'    => (int) ($json['sort_order'] ?? 0),
            ]);

            return $this->respondCreated([
                'status'  => 'success',
                'message' => 'Acara berhasil ditambahkan.',
                'data'    => $this->eventModel->find($id),
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function updateEvent($id)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $item = $this->eventModel->find($id);
        if (! $item) {
            return $this->failNotFound('Acara tidak ditemukan.');
        }

        $json = $this->request->getJSON(true) ?? $this->request->getPost();

        try {
            $this->eventModel->update($id, [
                'title'         => trim($json['title'] ?? $item['title']),
                'date_label'    => trim($json['date_label'] ?? $json['date'] ?? $item['date_label']),
                'time_label'    => trim($json['time_label'] ?? $json['time'] ?? $item['time_label']),
                'location'      => trim($json['location'] ?? $item['location']),
                'address'       => trim($json['address'] ?? $item['address']),
                'maps_url'      => trim($json['maps_url'] ?? $json['mapsUrl'] ?? $item['maps_url']),
                'target_gender' => $json['target_gender'] ?? $item['target_gender'],
                'sort_order'    => (int) ($json['sort_order'] ?? $item['sort_order']),
            ]);

            return $this->respond(['status' => 'success', 'message' => 'Acara berhasil diupdate.']);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function deleteEvent($id)
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        try {
            $this->eventModel->delete($id);
            return $this->respond(['status' => 'success', 'message' => 'Acara berhasil dihapus.']);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // --- GENERIC UPLOAD ---

    public function uploadImage()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $path = $this->handleUpload('file') ?: $this->handleUpload('image');
        if ($this->isUploadError($path)) {
            return $this->failValidationErrors($this->uploadErrorMessage($path, 'Gagal mengunggah berkas.'));
        }
        if (empty($path)) {
            return $this->failValidationErrors('Gagal mengunggah berkas.');
        }

        return $this->respond([
            'status' => 'success',
            'path'   => $path,
            'url'    => $this->imageUrl($path),
        ]);
    }
}
