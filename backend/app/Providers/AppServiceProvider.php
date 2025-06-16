<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\App; // <-- TAMBAHKAN BARIS INI
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Pastikan tidak ada method 'signUp' di sini, itu typo. Seharusnya 'register' dan 'boot'.
        // Saya asumsikan 'signUp' di sini adalah typo dari 'register'
        // Jika Anda memiliki method 'signUp' yang sebenarnya, itu harus di luar class ServiceProvider
        // atau berada di tempat yang sesuai dengan fungsionalitasnya.
        // Untuk tujuan ini, saya akan asumsikan Anda ingin ini menjadi bagian dari register().

        if (App::environment('local')) {
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }

    // Perhatian: method signUp() di sini terlihat seperti typo atau tidak pada tempatnya.
    // ServiceProvider hanya punya method register() dan boot().
    // Jika Anda ingin fungsionalitas 'signUp', itu harus ada di Controller atau Service lain.
    // Jika itu adalah typo dan seharusnya method register() yang pertama,
    // maka hapus method 'register' yang ini dan biarkan yang di atas.
    /*
    public function signUp(): void
    {
        //
    }
    */
}