<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateUserRoles extends Migration
{
    public function up()
    {
        $this->db->query("ALTER TABLE users MODIFY COLUMN role ENUM('ADMINISTRATOR', 'OPERATOR', 'PEJABAT') DEFAULT 'PEJABAT'");
    }

    public function down()
    {
        $this->db->query("ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN', 'KAPUS', 'SEKRETARIS', 'STAFF') DEFAULT 'STAFF'");
    }
}
