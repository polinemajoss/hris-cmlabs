<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles Daftar role yang diizinkan (contoh: 'hr_admin', 'manager')
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Pastikan user sudah terautentikasi
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Periksa apakah role user ada dalam daftar role yang diizinkan
        if (!in_array($request->user()->role, $roles)) {
            // Jika tidak diizinkan, kembalikan 403 Forbidden
            return response()->json(['message' => 'Unauthorized. You do not have the necessary role.'], 403);
        }

        return $next($request);
    }
}