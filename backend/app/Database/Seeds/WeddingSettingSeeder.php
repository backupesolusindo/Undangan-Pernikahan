<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use App\Models\WeddingSettingModel;

class WeddingSettingSeeder extends Seeder
{
    public function run()
    {
        $settingModel = new WeddingSettingModel();

        $defaultSettings = [
            'groom_name' => 'Raden Seno Wijaya, S.T.',
            'groom_nickname' => 'Seno',
            'groom_father' => 'Bpk. H. Bambang Wijayanto',
            'groom_mother' => 'Ibu Hj. Sri Rahayu',
            'groom_instagram' => '@seno_wijaya',
            'groom_photo' => '/assets/groom.jpg',

            'bride_name' => 'Juwita Sukma, S.Pd.',
            'bride_nickname' => 'Juwita',
            'bride_father' => 'Bpk. Bastian Edy (Alm)',
            'bride_mother' => 'Ibu Romadona Noverina',
            'bride_instagram' => '@juwita_sukma',
            'bride_photo' => '/assets/bride.jpg',

            'event_date' => '2026-09-30T08:00:00+07:00',
            'event_date_formatted' => 'Minggu, 30 September 2026',
            'audio_url' => 'https://cdn.jsdelivr.net/gh/backupesolusindo/Undangan-Pernikahan@main/frontend/public/assets/wedding_music.mp3',
            'video_url' => 'https://cdn.jsdelivr.net/gh/backupesolusindo/Undangan-Pernikahan@main/frontend/public/assets/opening_video2.mp4',
            'hero_image' => '/assets/hero_cover.jpg',
            'hero_fullscreen_image' => '/assets/videoframe_17420.png',

            'quote_text' => 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga pernikahan ini keberkahan bagi kami, keluarga kami, dan keturunan kami di dunia & akhirat.',
            'quote_source' => 'QS. Ar-Rum: 21',

            'akad_title' => 'Akad Nikah',
            'akad_date' => 'Minggu, 30 September 2026',
            'akad_time' => '08:00 WIB - Selesai',
            'akad_location' => 'Pendopo Kedhaton Jawa',
            'akad_address' => 'Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah',
            'akad_maps_url' => 'https://maps.google.com/?q=Surakarta',

            'resepsi_title' => 'Upacara Panggih & Resepsi',
            'resepsi_date' => 'Minggu, 30 September 2026',
            'resepsi_time' => '11:00 - 14:00 WIB',
            'resepsi_location' => 'Grand Ballroom Pendopo Agung',
            'resepsi_address' => 'Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah',
            'resepsi_maps_url' => 'https://maps.google.com/?q=Surakarta',

            'bank1_name' => 'Bank BCA',
            'bank1_account' => '8830192841',
            'bank1_holder' => 'Juwita Sukma',
            'bank1_icon' => '/assets/bca_logo.svg',

            'bank2_name' => 'Bank Mandiri',
            'bank2_account' => '1380092104812',
            'bank2_holder' => 'Raden Seno Wijaya',
            'bank2_icon' => '/assets/mandiri_logo.svg',

            'gift_name' => 'Juwita & Seno',
            'gift_address' => 'Kediaman Mempelai, Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah',
        ];

        $settingModel->setMany($defaultSettings);
    }
}

