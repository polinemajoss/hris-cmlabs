<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

// Tambahkan use yang benar:
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Foundation\Http\Middleware\ValidatePostSize;
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance;

use Illuminate\Cookie\Middleware\EncryptCookies; // Ini biasanya ada di web group
use Illuminate\Session\Middleware\StartSession; // Ini biasanya ada di web group
use Illuminate\View\Middleware\ShareErrorsFromSession; // Ini biasanya ada di web group
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken; // Ini biasanya ada di web group

// Jangan lupa tambahkan use untuk middleware BypassAuth Anda
use App\Http\Middleware\BypassAuth; // <-- Pastikan ini ada!
use App\Http\Middleware\HandleOptionsRequest;

class Kernel extends HttpKernel
{
    
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        HandleOptionsRequest::class,
        TrustProxies::class,
        HandleCors::class,
        PreventRequestsDuringMaintenance::class,
        ValidatePostSize::class,
        TrimStrings::class,
        ConvertEmptyStringsToNull::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            StartSession::class, // Gunakan use StartSession
            ShareErrorsFromSession::class, // Gunakan use ShareErrorsFromSession
            VerifyCsrfToken::class, // Gunakan use VerifyCsrfToken
            SubstituteBindings::class,
        ],

        'api' => [
            BypassAuth::class, // <-- Tambahkan ini di awal group 'api'
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            SubstituteBindings::class,
            // Jika ada middleware autentikasi lain seperti 'auth:sanctum', biarkan saja
            // BypassAuth akan dieksekusi duluan dan mengabaikannya jika AUTH_ENABLED=false
        ],
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or individual routes.
     *
     * @var array
     */
    protected $routeMiddleware = [
        // Anda tidak perlu mendaftarkan BypassAuth di sini jika sudah di group 'api'
        // Tapi jika Anda ingin menggunakannya di route spesifik di luar group 'api',
        // Anda bisa mendaftarkannya di sini dan menggunakannya di route Anda.
        // Contoh: 'bypass.auth' => \App\Http\Middleware\BypassAuth::class,
    ];
}