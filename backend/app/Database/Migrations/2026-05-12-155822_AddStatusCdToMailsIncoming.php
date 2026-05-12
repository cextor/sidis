<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddStatusCdToMailsIncoming extends Migration
{
    public function up()
    {
        $this->forge->addColumn('mails_incoming', [
            'status_cd' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'default'    => 'normal',
                'null'       => true,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('mails_incoming', 'status_cd');
    }
}
