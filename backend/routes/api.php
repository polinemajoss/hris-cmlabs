<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\CheckClockController;
use App\Http\Controllers\CheckClockSettingController; // Jangan lupa import

// Public routes (Autentikasi awal)
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-in', [AuthController::class, 'signIn']);
Route::post('/sign-up/verify', [AuthController::class, 'verifyEmail']);
Route::post('/sign-out', [AuthController::class, 'signOut']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('/try-for-free', [AuthController::class, 'tryForFree']);

// Google OAuth routes (biasanya di group 'web')
Route::middleware(['web'])->group(function () {
    Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// Route Sanctum CSRF cookie (Penting untuk Next.js dengan Sanctum)
Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
})->name('sanctum.csrf-cookie');

// Semua route di dalam group ini akan di-bypass jika AUTH_ENABLED=false
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Resource routes untuk fitur utama
    Route::apiResource('employees', EmployeeController::class);
    Route::apiResource('salaries', SalaryController::class);
    Route::apiResource('letter-formats', LetterController::class); // Sesuaikan nama controller jika beda
    Route::apiResource('letters', LetterController::class); // Sesuaikan nama controller jika beda
    Route::apiResource('check-clock-settings', CheckClockSettingController::class);
    Route::apiResource('check-clocks', CheckClockController::class);

    // Tambahkan route lain yang membutuhkan autentikasi di sini
});