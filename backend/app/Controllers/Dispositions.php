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
            ->select('d.*, d.id_dispositions as id, f.displayName as fromName, t.displayName as toName')
            ->join('users f', 'f.id_users = d.fromId', 'left')
            ->join('users t', 't.id_users = d.toId', 'left')
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

        $userId = 1; // fallback
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
            'mailIncomingId' => $data['mailIncomingId'],
            'fromId' => $userId,
            'toId' => $data['toId'],
            'instruction' => $data['instruction'] ?? '',
            'status' => 'PENDING',
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
        ];

        $db->table('dispositions')->insert($insertData);
        $newDispId = $db->insertID();

        // Update the mail status to 'DISPOSED' or something if it was PENDING
        $db->table('mails_incoming')->where('id_mails_incoming', $data['mailIncomingId'])->update(['status' => 'DISPOSED', 'updatedAt' => date('Y-m-d H:i:s')]);

        // Create notification for recipient
        $mail = $db->table('mails_incoming')->select('letterNumber, subject')->where('id_mails_incoming', $data['mailIncomingId'])->get()->getRowArray();
        $db->table('notifications')->insert([
            'userId' => $data['toId'],
            'title' => 'Disposisi Baru: ' . ($mail['letterNumber'] ?? 'Surat'),
            'message' => 'Anda menerima disposisi baru dengan instruksi: ' . substr($data['instruction'] ?? '', 0, 50) . '...',
            'isRead' => 0,
            'createdAt' => date('Y-m-d H:i:s')
        ]);

        return $this->respondCreated(['status' => true, 'message' => 'Disposition inserted', 'id' => $newDispId]);
    }

    public function markAsRead($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('dispositions')->where('id_dispositions', $id)->where('status', 'PENDING')->update([
            'status' => 'READ',
            'updatedAt' => date('Y-m-d H:i:s')
        ]);
        return $this->respond(['status' => true, 'message' => 'Marked as read']);
    }

    public function markAsComplete($id = null)
    {
        $db = \Config\Database::connect();
        $disposition = $db->table('dispositions')->select('*, id_dispositions as id')->where('id_dispositions', $id)->get()->getRowArray();
        if ($disposition) {
            $db->table('dispositions')->where('id_dispositions', $id)->update([
                'status' => 'COMPLETED',
                'updatedAt' => date('Y-m-d H:i:s')
            ]);
            $db->table('mails_incoming')->where('id_mails_incoming', $disposition['mailIncomingId'])->update([
                'status' => 'COMPLETED',
                'updatedAt' => date('Y-m-d H:i:s')
            ]);
            return $this->respond(['status' => true, 'message' => 'Marked as completed']);
        }
        return $this->failNotFound();
    }
}
