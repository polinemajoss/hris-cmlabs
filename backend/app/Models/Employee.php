<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Employee extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'user_id', 'first_name', 'last_name', 'gender', 'mobile_number',
        'nik', 'birth_place', 'birth_date', 'education', 'position', 'grade',
        'branch', 'contract_type', 'bank', 'bank_account_number',
        'bank_account_name', 'sp_type', 'status', 'avatar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // UUID otomatis saat creating
    protected static function booted()
    {
         static::creating(function ($model) {
        if (empty($model->id)) {
            $model->id = (string) Str::uuid();
        }
        });
    }
}
