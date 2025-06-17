<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleOptionsRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Jika metode request adalah OPTIONS, langsung jawab dengan header CORS yang benar
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
              ->header('Access-Control-Allow-Origin', 'http://localhost:3000') // Izinkan domain frontend Anda
              ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
              ->header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization, Accept')
              ->header('Access-Control-Allow-Credentials', 'true');
        }

        // Untuk metode lain (GET, POST, dll.), lanjutkan ke middleware berikutnya
        return $next($request);
    }
}