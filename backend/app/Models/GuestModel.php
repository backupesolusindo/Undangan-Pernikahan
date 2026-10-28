<?php

namespace App\Models;

use CodeIgniter\Model;

class GuestModel extends Model
{
    protected $table = 'guests';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'phone', 'status', 'guest_count', 'message', 'created_at'];
    protected $useTimestamps = false;
}
