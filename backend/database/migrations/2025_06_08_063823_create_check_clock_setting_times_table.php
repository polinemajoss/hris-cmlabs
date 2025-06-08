<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('check_clock_setting_times', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('check_clock_setting_id')->constrained('check_clock_settings')->onDelete('cascade');

            $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            $table->time('clock_in');
            $table->time('clock_out');
            $table->time('break_start')->nullable();
            $table->time('break_end')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('check_clock_setting_times');
    }
};