<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\CheckClockController;

// Public routes
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-in', [AuthController::class, 'signIn']);
Route::post('/sign-up/verify', [AuthController::class, 'verifyEmail']);
Route::post('/sign-out', [AuthController::class, 'signOut']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('/try-for-free', [AuthController::class, 'tryForFree']);

// Authenticated routes (via Sanctum token)
// Biarkan group ini tetap ada.
// BypassAuth di Kernel.php akan menangani bypass ini jika AUTH_ENABLED=false.
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
})->name('sanctum.csrf-cookie');

Route::middleware(['web'])->group(function () {
    Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// Protected Employee Routes
// Anda sudah mengomentari baris ini, yang artinya 'employees' sekarang public.
// Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('employees', EmployeeController::class);
// });

// Anda juga bisa mengaktifkan route di bawah ini jika ingin mereka juga bisa diakses tanpa auth.
// Cukup pindahkan mereka keluar dari group auth:sanctum (jika sebelumnya ada di sana)
// atau uncomment tanpa middleware.
// Route::apiResource('salaries', SalaryController::class);
// Route::apiResource('letters', LetterController::class);
// Route::apiResource('check-clocks', CheckClockController::class);