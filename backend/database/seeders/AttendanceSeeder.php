<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Jalankan database seeder.
     *
     * @return void
     */
    public function run(): void
    {
        // Hapus data absensi lama
        Attendance::query()->delete();

        // Ambil data karyawan spesifik yang sudah kita buat
        $budi = Employee::where('first_name', 'Budi')->first();
        $citra = Employee::where('first_name', 'Citra')->first();
        $doni = Employee::where('first_name', 'Doni')->first();

        // Pastikan karyawan ditemukan sebelum membuat data
        if ($budi && $citra && $doni) {
            
            // --- DATA UNTUK BUDI SANTOSO (3 hari, normal) ---
            for ($d = 1; $d <= 3; $d++) {
                $date = Carbon::now()->subDays($d);
                // Masuk
                Attendance::create([ 
                    'employee_id' => $budi->id, 
                    'type' => 'Masuk', 
                    'attendance_time' => $date->copy()->setTime(8, 5, 10), 
                    'approval_status' => 'Approved', 
                    'status' => 'On Time',
                    'address_detail' => 'Jl. Jenderal Sudirman No. 1, Jakarta Pusat',
                    'latitude' => -6.2088,
                    'longitude' => 106.8456,
                ]);
                // Pulang
                Attendance::create([ 
                    'employee_id' => $budi->id, 
                    'type' => 'Pulang', 
                    'attendance_time' => $date->copy()->setTime(17, 3, 45), 
                    'approval_status' => 'Approved', 
                    'status' => 'On Time' 
                ]);
            }

            // --- DATA UNTUK CITRA LESTARI (bervariasi) ---
            // Hari 1 (Kemarin): Terlambat
            $date1 = Carbon::now()->subDays(1);
            Attendance::create([ 
                'employee_id' => $citra->id, 
                'type' => 'Masuk', 
                'attendance_time' => $date1->copy()->setTime(9, 15, 20), 
                'approval_status' => 'Approved', 
                'status' => 'Late' 
            ]);
            Attendance::create([ 
                'employee_id' => $citra->id, 
                'type' => 'Pulang', 
                'attendance_time' => $date1->copy()->setTime(17, 5, 10), 
                'approval_status' => 'Approved', 
                'status' => 'On Time' 
            ]);

            // Hari 2 (2 hari lalu): Menunggu Approval
            $date2 = Carbon::now()->subDays(2);
            Attendance::create([ 
                'employee_id' => $citra->id, 
                'type' => 'Masuk', 
                'attendance_time' => $date2->copy()->setTime(8, 30, 0), 
                'approval_status' => 'Pending', 
                'status' => 'On Time',
                'notes' => 'Absen dari lokasi klien di Bandung.'
            ]);
            
            // --- DATA UNTUK DONI FIRMANSYAH (Cuti) ---
            $date3 = Carbon::now()->subDays(3);
            Attendance::create([
                'employee_id' => $doni->id,
                'type' => 'Masuk', // Tipe tetap 'Masuk' tapi statusnya 'Annual Leave'
                'attendance_time' => $date3->copy()->setTime(8,0,0),
                'approval_status' => 'Approved',
                'status' => 'Annual Leave',
                'notes' => 'Cuti tahunan yang sudah disetujui.'
            ]);
        }
    }
}