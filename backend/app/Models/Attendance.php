<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids; // <-- 1. Tambahkan import ini
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory, HasUuids; // <-- 2. Tambahkan trait HasUuids di sini

    /**
     * Kolom-kolom yang boleh diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'type',
        'attendance_time',
        'photo_proof',
        'address_detail',
        'latitude',
        'longitude',
        'approval_status',
        'status',
        'notes',
    ];

    /**
     * Tipe data cast untuk atribut.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'attendance_time' => 'datetime',
    ];

    /**
     * Mendefinisikan relasi ke model Employee.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}