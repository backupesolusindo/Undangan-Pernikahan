<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'username'   => 'admin',
            'password'   => password_hash('admin123', PASSWORD_BCRYPT),
            'name'       => 'Administrator',
            'api_token'  => null,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        // Avoid duplicate: only insert if not exists
        $existing = $this->db->table('admins')->where('username', 'admin')->get()->getRow();
        if (! $existing) {
            $this->db->table('admins')->insert($data);
        }
    }
}
