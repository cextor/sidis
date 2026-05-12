<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class MailsIncoming extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();
        $mails = $db->table('mails_incoming')->orderBy('createdAt', 'DESC')->get()->getResultArray();
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
            'id' => uniqid('inc_'),
            'letterNumber' => $data['letterNumber'] ?? '',
            'dateReceived' => $data['dateReceived'] ?? date('Y-m-d'),
            'dateOnLetter' => $data['dateOnLetter'] ?? date('Y-m-d'),
            'sender' => $data['sender'] ?? '',
            'subject' => $data['subject'] ?? '',
            'classification' => $data['classification'] ?? '',
            'status' => 'PENDING',
            'createdBy' => 'system', // TODO: get from JWT
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
        ];

        $db->table('mails_incoming')->insert($insertData);

        return $this->respondCreated(['status' => true, 'message' => 'Mail inserted', 'id' => $insertData['id']]);
    }
}
