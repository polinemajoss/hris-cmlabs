<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('check_clock_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // Nama Jadwal, mis: "Jadwal Kantor Pusat"
            $table->enum('type', ['WFO', 'WFA', 'Hybrid']); // Sesuai dokumen 

            // Field untuk lokasi sesuai deskripsi 
            $table->string('location_name')->nullable(); // Mis: "Kantor Malang"
            $table->text('location_address')->nullable();
            $table->decimal('location_lat', 10, 7)->nullable();
            $table->decimal('location_long', 11, 7)->nullable();
            $table->integer('radius')->default(100); // Radius dalam meter 

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('check_clock_settings');
    }
};