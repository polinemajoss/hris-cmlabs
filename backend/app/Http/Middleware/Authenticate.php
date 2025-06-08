<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request): ?string
{
    // Jika request mengharapkan JSON, kembalikan null supaya tidak redirect
    if ($request->expectsJson()) {
        return null;
    }

    // Atau bisa langsung abort 401
    abort(401, 'Unauthenticated.');
}}