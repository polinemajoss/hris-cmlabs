<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Jalankan database seeder.
     *
     * @return void
     */
    public function run(): void
    {
        // Hapus data pengguna lama untuk menghindari duplikasi
        User::query()->delete();

        // Siapkan data pengguna yang spesifik
        $usersData = [
            ['name' => 'Budi Santoso', 'email' => 'budi.santoso@cmlabs.co', 'is_admin' => true],
            ['name' => 'Citra Lestari', 'email' => 'citra.lestari@cmlabs.co', 'is_admin' => false],
            ['name' => 'Doni Firmansyah', 'email' => 'doni.firmansyah@cmlabs.co', 'is_admin' => false],
            ['name' => 'Eka Putri', 'email' => 'eka.putri@cmlabs.co', 'is_admin' => false],
            ['name' => 'Fajar Nugraha', 'email' => 'fajar.nugraha@cmlabs.co', 'is_admin' => false],
            ['name' => 'Gita Wulandari', 'email' => 'gita.wulandari@cmlabs.co', 'is_admin' => false],
            ['name' => 'Hendra Setiawan', 'email' => 'hendra.setiawan@cmlabs.co', 'is_admin' => false],
            ['name' => 'Indah Permata', 'email' => 'indah.permata@cmlabs.co', 'is_admin' => false],
            ['name' => 'Joko Prasetyo', 'email' => 'joko.prasetyo@cmlabs.co', 'is_admin' => false],
            ['name' => 'Kartika Dewi', 'email' => 'kartika.dewi@cmlabs.co', 'is_admin' => false],
            ['name' => 'Lukman Hakim', 'email' => 'lukman.hakim@cmlabs.co', 'is_admin' => false],
            ['name' => 'Maya Sari', 'email' => 'maya.sari@cmlabs.co', 'is_admin' => false],
            ['name' => 'Nanda Pratama', 'email' => 'nanda.pratama@cmlabs.co', 'is_admin' => false],
            ['name' => 'Olivia Ratna', 'email' => 'olivia.ratna@cmlabs.co', 'is_admin' => false],
            ['name' => 'Pandu Wijaya', 'email' => 'pandu.wijaya@cmlabs.co', 'is_admin' => false],
            ['name' => 'Rina Amelia', 'email' => 'rina.amelia@cmlabs.co', 'is_admin' => false],
            ['name' => 'Samsul Arifin', 'email' => 'samsul.arifin@cmlabs.co', 'is_admin' => false],
            ['name' => 'Tika Hartono', 'email' => 'tika.hartono@cmlabs.co', 'is_admin' => false],
            ['name' => 'Umar Said', 'email' => 'umar.said@cmlabs.co', 'is_admin' => false],
            ['name' => 'Vina Yuliana', 'email' => 'vina.yuliana@cmlabs.co', 'is_admin' => false],
        ];

        foreach ($usersData as $user) {
            User::create([
                'id' => Str::uuid(),
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'), // password default untuk semua user
                'email_verified_at' => now(),
                'is_admin' => $user['is_admin'],
            ]);
        }
    }
}