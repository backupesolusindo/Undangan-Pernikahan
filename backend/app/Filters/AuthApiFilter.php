<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\AdminModel;

class AuthApiFilter implements FilterInterface
{
    /**
     * Check the Authorization header for a valid Bearer token.
     * On OPTIONS preflight, return 200 immediately.
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        // Handle CORS preflight
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            $response = service('response');
            $response->setHeader('Access-Control-Allow-Origin', '*');
            $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            $response->setStatusCode(200);
            $response->setBody('');
            return $response;
        }

        $authHeader = $request->getHeaderLine('Authorization');

        if (empty($authHeader) || ! str_starts_with($authHeader, 'Bearer ')) {
            $response = service('response');
            $response->setHeader('Access-Control-Allow-Origin', '*');
            $response->setHeader('Content-Type', 'application/json');
            $response->setStatusCode(401);
            $response->setBody(json_encode([
                'status'  => 'error',
                'message' => 'Unauthorized. Token is missing.',
            ]));
            return $response;
        }

        $token = trim(substr($authHeader, 7));

        if (empty($token)) {
            $response = service('response');
            $response->setHeader('Access-Control-Allow-Origin', '*');
            $response->setHeader('Content-Type', 'application/json');
            $response->setStatusCode(401);
            $response->setBody(json_encode([
                'status'  => 'error',
                'message' => 'Unauthorized. Token is empty.',
            ]));
            return $response;
        }

        $adminModel = new AdminModel();
        $admin = $adminModel->where('api_token', $token)->first();

        if (! $admin) {
            $response = service('response');
            $response->setHeader('Access-Control-Allow-Origin', '*');
            $response->setHeader('Content-Type', 'application/json');
            $response->setStatusCode(401);
            $response->setBody(json_encode([
                'status'  => 'error',
                'message' => 'Unauthorized. Invalid token.',
            ]));
            return $response;
        }

        // Store admin data in request attributes for controller access
        $request->admin = $admin;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No after processing needed
    }
}
