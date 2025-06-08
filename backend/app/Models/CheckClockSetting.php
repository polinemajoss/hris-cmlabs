<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class CheckClockSetting extends Model
{
    use HasFactory, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function booted() {
        static::creating(fn($model) => $model->id = (string) Str::uuid());
    }

    protected $fillable = [
        'name', 'type', 'location_name', 'location_address',
        'location_lat', 'location_long', 'radius'
    ];

    /**
     * Sebuah jadwal memiliki banyak detail waktu (per hari).
     */
    public function times()
    {
        return $this->hasMany(CheckClockSettingTime::class);
    }
}