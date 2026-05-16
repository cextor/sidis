<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class DashboardController extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();

        $incomingCount = $db->table('mails_incoming')->countAllResults();
        $outgoingCount = $db->table('mails_outgoing')->countAllResults();
        $completedCount = $db->table('mails_incoming')->where('status', 'COMPLETED')->countAllResults();
        $pendingCount = $db->table('mails_incoming')->where('status !=', 'COMPLETED')->countAllResults();

        $recentMails = $db->table('mails_incoming')
            ->select('*, id_mails_incoming as id')
            ->orderBy('createdAt', 'DESC')
            ->limit(5)
            ->get()->getResultArray();

        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        $notifs = [];
        if($header) {
            $token = explode(' ', $header)[1];
            try {
                $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
                $uid = $decoded->uid;
                $notifs = $db->table('notifications')
                    ->select('*, id_notifications as id')
                    ->where('userId', $uid)
                    ->orderBy('createdAt', 'DESC')
                    ->limit(3)
                    ->get()->getResultArray();
            } catch (\Exception $e) {}
        }

        return $this->respond([
            'stats' => [
                'incoming' => $incomingCount,
                'outgoing' => $outgoingCount,
                'completed' => $completedCount,
                'pending' => $pendingCount
            ],
            'recentMails' => $recentMails,
            'notifications' => $notifs
        ]);
    }
}
