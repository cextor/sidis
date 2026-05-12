<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Dispositions extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();
        $mailId = $this->request->getGet('mailIncomingId');
        
        $builder = $db->table('dispositions d')
            ->select('d.*, f.displayName as fromName, t.displayName as toName')
            ->join('users f', 'f.id = d.fromId', 'left')
            ->join('users t', 't.id = d.toId', 'left')
            ->orderBy('d.createdAt', 'ASC');

        if ($mailId) {
            $builder->where('d.mailIncomingId', $mailId);
        }

        $dispositions = $builder->get()->getResultArray();
        return $this->respond($dispositions);
    }

    public function create()
    {
        $db = \Config\Database::connect();
        $data = $this->request->getPost();
        if (!$data) {
            $data = $this->request->getJSON(true);
        }

        $userId = 'usr_admin'; // fallback
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if($header){
            try {
                $token = explode(' ', $header)[1];
                $key = env('JWT_SECRET');
                $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($key, 'HS256'));
                $userId = $decoded->uid;
            } catch (\Exception $e) {
                // Ignore and use fallback
            }
        }

        $insertData = [
            'id' => uniqid('disp_'),
            'mailIncomingId' => $data['mailIncomingId'],
            'fromId' => $userId,
            'toId' => $data['toId'],
            'instruction' => $data['instruction'] ?? '',
            'status' => 'PENDING',
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
        ];

        $db->table('dispositions')->insert($insertData);

        // Update the mail status to 'DISPOSED' or something if it was PENDING
        $db->table('mails_incoming')->where('id', $data['mailIncomingId'])->update(['status' => 'DISPOSED', 'updatedAt' => date('Y-m-d H:i:s')]);

        return $this->respondCreated(['status' => true, 'message' => 'Disposition inserted', 'id' => $insertData['id']]);
    }

    public function markAsRead($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('dispositions')->where('id', $id)->where('status', 'PENDING')->update([
            'status' => 'READ',
            'updatedAt' => date('Y-m-d H:i:s')
        ]);
        return $this->respond(['status' => true, 'message' => 'Marked as read']);
    }
}
