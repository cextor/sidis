<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDispositionsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 100,
            ],
            'mailIncomingId' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'fromId' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'toId' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'instruction' => [
                'type' => 'TEXT',
            ],
            'deadline' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['PENDING', 'READ', 'COMPLETED'],
                'default'    => 'PENDING',
            ],
            'createdAt' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updatedAt' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('dispositions');
    }

    public function down()
    {
        $this->forge->dropTable('dispositions');
    }
}
