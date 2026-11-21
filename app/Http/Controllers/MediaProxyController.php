<?php

namespace App\Http\Controllers;

use App\Support\CabMediaDerivative;
use App\Support\CabMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class MediaProxyController extends Controller
{
    public function show(Request $request, string $token): Response
    {
        $upstream = CabMediaUrl::decode($token);

        if ($upstream === null) {
            abort(404);
        }

        $timeout = max(3, (int) config('cab.media_proxy_timeout', 15));
        $requestedWidth = $request->query('w');
        $derivativeWidth = CabMediaDerivative::acceptedWidth(is_string($requestedWidth) ? $requestedWidth : null);

        if ($derivativeWidth !== null) {
            $cached = CabMediaDerivative::cachedBody($upstream, $derivativeWidth);

            if ($cached !== null) {
                return $this->imageResponse($cached, 'image/webp');
            }
        }

        try {
            $upstreamResponse = Http::timeout($timeout)
                ->withHeaders([
                    'Accept' => 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                    'User-Agent' => 'CAB-Site-Media-Proxy/1.0',
                ])
                ->get($upstream);
        } catch (\Throwable) {
            abort(502);
        }

        if (! $upstreamResponse->successful()) {
            abort($upstreamResponse->status() === 404 ? 404 : 502);
        }

        $contentType = (string) ($upstreamResponse->header('Content-Type') ?: 'application/octet-stream');

        // Evita proxy acidental de HTML/JSON do CRM.
        if (! str_starts_with(strtolower($contentType), 'image/')
            && ! str_starts_with(strtolower($contentType), 'application/octet-stream')
            && ! str_starts_with(strtolower($contentType), 'binary/')) {
            abort(415);
        }

        if ($derivativeWidth !== null) {
            $derived = CabMediaDerivative::store($upstream, $upstreamResponse->body(), $derivativeWidth);

            if ($derived !== null) {
                return $this->imageResponse($derived, 'image/webp');
            }
        }

        return $this->imageResponse($upstreamResponse->body(), $contentType);
    }

    private function imageResponse(string $body, string $contentType): Response
    {
        $cacheSeconds = max(0, (int) config('cab.media_proxy_cache_seconds', 86400));

        return response($body, 200, [
            'Content-Type' => $contentType,
            'Cache-Control' => $cacheSeconds > 0
                ? "public, max-age={$cacheSeconds}, immutable"
                : 'no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
