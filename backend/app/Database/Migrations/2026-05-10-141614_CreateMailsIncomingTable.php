<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateMailsIncomingTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'VARCHAR',
                'constraint'     => 100,
            ],
            'letterNumber' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'dateReceived' => [
                'type' => 'DATE',
            ],
            'dateOnLetter' => [
                'type' => 'DATE',
            ],
            'sender' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'subject' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'classification' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['PENDING', 'DISPOSED', 'COMPLETED', 'ARCHIVED'],
                'default'    => 'PENDING',
            ],
            'expiryDate' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'pdfUrl' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'createdBy' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
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
        $this->forge->createTable('mails_incoming');
    }

    public function down()
    {
        $this->forge->dropTable('mails_incoming');
    }
}
