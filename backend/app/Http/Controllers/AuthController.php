<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Register API
    public function signUp(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => false, // default, ubah sesuai kebutuhan
        ]);
        // Hapus token lama jika ada
        $user->tokens()->delete();

        // Buat token baru
        $token = $user->createToken('signup_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token
        ])->cookie(
            'token', $token, 60 * 24 * 7, '/', 'localhost', false, true
        );
    }

    public function signIn(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.'
            ], 401);
        }
    
        // Hapus semua token lama (opsional)
        $user->tokens()->delete();
    
        // Buat token baru
        $token = $user->createToken('signin_token')->plainTextToken;
    
        // Kembalikan token dalam response
        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ],
            'token' => $token, // Pastikan token dikembalikan di sini
        ]);
    }


    // Try For Free
    public function tryForFree()
{
    // Buat user guest dummy (tanpa login)
    $guestUser = User::firstOrCreate(
        ['email' => 'guest@hris.local'],
        [
            'name' => 'Guest User',
            'password' => bcrypt('guest123'), // bisa random atau fix
            'role' => 'guest'
        ]
    );

    $token = $guestUser->createToken('guest_token')->plainTextToken;

        return response()->json([
            'message' => 'Try for free successful',
            'user' => $guestUser,
        ])->cookie(
            'token', $token, 60, '/', 'localhost', false, true
        );
    }

    // Logout API
    public function signOut(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }
}
