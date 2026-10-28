<?php

namespace App\Models;

use CodeIgniter\Model;

class StoryModel extends Model
{
    protected $table = 'stories';
    protected $primaryKey = 'id';
    protected $allowedFields = ['year', 'title', 'description', 'image_path', 'sort_order'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
