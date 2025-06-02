<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request; // Sudah ada
use Symfony\Component\HttpFoundation\Response;
use App\Models\User; // Tambahkan ini

class BypassAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (env('AUTH_ENABLED', true) === false) {
            $fakeUser = User::find(env('FAKE_USER_ID', 'uuid-of-your-dummy-user'));
            if (!$fakeUser) {
                $fakeUser = $this->createUserForBypass();
            }

            // <-- Perbaikan di sini: Set user langsung ke request object
            $request->setUserResolver(function () use ($fakeUser) {
                return $fakeUser;
            });
            // Karena setUserResolver sudah mengatur user untuk request,
            // memanggil auth()->setUser() mungkin tidak lagi mutlak diperlukan
            // atau bisa digunakan sebagai pelengkap. Tapi setUserResolver adalah inti.

            return $next($request);
        }

        return $next($request);
    }

    private function createUserForBypass()
    {
        return User::firstOrCreate(
            ['email' => 'dev@example.com'],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Developer User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}