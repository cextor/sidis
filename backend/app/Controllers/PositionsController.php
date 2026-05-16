<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class PositionsController extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();
        
        $positions = $db->table('users')
            ->select('position_name as title, golongan as level, count(id_users) as memberCount')
            ->where('position_name IS NOT NULL')
            ->where("position_name != ''")
            ->groupBy('position_name, golongan')
            ->get()->getResultArray();
            
        // Map to add id so frontend doesn't complain about missing keys
        foreach($positions as $i => &$p) {
            $p['id'] = $i + 1;
        }

        return $this->respond($positions);
    }
}
