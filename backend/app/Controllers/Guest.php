<?php

namespace App\Controllers;

use App\Models\GuestModel;

class Guest extends BaseController
{
    protected $guestModel;

    public function __construct()
    {
        $this->guestModel = new GuestModel();
    }

    /**
     * Tampilkan daftar pengunjung
     */
    public function index()
    {
        $guests = $this->guestModel->findAll();
        
        return view('guest/index', [
            'guests' => $guests
        ]);
    }

    /**
     * Generate link WhatsApp untuk mengirim pesan
     */
    public function generateWhatsAppLink($id)
    {
        $guest = $this->guestModel->find($id);
        
        if (!$guest) {
            return redirect()->back()->with('error', 'Data pengunjung tidak ditemukan');
        }

        // Ambil nomor HP dari database
        $phoneNumber = $guest['phone'] ?? null;
        
        if (!$phoneNumber) {
            return redirect()->back()->with('error', 'Nomor HP pengunjung tidak tersedia');
        }

        // Format nomor HP untuk WhatsApp (pastikan menggunakan format internasional)
        $phoneNumber = $this->formatPhoneNumber($phoneNumber);

        // Pesan default
        $message = "Terimakasih telah datang";

        // Generate WhatsApp link
        $whatsappUrl = "https://wa.me/{$phoneNumber}?text=" . urlencode($message);

        return redirect()->to($whatsappUrl);
    }

    /**
     * Format nomor HP ke format WhatsApp (62xxxxxxxxxx)
     */
    private function formatPhoneNumber($phone)
    {
        // Hapus semua karakter selain angka
        $phone = preg_replace('/\D/', '', $phone);

        // Jika dimulai dengan 0, ganti dengan 62
        if (strpos($phone, '0') === 0) {
            $phone = '62' . substr($phone, 1);
        }

        // Jika tidak dimulai dengan 62, tambahkan 62
        if (strpos($phone, '62') !== 0) {
            $phone = '62' . $phone;
        }

        return $phone;
    }

    /**
     * Kirim pesan dengan custom text
     */
    public function sendCustomMessage()
    {
        if ($this->request->getMethod() === 'post') {
            $guestId = $this->request->getPost('guest_id');
            $message = $this->request->getPost('message');

            $guest = $this->guestModel->find($guestId);

            if (!$guest) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Data pengunjung tidak ditemukan'
                ]);
            }

            $phoneNumber = $guest['phone'] ?? null;

            if (!$phoneNumber) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Nomor HP tidak tersedia'
                ]);
            }

            $phoneNumber = $this->formatPhoneNumber($phoneNumber);
            $whatsappUrl = "https://wa.me/{$phoneNumber}?text=" . urlencode($message);

            return $this->response->setJSON([
                'success' => true,
                'whatsapp_url' => $whatsappUrl
            ]);
        }

        return $this->response->setStatusCode(405);
    }
}
