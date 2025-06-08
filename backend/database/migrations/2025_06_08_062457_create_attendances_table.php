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
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('employee_id')->constrained('employees')->onDelete('cascade');

            $table->enum('type', ['Masuk', 'Pulang', 'Lembur Masuk', 'Lembur Pulang']);
            $table->dateTime('attendance_time');
            $table->string('photo_proof')->nullable(); // Menyimpan path ke file foto
            
            $table->text('address_detail')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 11, 7)->nullable();

            $table->enum('approval_status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->enum('status', ['On Time', 'Late', 'Absent', 'Sick Leave', 'Annual Leave'])->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};