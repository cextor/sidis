<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDispositionsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_dispositions' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'mailIncomingId' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'fromId' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'toId' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
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
        $this->forge->addKey('id_dispositions', true);
        $this->forge->createTable('dispositions');
    }

    public function down()
    {
        $this->forge->dropTable('dispositions');
    }
}
