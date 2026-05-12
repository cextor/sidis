<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class MailsOutgoing extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();
        $mails = $db->table('mails_outgoing')->orderBy('createdAt', 'DESC')->get()->getResultArray();
        return $this->respond($mails);
    }

    public function create()
    {
        $db = \Config\Database::connect();
        $data = $this->request->getJSON(true);
        if (!$data) {
            $data = $this->request->getPost();
        }

        $insertData = [
            'id' => uniqid('out_'),
            'letterNumber' => $data['letterNumber'] ?? '',
            'dateSent' => $data['dateSent'] ?? null,
            'recipient' => $data['recipient'] ?? '',
            'subject' => $data['subject'] ?? '',
            'classification' => $data['classification'] ?? '',
            'status' => 'DRAFT',
            'createdBy' => 'system', // TODO: get from JWT
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
        ];

        $db->table('mails_outgoing')->insert($insertData);

        return $this->respondCreated(['status' => true, 'message' => 'Mail inserted', 'id' => $insertData['id']]);
    }
}
