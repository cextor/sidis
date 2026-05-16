<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateMailsOutgoingTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_mails_outgoing' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'letterNumber' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'dateSent' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'recipient' => [
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
                'constraint' => ['DRAFT', 'SENT', 'ARCHIVED'],
                'default'    => 'DRAFT',
            ],
            'pdfUrl' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'createdBy' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
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
        $this->forge->addKey('id_mails_outgoing', true);
        $this->forge->createTable('mails_outgoing');
    }

    public function down()
    {
        $this->forge->dropTable('mails_outgoing');
    }
}
