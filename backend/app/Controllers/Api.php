<?php

namespace App\Controllers;

use App\Models\GuestModel;
use App\Models\GalleryModel;
use App\Models\StoryModel;
use App\Models\CoupleModel;
use App\Models\EventModel;
use CodeIgniter\API\ResponseTrait;

class Api extends BaseController
{
    use ResponseTrait;

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
    }

    private function cors()
    {
        $this->response->setHeader('Access-Control-Allow-Origin', '*');
        $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }

    private function imageUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }
        // Sudah URL penuh -> kembalikan apa adanya
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        // Path lokal (uploads/...) -> prefix baseURL
        return rtrim(base_url(), '/') . '/' . ltrim($path, '/');
    }

    public function rsvp()
    {
        $this->cors();

        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        if (strtoupper($this->request->getMethod()) === 'POST') {
            $json = $this->request->getJSON();

            // Dukung form-data juga selain JSON
            if (empty($json)) {
                $json = (object) [
                    'name'        => $this->request->getPost('name'),
                    'status'      => $this->request->getPost('status'),
                    'guest_count' => $this->request->getPost('guest_count'),
                    'message'     => $this->request->getPost('message'),
                ];
            }

            if (! empty($json->name) && ! empty($json->status) && isset($json->guest_count)) {
                try {
                    $this->guestModel->save([
                        'name'        => $json->name,
                        'status'      => $json->status,
                        'guest_count' => (int) $json->guest_count,
                        'message'     => $json->message ?? '',
                    ]);
                    return $this->respond(['status' => 'success', 'message' => 'Data berhasil disimpan']);
                } catch (\Exception $e) {
                    return $this->failServerError('Database error: ' . $e->getMessage());
                }
            }

            return $this->failValidationError('Data tidak lengkap');
        }

        // GET: daftar ucapan
        try {
            $guests = $this->guestModel
                ->select('name, status, message, created_at as time')
                ->orderBy('created_at', 'DESC')
                ->findAll();
            return $this->respond($guests);
        } catch (\Exception $e) {
            return $this->failServerError('Database error: ' . $e->getMessage());
        }
    }

    public function gallery()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }
        try {
            $rows = $this->galleryModel->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll();
            $out = array_map(function ($r) {
                return [
                    'id'        => (int) $r['id'],
                    'caption'   => $r['caption'] ?? '',
                    'url'       => $this->imageUrl($r['image_path']),
                    'image'     => $this->imageUrl($r['image_path']),
                ];
            }, $rows);
            return $this->respond($out);
        } catch (\Exception $e) {
            return $this->failServerError('Database error: ' . $e->getMessage());
        }
    }

    public function stories()
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
                    'image'       => $this->imageUrl($r['image_path']),
                    'url'         => $this->imageUrl($r['image_path']),
                ];
            }, $rows);
            return $this->respond($out);
        } catch (\Exception $e) {
            return $this->failServerError('Database error: ' . $e->getMessage());
        }
    }

    public function couple()
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
                    'id'        => (int) $r['id'],
                    'role'      => $r['role'],
                    'nickname'  => $r['nickname'] ?? '',
                    'name'      => $r['name'] ?? '',
                    'father'    => $r['father'] ?? '',
                    'mother'    => $r['mother'] ?? '',
                    'instagram' => $r['instagram'] ?? '',
                    'photo'     => $this->imageUrl($r['image_path']),
                    'image'     => $this->imageUrl($r['image_path']),
                ];
            }
            return $this->respond($out);
        } catch (\Exception $e) {
            return $this->failServerError('Database error: ' . $e->getMessage());
        }
    }

    public function events()
    {
        $this->cors();
        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }
        try {
            $rows = $this->eventModel->orderBy('sort_order', 'ASC')->orderBy('id', 'ASC')->findAll();
            $out = array_map(function ($r) {
                return [
                    'id'            => (int) $r['id'],
                    'title'         => $r['title'] ?? '',
                    // alias agar cocok dengan frontend lama (akad/resepsi)
                    'date'          => $r['date_label'] ?? '',
                    'date_label'    => $r['date_label'] ?? '',
                    'time'          => $r['time_label'] ?? '',
                    'time_label'    => $r['time_label'] ?? '',
                    'location'      => $r['location'] ?? '',
                    'address'       => $r['address'] ?? '',
                    'mapsUrl'       => $r['maps_url'] ?? '',
                    'maps_url'      => $r['maps_url'] ?? '',
                    'target_gender' => $r['target_gender'] ?? 'ALL',
                    'sort_order'    => (int) ($r['sort_order'] ?? 0),
                ];
            }, $rows);
            return $this->respond($out);
        } catch (\Exception $e) {
            return $this->failServerError('Database error: ' . $e->getMessage());
        }
    }
}
