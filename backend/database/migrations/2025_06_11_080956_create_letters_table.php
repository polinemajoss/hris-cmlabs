<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi.
     */
    public function up(): void
    {
        Schema::create('letters', function (Blueprint $table) {
            // Menggunakan UUID sebagai primary key agar konsisten
            $table->uuid('id')->primary(); 
            
            // --- PERBAIKAN UTAMA ---
            // Menggunakan foreignUuid untuk membuat foreign key yang tipenya UUID
            $table->foreignUuid('employee_id')
                  ->constrained('employees')
                  ->onDelete('cascade');
            
            $table->string('title');
            $table->string('type');
            $table->date('date');
            $table->enum('status', ['Approved', 'Pending', 'Rejected'])->default('Pending');
            $table->text('content')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Batalkan migrasi.
     */
    public function down(): void
    {
        Schema::dropIfExists('letters');
    }
};
