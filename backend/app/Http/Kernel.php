<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

// Tambahkan USE statements yang hilang ini:
use App\Http\Middleware\BypassAuth; // Pastikan ini ada jika belum
use Illuminate\Foundation\Http\Middleware\TrimStrings; // Untuk 'Undefined type 'App\\Http\\Middleware\\TrimStrings'.'
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull; // Seringkali satu paket dengan TrimStrings
use Illuminate\Foundation\Http\Middleware\ValidatePostSize; // Seringkali satu paket
use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance; // Seringkali satu paket
use Illuminate\Cookie\Middleware\EncryptCookies; // Untuk 'Undefined type 'App\\Http\\Middleware\\EncryptCookies'.'
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse; // Seringkali satu paket dengan EncryptCookies
use Illuminate\Session\Middleware\StartSession; // Seringkali satu paket
use Illuminate\View\Middleware\ShareErrorsFromSession; // Seringkali satu paket
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken; // Seringkali satu paket
use Illuminate\Http\Middleware\TrustProxies; // Jika Anda menggunakannya di $middleware global

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
        TrustProxies::class, // Pastikan ini juga ada use statement-nya
        PreventRequestsDuringMaintenance::class,
        ValidatePostSize::class,
        TrimStrings::class, // <-- Sekarang dikenali
        ConvertEmptyStringsToNull::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            EncryptCookies::class, // <-- Sekarang dikenali
            AddQueuedCookiesToResponse::class,
            StartSession::class,
            ShareErrorsFromSession::class,
            VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            BypassAuth::class, // Sudah ada use App\Http\Middleware\BypassAuth di atas
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
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
        // ... (middleware lainnya jika ada)
    ];
}