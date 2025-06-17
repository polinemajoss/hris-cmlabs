<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Letter;
use Carbon\Carbon;

class LetterSeeder extends Seeder
{
    /**
     * Jalankan database seeder.
     *
     * @return void
     */
    public function run(): void
    {
        Letter::query()->delete();

        // Cari karyawan berdasarkan nama untuk ditambahkan surat
        $citra = Employee::where('first_name', 'Citra')->first();
        $doni = Employee::where('first_name', 'Doni')->first();
        $rina = Employee::where('first_name', 'Rina')->first();

        if ($citra) {
            Letter::create([
                'employee_id' => $citra->id, 'title' => 'Pengajuan Cuti Tahunan', 'type' => 'Cuti',
                'date' => Carbon::now()->addDays(10), 'status' => 'Pending', 'content' => 'Mengajukan cuti tahunan untuk keperluan keluarga.'
            ]);
            Letter::create([
                'employee_id' => $citra->id, 'title' => 'Permohonan Izin Sakit', 'type' => 'Sakit',
                'date' => Carbon::now()->subDays(20), 'status' => 'Approved', 'content' => 'Permohonan izin sakit karena demam, surat dokter terlampir.'
            ]);
        }
        
        if ($doni) {
             Letter::create([
                'employee_id' => $doni->id, 'title' => 'Surat Perintah Tugas ke Bandung', 'type' => 'Tugas',
                'date' => Carbon::now()->subDays(5), 'status' => 'Approved', 'content' => 'Melakukan perjalanan dinas ke Cabang Bandung untuk audit proyek.'
            ]);
        }

        if ($rina) {
             Letter::create([
                'employee_id' => $rina->id, 'title' => 'Pengajuan Izin Tidak Masuk', 'type' => 'Izin',
                'date' => Carbon::now()->subDays(3), 'status' => 'Rejected', 'content' => 'Izin tidak masuk karena ada urusan pribadi mendadak.'
            ]);
        }
    }
}