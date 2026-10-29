<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Server hosting tidak mengizinkan berkas audio/video disajikan langsung,
 * jadi musik latar dan video pembuka diambil dari repo Git via CDN jsDelivr.
 * Nilai yang masih berupa path lokal (/assets/..., uploads/...) diarahkan ulang
 * ke link CDN; URL eksternal yang sudah diisi admin dibiarkan.
 */
class UseCdnMediaAssets extends Migration
{
    private const CDN_BASE = 'https://cdn.jsdelivr.net/gh/backupesolusindo/Undangan-Pernikahan@main/frontend/public/assets/';

    public function up()
    {
        $cdn = [
            'audio_url' => self::CDN_BASE . 'wedding_music.mp3',
            'video_url' => self::CDN_BASE . 'opening_video2.mp4',
        ];

        $now = date('Y-m-d H:i:s');

        foreach ($cdn as $key => $value) {
            $existing = $this->db->table('wedding_settings')
                ->where('setting_key', $key)
                ->get()
                ->getRowArray();

            if ($existing) {
                if (preg_match('#^https?://#i', (string) $existing['setting_value'])) {
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
        $this->db->table('wedding_settings')
            ->where('setting_key', 'audio_url')
            ->update(['setting_value' => '/assets/wedding_music.mp3']);

        $this->db->table('wedding_settings')
            ->where('setting_key', 'video_url')
            ->update(['setting_value' => '/assets/opening_video2.mp4']);
    }
}
