<?php

namespace App\Models;

use CodeIgniter\Model;

class CoupleModel extends Model
{
    protected $table = 'couple_photos';
    protected $primaryKey = 'id';
    protected $allowedFields = ['role', 'nickname', 'name', 'father', 'mother', 'instagram', 'image_path'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
