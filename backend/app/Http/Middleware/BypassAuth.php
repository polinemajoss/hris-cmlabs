<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BypassAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Periksa environment variable
        if (env('AUTH_ENABLED', true) === false) { // Default true jika tidak ada atau bukan 'false'
            // Jika autentikasi dimatikan, langsung lanjutkan request
            // Anda bisa juga secara opsional "mensimulasikan" user yang login
            // agar controller tidak error jika mengharapkan user object
            // Contoh:
            // $fakeUser = new \App\Models\User(); // Asumsi ada model User
            // $fakeUser->id = 1; // ID dummy
            // $fakeUser->name = 'Developer User';
            // // Tambahkan properti lain yang mungkin diharapkan di controller
            // $request->setUserResolver(function () use ($fakeUser) {
            //     return $fakeUser;
            // });
            // auth()->setUser($fakeUser); // Jika Anda menggunakan facade Auth
            return $next($request);
        }

        // Jika autentikasi aktif, lanjutkan ke middleware atau route berikutnya
        return $next($request);
    }
}