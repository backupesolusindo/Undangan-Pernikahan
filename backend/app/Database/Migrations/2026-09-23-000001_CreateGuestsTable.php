<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateGuestsTable extends Migration
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
            'name' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'phone' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => false],
            'status' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => false, 'default' => 'Hadir'],
            'guest_count' => ['type' => 'INT', 'constraint' => 11, 'null' => false, 'default' => 1],
            'message' => ['type' => 'TEXT', 'null' => true],
            'created_at' => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at' => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('guests', true);
    }

    public function down()
    {
        $this->forge->dropTable('guests', true);
    }
}
