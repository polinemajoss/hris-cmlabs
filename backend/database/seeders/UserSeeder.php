<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str; // Pastikan ini sudah diimpor

class UserSeeder extends Seeder
{
    /**
     * Jalankan database seeder.
     *
     * @return void
     */
    public function run(): void
    {
        // Hapus data pengguna lama untuk menghindari duplikasi saat seeding ulang
        // HANYA JIKA ANDA INGIN MENGHAPUS SEMUA USER SETIAP KALI SEEDER DIJALANKAN.
        // Hati-hati jika sudah ada data asli di produksi!
        User::query()->delete();

        // Siapkan data pengguna dengan peran (role) yang spesifik
        $usersData = [
            // Super Admin (Hak akses tertinggi, bisa melakukan semua)
            ['name' => 'Super Admin', 'email' => 'super.admin@cmlabs.co', 'role' => 'super_admin'],

            // HR Admin (Mengelola karyawan, gaji, dll.)
            ['name' => 'Budi Santoso (HR)', 'email' => 'budi.santoso@cmlabs.co', 'role' => 'hr_admin'],
            ['name' => 'Kartika Dewi (HR)', 'email' => 'kartika.dewi@cmlabs.co', 'role' => 'hr_admin'],

            // Manager (Mengelola tim, menyetujui permintaan bawahan)
            ['name' => 'Doni Firmansyah (Manager)', 'email' => 'doni.firmansyah@cmlabs.co', 'role' => 'manager'],
            ['name' => 'Fajar Nugraha (Manager)', 'email' => 'fajar.nugraha@cmlabs.co', 'role' => 'manager'],

            // Employee (Karyawan biasa)
            ['name' => 'Citra Lestari (Employee)', 'email' => 'citra.lestari@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Eka Putri (Employee)', 'email' => 'eka.putri@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Gita Wulandari (Employee)', 'email' => 'gita.wulandari@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Hendra Setiawan (Employee)', 'email' => 'hendra.setiawan@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Indah Permata (Employee)', 'email' => 'indah.permata@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Joko Prasetyo (Employee)', 'email' => 'joko.prasetyo@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Lukman Hakim (Employee)', 'email' => 'lukman.hakim@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Maya Sari (Employee)', 'email' => 'maya.sari@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Nanda Pratama (Employee)', 'email' => 'nanda.pratama@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Olivia Ratna (Employee)', 'email' => 'olivia.ratna@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Pandu Wijaya (Employee)', 'email' => 'pandu.wijaya@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Rina Amelia (Employee)', 'email' => 'rina.amelia@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Samsul Arifin (Employee)', 'email' => 'samsul.arifin@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Tika Hartono (Employee)', 'email' => 'tika.hartono@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Umar Said (Employee)', 'email' => 'umar.said@cmlabs.co', 'role' => 'employee'],
            ['name' => 'Vina Yuliana (Employee)', 'email' => 'vina.yuliana@cmlabs.co', 'role' => 'employee'],
        ];

        foreach ($usersData as $user) {
            User::create([
                'id' => Str::uuid(), // Asumsi 'id' adalah UUID
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'), // Password default untuk semua user
                'email_verified_at' => now(),
                'role' => $user['role'], // Menggunakan kolom 'role' yang baru
            ]);
        }
    }
}