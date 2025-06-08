<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CheckClockSettingTime extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function booted() {
        static::creating(fn($model) => $model->id = (string) Str::uuid());
    }

    protected $fillable = [
        'check_clock_setting_id', 'day', 'clock_in', 'clock_out',
        'break_start', 'break_end'
    ];

    /**
     * Sebuah waktu adalah milik satu jadwal.
     */
    public function setting()
    {
        return $this->belongsTo(CheckClockSetting::class, 'check_clock_setting_id');
    }
}