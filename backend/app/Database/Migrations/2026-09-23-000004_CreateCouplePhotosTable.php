<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCouplePhotosTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'role' => ['type' => 'VARCHAR', 'constraint' => 10, 'null' => false],
            'nickname' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'father' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'mother' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'instagram' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'image_path' => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => false],
            'created_at' => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at' => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('couple_photos', true);
    }

    public function down()
    {
        $this->forge->dropTable('couple_photos', true);
    }
}
