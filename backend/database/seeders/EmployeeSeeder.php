<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str; // Tambahkan ini jika belum ada

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Temukan atau buat user 'Noah White'
        $user = User::firstWhere('email', 'noah@example.com');

        if (!$user) {
            // Buat user jika belum ada. Pastikan ID digenerate sebagai UUID.
            $user = User::create([
                'id' => (string) Str::uuid(), // Asumsi 'id' di tabel users adalah UUID
                'name' => 'Noah White',
                'email' => 'noah@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(), // Opsional: Set verified
            ]);
            $this->command->info('User "Noah White" created.');
        } else {
            $this->command->info('User "Noah White" already exists.');
        }

        // 2. Gunakan ID dari user yang sudah ada atau yang baru dibuat
        $employeeUserId = $user->id; // <-- PENTING: Gunakan ID user yang benar di sini!

        // 3. Buat atau perbarui employee menggunakan ID user yang benar
        Employee::firstOrCreate(
            ['nik' => '1234567890123456'], // Field unik untuk memeriksa keberadaan employee
            [
                'id' => (string) Str::uuid(), // Asumsi 'id' di tabel employees adalah UUID
                'user_id' => $employeeUserId, // <-- Gunakan ID user yang benar di sini
                'first_name' => 'Noah',
                'last_name' => 'White',
                'gender' => 'M',
                'mobile_number' => '081961186366',
                'nik' => '1234567890123456', // Pastikan NIK ini unik dan tidak bentrok
                'birth_place' => 'Palembang',
                'birth_date' => '1995-06-15',
                'education' => 'S1 Teknik Informatika',
                'position' => 'Intern',
                'grade' => 'Management',
                'branch' => 'Palembang',
                'contract_type' => 'Kontrak',
                'bank' => 'BCA',
                'bank_account_number' => '1234567890',
                'bank_account_name' => 'Noah White',
                'sp_type' => 'SP1',
                'status' => 'Aktif',
                'avatar' => null,
            ]
        );

        $this->command->info('Employee "Noah White" seeded successfully (or already exists).');
    }
}