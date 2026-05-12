<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'id' => 'usr_admin',
            'displayName' => 'Administrator',
            'email' => 'admin@admin.com',
            'password' => password_hash('password', PASSWORD_DEFAULT),
            'role' => 'ADMIN',
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
        ];

        $this->db->table('users')->insert($data);
    }
}
