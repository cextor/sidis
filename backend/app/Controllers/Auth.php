<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;

class Auth extends ResourceController
{
    public function login()
    {
        $db = \Config\Database::connect();
        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        $user = $db->table('users')->where('email', $email)->get()->getRowArray();

        if (!$user) {
            return $this->failNotFound('Email not found');
        }

        if (!password_verify((string)$password, $user['password'])) {
            return $this->fail('Invalid password');
        }

        $key = env('JWT_SECRET');
        $payload = [
            'iat'  => time(),
            'exp'  => time() + 3600 * 24, // 1 day
            'uid'  => $user['id'],
            'email'=> $user['email'],
            'role' => $user['role']
        ];

        $token = JWT::encode($payload, $key, 'HS256');

        return $this->respond([
            'status' => true,
            'token'  => $token,
            'user'   => [
                'uid' => $user['id'],
                'displayName' => $user['displayName'],
                'email' => $user['email'],
                'role' => $user['role'],
                'avatarUrl' => $user['avatarUrl']
            ]
        ]);
    }

    public function register()
    {
        $db = \Config\Database::connect();
        $data = [
            'id' => uniqid('usr_'),
            'displayName' => $this->request->getVar('displayName'),
            'email' => $this->request->getVar('email'),
            'password' => password_hash((string)$this->request->getVar('password'), PASSWORD_DEFAULT),
            'role' => $this->request->getVar('role') ?? 'STAFF',
            'createdAt' => date('Y-m-d H:i:s')
        ];

        $db->table('users')->insert($data);

        return $this->respondCreated(['status' => true, 'message' => 'User registered']);
    }

    public function me()
    {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        $token = explode(' ', $header)[1];
        $key = env('JWT_SECRET');
        $decoded = JWT::decode($token, new \Firebase\JWT\Key($key, 'HS256'));

        $db = \Config\Database::connect();
        $user = $db->table('users')->where('id', $decoded->uid)->get()->getRowArray();
        
        if(!$user) return $this->failNotFound('User not found');

        return $this->respond([
            'status' => true,
            'user' => [
                'uid' => $user['id'],
                'displayName' => $user['displayName'],
                'email' => $user['email'],
                'role' => $user['role'],
                'avatarUrl' => $user['avatarUrl']
            ]
        ]);
    }
}
