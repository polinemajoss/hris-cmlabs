<?php

namespace App\Providers;

use Laravel\Pail\PailServiceProvider; // Tambahkan ini di bagian atas jika belum ada
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function signUp(): void
    {
        //
    }

    public function boot(): void
    {
        //
    }
    public function register(): void
{
    if ($this->app->isLocal()) {
        $this->app->register(PailServiceProvider::class);
    }
}
}
