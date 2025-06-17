<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Salary extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function booted() {
        static::creating(fn($model) => $model->id = (string) Str::uuid());
    }

    protected $fillable = [
        'employee_id',
        'amount',
        'type',
        'effective_date',
    ];

    // Relasi ke model Employee
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}