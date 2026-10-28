<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateStoriesTable extends Migration
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
            'year' => ['type' => 'VARCHAR', 'constraint' => 10, 'null' => true],
            'title' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'description' => ['type' => 'TEXT', 'null' => true],
            'image_path' => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => false],
            'sort_order' => ['type' => 'INT', 'constraint' => 11, 'default' => 0],
            'created_at' => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at' => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('stories', true);
    }

    public function down()
    {
        $this->forge->dropTable('stories', true);
    }
}
