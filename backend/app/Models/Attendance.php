<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id', 'type', 'attendance_time', 'photo_proof',
        'address_detail', 'latitude', 'longitude', 'location_name', // <-- TAMBAHKAN DI SINI
        'approval_status', 'status', 'notes',
    ];
}
