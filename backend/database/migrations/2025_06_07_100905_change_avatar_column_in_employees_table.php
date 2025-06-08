<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Mengubah kolom 'avatar' menjadi tipe TEXT yang bisa null
            // Tipe TEXT bisa menampung hingga 64KB, cukup untuk Base64 gambar avatar
            $table->text('avatar')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Mengembalikan ke tipe semula jika migrasi di-rollback
            // Ganti 255 jika panjang awal VARCHAR Anda berbeda
            $table->string('avatar', 255)->nullable()->change();
        });
    }
};