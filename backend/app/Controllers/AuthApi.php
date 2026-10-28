<?php

namespace App\Controllers;

use App\Models\AdminModel;
use CodeIgniter\API\ResponseTrait;

class AuthApi extends BaseController
{
    use ResponseTrait;

    protected $adminModel;

    public function __construct()
    {
        $this->adminModel = new AdminModel();
        helper(['url']);
    }

    private function cors()
    {
        $this->response->setHeader('Access-Control-Allow-Origin', '*');
        $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }

    /**
     * POST /api/auth/login
     * Accepts JSON {username, password}
     * Returns token + user info on success
     */
    public function login()
    {
        $this->cors();

        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $json = $this->request->getJSON();

        if (empty($json)) {
            $json = (object) [
                'username' => $this->request->getPost('username'),
                'password' => $this->request->getPost('password'),
            ];
        }

        $username = $json->username ?? '';
        $password = $json->password ?? '';

        if (empty($username) || empty($password)) {
            return $this->failValidationErrors('Username dan password wajib diisi.');
        }

        $admin = $this->adminModel->where('username', $username)->first();

        if (! $admin || ! password_verify($password, $admin['password'])) {
            return $this->failUnauthorized('Username atau password salah.');
        }

        // Generate a new API token
        $token = bin2hex(random_bytes(32));

        $this->adminModel->update($admin['id'], [
            'api_token' => $token,
        ]);

        return $this->respond([
            'status' => 'success',
            'token'  => $token,
            'user'   => [
                'id'       => (int) $admin['id'],
                'username' => $admin['username'],
                'name'     => $admin['name'],
            ],
        ]);
    }

    /**
     * POST /api/auth/logout
     * Requires auth. Clears api_token.
     */
    public function logout()
    {
        $this->cors();

        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $admin = $this->getAuthAdmin();
        if (! $admin) {
            return $this->failUnauthorized('Unauthorized.');
        }

        $this->adminModel->update($admin['id'], [
            'api_token' => null,
        ]);

        return $this->respond([
            'status'  => 'success',
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * GET /api/auth/me
     * Requires auth. Returns current user info.
     */
    public function me()
    {
        $this->cors();

        if (strtoupper($this->request->getMethod()) === 'OPTIONS') {
            return $this->response->setStatusCode(200)->setBody('');
        }

        $admin = $this->getAuthAdmin();
        if (! $admin) {
            return $this->failUnauthorized('Unauthorized.');
        }

        return $this->respond([
            'status' => 'success',
            'user'   => [
                'id'       => (int) $admin['id'],
                'username' => $admin['username'],
                'name'     => $admin['name'],
            ],
        ]);
    }

    /**
     * Get admin from Authorization header.
     */
    private function getAuthAdmin(): ?array
    {
        // First check if filter already set admin on request
        if (isset($this->request->admin)) {
            return $this->request->admin;
        }

        $authHeader = $this->request->getHeaderLine('Authorization');
        if (empty($authHeader) || ! str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        $token = trim(substr($authHeader, 7));
        if (empty($token)) {
            return null;
        }

        return $this->adminModel->where('api_token', $token)->first();
    }
}
