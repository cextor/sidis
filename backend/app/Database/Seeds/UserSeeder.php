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
            'password' => password_hash('123456', PASSWORD_DEFAULT),
            'role' => 'ADMIN',
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
        ];

        $builder = $this->db->table('users');
        if ($builder->where('email', 'admin@admin.com')->countAllResults(false) > 0) {
            $builder->update(['password' => $data['password']]);
        } else {
            $builder->insert($data);
        }
    }
}
