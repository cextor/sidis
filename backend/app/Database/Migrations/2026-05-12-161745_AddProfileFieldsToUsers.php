<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddProfileFieldsToUsers extends Migration
{
    public function up()
    {
        $this->forge->addColumn('users', [
            'nip' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'position_name' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'golongan' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'unit_name' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'phone' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'address' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('users', ['nip', 'position_name', 'golongan', 'unit_name', 'phone', 'address']);
    }
}
