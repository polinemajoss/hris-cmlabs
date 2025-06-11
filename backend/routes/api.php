<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\CheckClockController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\CheckClockSettingController;
use App\Http\Controllers\Api\AvatarUploadController;
use App\Http\Controllers\Api\SalaryController;
use App\Http\Controllers\Api\SidebarCountController; // <-- Tambahkan import ini


/*
|--------------------------------------------------------------------------
| Rute API
|--------------------------------------------------------------------------
| Di sini Anda bisa mendaftarkan rute API untuk aplikasi Anda.
*/

//== 1. Rute Publik (Otentikasi & Google) ==
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-in', [AuthController::class, 'signIn']);
Route::post('/sign-up/verify', [AuthController::class, 'verifyEmail']);
Route::post('/sign-out', [AuthController::class, 'signOut']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('/try-for-free', [AuthController::class, 'tryForFree']);

Route::middleware(['web'])->group(function () {
    Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

//== 2. Rute Terotentikasi (Sanctum) ==
// Rute ini akan membutuhkan token otentikasi.
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Anda bisa memindahkan resource yang butuh login ke sini, contoh:
    // Route::apiResource('salaries', SalaryController::class);
});


//== 3. Rute Resource Utama Aplikasi ==
// Rute-rute ini adalah inti dari fungsionalitas aplikasi Anda.
// Diasumsikan saat ini bisa diakses secara publik sesuai kode Anda.

// Karyawan
Route::apiResource('employees', EmployeeController::class);
Route::post('/upload-avatar', [AvatarUploadController::class, 'store']);
Route::get('/employees/{employee}/download-pdf', [EmployeeController::class, 'downloadPDF']);
// Absensi
Route::apiResource('attendances', AttendanceController::class);
Route::post('/attendances/{attendance}/approve', [AttendanceController::class, 'approve']);
Route::apiResource('check-clock-settings', CheckClockSettingController::class);

// Gaji
Route::apiResource('salaries', SalaryController::class);

// Surat (Menggunakan apiResource untuk semua endpoint CRUD)
Route::apiResource('letters', LetterController::class);

// Sidebar Counts
Route::get('/sidebar-counts', [SidebarCountController::class, 'index']);

