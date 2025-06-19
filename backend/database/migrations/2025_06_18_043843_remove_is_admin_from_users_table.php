<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menghapus kolom 'is_admin'
            $table->dropColumn('is_admin');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menambahkan kembali kolom 'is_admin' jika migrasi di-rollback
            $table->boolean('is_admin')->default(false)->after('email'); // Sesuaikan posisi aslinya
        });
    }
};