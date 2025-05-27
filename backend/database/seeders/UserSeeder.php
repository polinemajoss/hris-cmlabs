<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;  
use Illuminate\Support\Str;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Noah White',
            'email' => 'noah@example.com',
            'password' => bcrypt('password'),
        ]);
    }
}
