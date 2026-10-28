<?php

namespace App\Models;

use CodeIgniter\Model;

class InviteeModel extends Model
{
    protected $table = 'invitees';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'slug', 'phone', 'notes'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
