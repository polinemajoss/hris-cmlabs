<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import Controllers
use App\Http\Controllers\AuthController; // AuthController
use App\Http\Controllers\EmployeeController; // EmployeeController
use App\Http\Controllers\LetterController; // LetterController
use App\Http\Controllers\CheckClockController; // CheckClockController
use App\Http\Controllers\Api\AttendanceController; // AttendanceController
use App\Http\Controllers\Api\CheckClockSettingController; // CheckClockSettingController
use App\Http\Controllers\Api\AvatarUploadController; // AvatarUploadController
use App\Http\Controllers\Api\SalaryController; // SalaryController
use App\Http\Controllers\Api\SidebarCountController; // SidebarCountController


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Here you can register API routes for your application.
|
| All routes here are assumed to be under the `/api` prefix by default
| because this file is loaded by RouteServiceProvider.
*/

//== 1. Public Routes (Authentication & Registration) ==
// These routes do not require a token and can be accessed by anyone.
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-in', [AuthController::class, 'signIn']);
// Route::post('/sign-up/verify', [AuthController::class, 'verifyEmail']); // If present, add middleware if needed
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('/try-for-free', [AuthController::class, 'tryForFree']);

// Google OAuth Routes (require 'web' middleware because they involve sessions & redirects)
Route::middleware(['web'])->group(function () {
    Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

//== 2. Authenticated Routes (Require Sanctum token) ==
// All routes within this group will require a logged-in user.
Route::middleware('auth:sanctum')->group(function () {
    // Logout Route (accessed by the logged-in user)
    Route::post('/sign-out', [AuthController::class, 'signOut']);

    // Route to get information about the logged-in user
    Route::get('/user', function (Request $request) {
        // Returns the logged-in user with all its attributes (including role)
        return response()->json($request->user());
    });

    //=== Route Groups Based on Role ===

    // Group: HR Admin & Super Admin
    // These routes can only be accessed by users with 'hr_admin' or 'super_admin' roles.
    Route::group(['middleware' => ['role:hr_admin,super_admin']], function () {
        // Employees (full CRUD by HR Admin & Super Admin)
        Route::apiResource('employees', EmployeeController::class); // index, store, show, update, destroy

        // Avatar Upload (only admins can upload/update all employee avatars)
        Route::post('/upload-avatar', [AvatarUploadController::class, 'store']); // Image upload endpoint

        // Check Clock Settings (only admins can manage these settings)
        Route::apiResource('check-clock-settings', CheckClockSettingController::class);

        // Salaries (full CRUD by HR Admin & Super Admin)
        Route::apiResource('salaries', SalaryController::class);

        // Sidebar Counts (admin might have a different view or access to all counts)
        Route::get('/sidebar-counts', [SidebarCountController::class, 'index']); // Example admin-specific route
    });

    // Group: Manager, HR Admin, & Super Admin
    // These routes can be accessed by Manager, HR Admin, and Super Admin.
    Route::group(['middleware' => ['role:manager,hr_admin,super_admin']], function () {
        // Attendance (Managers can view their team's attendance, HR can view all)
        Route::apiResource('attendances', AttendanceController::class); // Manager can view, HR can CRUD
        Route::post('/attendances/{attendance}/approve', [AttendanceController::class, 'approve']); // Manager/HR can approve attendance

        // Letters (Managers can view/approve subordinate letters, HR Admin can do all)
        // LetterController@store and update might need to be adjusted via Policy for Managers
        Route::apiResource('letters', LetterController::class);
    });

    // Group: Employee, Manager, HR Admin, & Super Admin (all authenticated users)
    // These routes can be accessed by ALL logged-in users.
    // Place general routes here.

    // Employees (Read employee data - all users can read)
    // Route::get('/employees', [EmployeeController::class, 'index']); // Already exists in employee resource in admin group
    // Route::get('/employees/{id}', [EmployeeController::class, 'show']); // Already exists in employee resource in admin group
    // Note: If you want employees to be able to view ALL employees (not just themselves),
    // then EmployeeController@index and show MUST be placed here, outside the admin role group.
    // Otherwise, only admins can view the list.
    // For now, I assume index and show are Admin/Super Admin rights according to apiResource placement.
    // If 'employees.index' and 'employees.show' need to be accessed by all logged-in users,
    // then the following routes MUST BE ADDED BACK HERE, OUTSIDE THE ADMIN GROUP:
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::get('/employees/{id}', [EmployeeController::class, 'show']);


    // Individual PDF Download
    Route::get('/employees/{employee}/download-pdf', [EmployeeController::class, 'downloadPDF']); // Download PDF

    // Check Clock (All employees can check-in/out)
    Route::apiResource('check-clocks', CheckClockController::class); // If CheckClockController exists

    // General Attendance Routes
    // Note: These two lines are duplicates of the ones inside the 'role:manager,hr_admin,super_admin' group.
    // You should remove these duplicates if the previous group already covers the intended access.
    // If these are meant for all authenticated users (even 'employee' role), then ensure your policies
    // or controller logic handles the permissions correctly.
    // For now, I'm keeping them as they were in your provided code, but flagging them as potential duplicates.
    Route::apiResource('attendances', AttendanceController::class);
    Route::post('/attendances/{attendance}/approve', [AttendanceController::class, 'approve']);

    // This route is also duplicated; it's already defined inside the 'role:hr_admin,super_admin' group.
    // Remove this duplicate if the previous group already covers the intended access.
    Route::apiResource('check-clock-settings', CheckClockSettingController::class);
    Route::get('/attendances/{attendance}/download-pdf', [AttendanceController::class, 'downloadPDF']);
});

//=== Moved Routes (Previously Unprotected) ===
// These routes were moved into the 'auth:sanctum' group or the appropriate role group.
// Route::get('/attendance', [AttendanceController::class, 'index'])->middleware('auth:sanctum'); // Example of moving
// Route::apiResource('salaries', SalaryController::class)->middleware('auth:sanctum', 'role:hr_admin,super_admin'); // Example of moving
// ... and others that were previously unprotected.
