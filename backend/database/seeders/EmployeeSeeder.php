<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // kamu bisa sesuaikan user_id ini sesuai user yang ada di tabel `users`
        $user_id = \App\Models\User::first()?->id ?? 1;

       $user = User::firstWhere('email', 'noah@example.com');
        if (!$user) {
            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => 'Noah White',
                'email' => 'noah@example.com',
                'password' => bcrypt('password'),
            ]);
        }


        Employee::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user_id,
            'first_name' => 'Noah',
            'last_name' => 'White',
            'gender' => 'M',
            'mobile_number' => '081961186366',
            'nik' => '1234567890123456',
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
        ]);
    }
}
