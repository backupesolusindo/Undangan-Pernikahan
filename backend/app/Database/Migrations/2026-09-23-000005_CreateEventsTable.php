<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEventsTable extends Migration
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
            'title' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'date_label' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'time_label' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'location' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'address' => ['type' => 'TEXT', 'null' => true],
            'maps_url' => ['type' => 'TEXT', 'null' => true],
            'target_gender' => [
                'type'       => 'ENUM',
                'constraint' => ['ALL', 'L', 'P'],
                'default'    => 'ALL',
                'null'       => false,
            ],
            'sort_order' => ['type' => 'INT', 'constraint' => 11, 'default' => 0],
            'created_at' => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at' => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('events', true);
    }

    public function down()
    {
        $this->forge->dropTable('events', true);
    }
}
