<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateGalleryTable extends Migration
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
            'caption' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'image_path' => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => false],
            'sort_order' => ['type' => 'INT', 'constraint' => 11, 'default' => 0],
            'created_at' => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at' => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('gallery', true);
    }

    public function down()
    {
        $this->forge->dropTable('gallery', true);
    }
}
