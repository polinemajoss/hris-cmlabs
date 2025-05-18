<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\CheckClockController;

// Public routes
Route::post('/sign-in', [AuthController::class, 'signIn']);
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-up/verify', [AuthController::class, 'verifyEmail']);
Route::post('/sign-out', [AuthController::class, 'signOut']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('/try-for-free', [AuthController::class, 'tryForFree']);

Route::get('/api/employee', [AuthController::class, 'employee']);
Route::get('/api/employee/{id}', [AuthController::class, 'employeeById']);

// Authenticated routes (via Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});


//     // Tambahkan route lain yang membutuhkan autentikasi di sini
//     Route::apiResource('employees', EmployeeController::class);
//     Route::apiResource('salaries', SalaryController::class);
//     Route::apiResource('letters', LetterController::class);
//     Route::apiResource('check-clocks', CheckClockController::class);
// });
