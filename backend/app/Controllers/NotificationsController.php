<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class NotificationsController extends ResourceController
{
    private function getUserId()
    {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if(!$header) return null;
        $token = explode(' ', $header)[1];
        $key = env('JWT_SECRET');
        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            return $decoded->uid;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function index()
    {
        $uid = $this->getUserId();
        if (!$uid) return $this->failUnauthorized();

        $db = \Config\Database::connect();
        $notifs = $db->table('notifications')
            ->where('userId', $uid)
            ->orderBy('createdAt', 'DESC')
            ->limit(20)
            ->get()->getResultArray();
            
        return $this->respond($notifs);
    }

    public function markAsRead()
    {
        $uid = $this->getUserId();
        if (!$uid) return $this->failUnauthorized();

        $db = \Config\Database::connect();
        $db->table('notifications')->where('userId', $uid)->update(['isRead' => 1]);

        return $this->respond(['status' => true]);
    }
}
