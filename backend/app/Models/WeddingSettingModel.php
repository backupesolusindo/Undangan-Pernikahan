<?php

namespace App\Models;

use CodeIgniter\Model;

class WeddingSettingModel extends Model
{
    protected $table = 'wedding_settings';
    protected $primaryKey = 'id';
    protected $allowedFields = ['setting_key', 'setting_value'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    /**
     * Get all settings as an associative key => value array.
     */
    public function getAll(): array
    {
        $rows = $this->findAll();
        $result = [];
        foreach ($rows as $row) {
            $result[$row['setting_key']] = $row['setting_value'];
        }
        return $result;
    }

    /**
     * Upsert multiple settings from a key => value array.
     */
    public function setMany(array $data): void
    {
        foreach ($data as $key => $value) {
            $existing = $this->where('setting_key', $key)->first();
            if ($existing) {
                $this->update($existing['id'], [
                    'setting_key'   => $key,
                    'setting_value' => $value,
                ]);
            } else {
                $this->insert([
                    'setting_key'   => $key,
                    'setting_value' => $value,
                ]);
            }
        }
    }
}
