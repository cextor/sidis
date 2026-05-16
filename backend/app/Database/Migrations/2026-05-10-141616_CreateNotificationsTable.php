<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_notifications' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'userId' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'message' => [
                'type' => 'TEXT',
            ],
            'type' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'read' => [
                'type'    => 'BOOLEAN',
                'default' => false,
            ],
            'link' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
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
        $this->forge->addKey('id_notifications', true);
        $this->forge->createTable('notifications');
    }

    public function down()
    {
        $this->forge->dropTable('notifications');
    }
}
