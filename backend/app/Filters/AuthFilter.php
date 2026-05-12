<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $key = env('JWT_SECRET');
        $header = $request->getServer('HTTP_AUTHORIZATION');
        if (!$header) {
            return \Config\Services::response()
                ->setJSON(['status' => false, 'message' => 'Token Required'])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }
        $token = explode(' ', $header)[1] ?? '';

        if (empty($token)) {
            return \Config\Services::response()
                ->setJSON(['status' => false, 'message' => 'Token Not Found'])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            // Optionally, pass user data to request
        } catch (Exception $ex) {
            return \Config\Services::response()
                ->setJSON(['status' => false, 'message' => 'Invalid Token'])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}
