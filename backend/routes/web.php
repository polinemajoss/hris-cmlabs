<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\AuthController;
// use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return view('welcome');
});

// Route::post('/sign-in', [AuthController::class, 'sign-in']);
// Route::post('/sign-out', [AuthController::class, 'sign-out']);
// return Auth::user();
// return response()->json(Auth::user());

// Route::get('/sanctum/csrf-cookie', function () {
//     return response()->json(['message' => 'CSRF cookie set']);
// });