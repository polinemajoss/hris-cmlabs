<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // buat kolom user_id sebagai uuid
            $table->uuid('user_id');

            // indeks untuk user_id agar pencarian lebih cepat
            $table->index('user_id');

            // foreign key constraint ke users.id dengan cascade delete
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->enum('gender', ['M', 'F']);
            $table->string('mobile_number', 20)->nullable();
            $table->string('nik', 20)->nullable()->unique();
            $table->string('birth_place', 100)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('education', 100)->nullable();
            $table->string('position', 100)->nullable();
            $table->string('grade', 50)->nullable();
            $table->string('branch', 100)->nullable();
            $table->enum('contract_type', ['Tetap', 'Kontrak', 'Lepas'])->nullable();
            $table->string('bank', 50)->nullable();
            $table->string('bank_account_number', 50)->nullable();
            $table->string('bank_account_name', 100)->nullable();
            $table->string('sp_type', 50)->nullable();
            $table->enum('status', ['Aktif', 'Tidak Aktif'])->nullable();
            $table->string('avatar')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
