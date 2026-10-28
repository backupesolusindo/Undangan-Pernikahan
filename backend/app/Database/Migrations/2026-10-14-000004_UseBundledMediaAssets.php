<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Musik latar dan video pembuka sekarang memakai berkas bawaan di frontend
 * (frontend/public/assets). Nilai lama masih hotlink ke raw.githubusercontent.com,
 * jadi arahkan ulang ke path lokal. Panel admin tidak lagi menyediakan input URL.
 */
class UseBundledMediaAssets extends Migration
{
    public function up()
    {
        $bundled = [
            'audio_url' => '/assets/wedding_music.mp3',
            'video_url' => '/assets/opening_video2.mp4',
        ];

        $now = date('Y-m-d H:i:s');

        foreach ($bundled as $key => $value) {
            $existing = $this->db->table('wedding_settings')
                ->where('setting_key', $key)
                ->get()
                ->getRowArray();

            if ($existing) {
                if ($existing['setting_value'] === $value) {
                    continue;
                }

                $this->db->table('wedding_settings')
                    ->where('setting_key', $key)
                    ->update(['setting_value' => $value, 'updated_at' => $now]);
            } else {
                $this->db->table('wedding_settings')->insert([
                    'setting_key'   => $key,
                    'setting_value' => $value,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ]);
            }
        }
    }

    public function down()
    {
        // Berkas bawaan tidak punya URL lama untuk dikembalikan.
    }
}