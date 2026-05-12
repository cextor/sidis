<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [
            [
                'id' => 'usr_admin',
                'displayName' => 'Administrator',
                'email' => 'admin@admin.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'ADMIN',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 'usr_humas',
                'displayName' => 'Humas (Siti)',
                'email' => 'humas@sidis.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'USER',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 'usr_dir',
                'displayName' => 'Direktur / Kepala Dinas',
                'email' => 'direktur@sidis.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'USER',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 'usr_kabagit',
                'displayName' => 'Kabag IT (Budi)',
                'email' => 'kabagit@sidis.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'USER',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 'usr_unit',
                'displayName' => 'Unit Terkait',
                'email' => 'unit@sidis.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'USER',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ]
        ];

        $builder = $this->db->table('users');
        foreach ($users as $data) {
            if ($builder->where('email', $data['email'])->countAllResults(false) > 0) {
                $builder->update(['password' => $data['password']]);
            } else {
                $builder->insert($data);
            }
        }
    }
}
