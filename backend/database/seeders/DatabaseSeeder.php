<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Jalankan database seeder.
     *
     * @return void
     */
    public function run(): void
    {
        // Panggil seeder lain dalam urutan yang benar untuk menjaga relasi data
        $this->call([
            UserSeeder::class,       // 1. Membuat Users
            EmployeeSeeder::class,   // 2. Membuat Employees yang berelasi ke Users
            LetterSeeder::class,     // 3. Membuat Letters yang berelasi ke Employees
            AttendanceSeeder::class, // 4. Membuat Attendances yang berelasi ke Employees
        ]);
    }
}