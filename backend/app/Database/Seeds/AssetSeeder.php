<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

/**
 * Seed awal foto Galeri, Kisah Cinta, dan Mempelai dari aset statis React,
 * agar semuanya langsung bisa dikelola lewat dashboard /admin/aset
 * tanpa mengubah kode. Aman dijalankan ulang (skip bila tabel sudah berisi).
 */
class AssetSeeder extends Seeder
{
    public function run()
    {
        // ---------- GALERI ----------
        if ($this->db->table('gallery')->countAllResults() === 0) {
            $captions = [
                'gallery1.jpg' => 'Busana Adat Jawa Solo Basahan',
                'gallery2.jpg' => 'Moments Juwita & Seno',
                'gallery3.jpg' => 'Senyum Bahagia',
                'gallery4.jpg' => 'Prosesi Siraman & Midodareni',
                'gallery5.jpg' => 'Pendopo Ageng',
                'gallery6.jpg' => 'Cinta Dalam Kebaya Javanese Art',
            ];
            $i = 0;
            foreach ($captions as $file => $caption) {
                $this->db->table('gallery')->insert([
                    'caption'    => $caption,
                    'image_path' => 'uploads/' . $file,
                    'sort_order' => $i++,
                ]);
            }
        }

        // ---------- KISAH CINTA ----------
        if ($this->db->table('stories')->countAllResults() === 0) {
            $stories = [
                [
                    'year'        => '2021',
                    'title'       => 'Pisanan Kepanggih (Pertama Bertemu)',
                    'description' => 'Awal mula takdir mempertemukan kami dalam suasana adat Jawa di kota Surakarta.',
                    'image_path'  => 'uploads/story1.jpg',
                    'sort_order'  => 0,
                ],
                [
                    'year'        => '2023',
                    'title'       => 'Manunggal Jiwo (Niat Suci)',
                    'description' => 'Menyatukan niat dan tekad bersama untuk melangkah ke jenjang mahligai rumah tangga.',
                    'image_path'  => 'uploads/story2.jpg',
                    'sort_order'  => 1,
                ],
                [
                    'year'        => '2025',
                    'title'       => 'Lamar (Nembung)',
                    'description' => 'Acara silaturahmi keluarga besar dan pengikatan janji suci lamaran.',
                    'image_path'  => 'uploads/story3.jpg',
                    'sort_order'  => 2,
                ],
            ];
            foreach ($stories as $s) {
                $this->db->table('stories')->insert($s);
            }
        }

        // ---------- MEMPELAI (WE ARE WEDDING) ----------
        if ($this->db->table('couple_photos')->countAllResults() === 0) {
            $this->db->table('couple_photos')->insert([
                'role'       => 'bride',
                'nickname'   => 'Juwita',
                'name'       => 'Juwita Sukma, S.Pd.',
                'father'     => 'Bpk. Bastian Edy (Alm)',
                'mother'     => 'Ibu Romadona Noverina',
                'instagram'  => '@juwita_sukma',
                'image_path' => 'uploads/bride.jpg',
            ]);
            $this->db->table('couple_photos')->insert([
                'role'       => 'groom',
                'nickname'   => 'Seno',
                'name'       => 'Raden Seno Wijaya, S.T.',
                'father'     => 'Bpk. H. Bambang Wijayanto',
                'mother'     => 'Ibu Hj. Sri Rahayu',
                'instagram'  => '@seno_wijaya',
                'image_path' => 'uploads/groom.jpg',
            ]);
        }
    }
}
