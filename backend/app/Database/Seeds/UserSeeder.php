<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [
            [
                'displayName' => 'Administrator',
                'email' => 'admin@admin.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'ADMINISTRATOR',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'displayName' => 'Humas (Siti)',
                'email' => 'humas@sidis.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'OPERATOR',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'displayName' => 'Direktur / Kepala Dinas',
                'email' => 'direktur@sidis.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'PEJABAT',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'displayName' => 'Kabag IT (Budi)',
                'email' => 'kabagit@sidis.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'PEJABAT',
                'createdAt' => date('Y-m-d H:i:s'),
                'updatedAt' => date('Y-m-d H:i:s'),
            ],
            [
                'displayName' => 'Kepala Unit Software',
                'email' => 'software@sidis.com',
                'password' => password_hash('123456', PASSWORD_DEFAULT),
                'role' => 'PEJABAT',
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
