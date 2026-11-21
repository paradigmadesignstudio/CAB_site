<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePreviewRoutesEnabled
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('cab.features.preview_routes_enabled')) {
            abort(404);
        }

        return $next($request);
    }
}
