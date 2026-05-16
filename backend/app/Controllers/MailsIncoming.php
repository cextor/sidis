<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class MailsIncoming extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();
        $mails = $db->table('mails_incoming')->select('*, id_mails_incoming as id')->where('status_cd IS NULL', null, false)->orWhere('status_cd !=', 'nullified')->orderBy('createdAt', 'DESC')->get()->getResultArray();
        
        // Return soft deleted items with "normal" status if needed, but normally we filter them out.
        // The user says "status surat yang tampil adalah normal", so we will fetch all and map:
        $allMails = $db->table('mails_incoming')->select('*, id_mails_incoming as id')->orderBy('createdAt', 'DESC')->get()->getResultArray();
        foreach($allMails as &$m) {
            if ($m['status_cd'] === 'nullified') {
                $m['status'] = 'normal';
            }
        }
        return $this->respond($allMails);
    }

    public function create()
    {
        $db = \Config\Database::connect();
        $data = $this->request->getPost();
        if (!$data) {
            $data = $this->request->getJSON(true);
        }

        $file = $this->request->getFile('file');
        $fileName = null;
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $fileName = $file->getRandomName();
            $file->move(FCPATH . 'uploads', $fileName);
        }

        $insertData = [
            'letterNumber' => $data['letterNumber'] ?? '',
            'dateReceived' => $data['dateReceived'] ?? date('Y-m-d'),
            'dateOnLetter' => $data['dateOnLetter'] ?? date('Y-m-d'),
            'expiryDate' => !empty($data['expiryDate']) ? $data['expiryDate'] : null,
            'sender' => $data['sender'] ?? '',
            'subject' => $data['subject'] ?? '',
            'classification' => $data['classification'] ?? '',
            'pdfUrl' => $fileName ? '/uploads/' . $fileName : null,
            'status' => 'PENDING',
            'createdBy' => 'system', // TODO: get from JWT
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
        ];

        $db->table('mails_incoming')->insert($insertData);

        return $this->respondCreated(['status' => true, 'message' => 'Mail inserted', 'id' => $db->insertID()]);
    }

    public function update($id = null)
    {
        $db = \Config\Database::connect();
        $disps = $db->table('dispositions')->where('mailIncomingId', $id)->countAllResults();
        if ($disps > 0) {
            return $this->fail('Membutuhkan persetujuan direktur');
        }

        $data = $this->request->getPost();
        if (!$data) $data = $this->request->getJSON(true);
        if (!$data) $data = $this->request->getRawInput();

        $updateData = [
            'letterNumber' => $data['letterNumber'] ?? '',
            'dateReceived' => $data['dateReceived'] ?? date('Y-m-d'),
            'dateOnLetter' => $data['dateOnLetter'] ?? date('Y-m-d'),
            'expiryDate' => !empty($data['expiryDate']) ? $data['expiryDate'] : null,
            'sender' => $data['sender'] ?? '',
            'subject' => $data['subject'] ?? '',
            'classification' => $data['classification'] ?? '',
            'updatedAt' => date('Y-m-d H:i:s'),
        ];

        $file = $this->request->getFile('file');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $fileName = $file->getRandomName();
            $file->move(FCPATH . 'uploads', $fileName);
            $updateData['pdfUrl'] = '/uploads/' . $fileName;
        }

        $db->table('mails_incoming')->where('id_mails_incoming', $id)->update($updateData);

        return $this->respond(['status' => true, 'message' => 'Mail updated']);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $disps = $db->table('dispositions')->where('mailIncomingId', $id)->countAllResults();
        if ($disps > 0) {
            return $this->fail('Membutuhkan persetujuan direktur');
        }
        $db->table('mails_incoming')->where('id_mails_incoming', $id)->update(['status_cd' => 'nullified']);
        return $this->respondDeleted(['status' => true, 'message' => 'Mail deleted (nullified)']);
    }
}
