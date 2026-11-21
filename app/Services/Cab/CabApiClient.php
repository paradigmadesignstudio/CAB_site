<?php

namespace App\Services\Cab;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CabApiClient
{
    /**
     * @param  array<string, string|int>  $replacements
     * @return array<int, mixed>
     */
    public function get(string $endpoint, array $replacements = []): array
    {
        if (! config('cab.enabled')) {
            return [];
        }

        $url = $this->buildUrl($endpoint, $replacements);

        return $this->rememberGet($url);
    }

    /**
     * @return array<int, mixed>
     */
    public function getAbsolute(string $url): array
    {
        if (! config('cab.enabled')) {
            return [];
        }

        return $this->rememberGet($url);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getAbsoluteOne(string $url): ?array
    {
        if (! config('cab.enabled')) {
            return null;
        }

        $ttl = (int) config('cab.cache_ttl', 600);

        if ($ttl <= 0) {
            return $this->fetchGetOne($url);
        }

        $cacheKey = 'cab.api.one:'.hash('sha256', $url);

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $result = $this->fetchGetOne($url);

        if ($result !== null) {
            Cache::put($cacheKey, $result, $ttl);
        }

        return $result;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function fetchGetOne(string $url): ?array
    {
        $startedAt = microtime(true);

        try {
            $response = Http::timeout(config('cab.timeout'))
                ->acceptJson()
                ->get($url);

            $durationMs = (int) round((microtime(true) - $startedAt) * 1000);

            if (! $response->successful()) {
                $this->logCabEvent('warning', 'cab_api_get_one_failed', [
                    'method' => 'GET',
                    'url' => $url,
                    'http_status' => $response->status(),
                    'duration_ms' => $durationMs,
                    'body_preview' => substr((string) $response->body(), 0, 500),
                ]);

                return null;
            }

            $this->logCabEvent('debug', 'cab_api_get_one_ok', [
                'method' => 'GET',
                'url' => $url,
                'http_status' => $response->status(),
                'duration_ms' => $durationMs,
            ]);

            return $this->normalizeOneResponse($response->json());
        } catch (\Throwable $exception) {
            $this->logCabEvent('error', 'cab_api_get_one_error', [
                'method' => 'GET',
                'url' => $url,
                'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                'message' => $exception->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * @return array<string, mixed>|null
     */
    private function normalizeOneResponse(mixed $json): ?array
    {
        if (! is_array($json)) {
            return null;
        }

        if (isset($json['data']) && is_array($json['data'])) {
            return $json['data'];
        }

        if ($json !== [] && ! array_is_list($json)) {
            return $json;
        }

        return null;
    }

    /**
     * @return array<int, mixed>
     */
    private function rememberGet(string $url): array
    {
        $ttl = (int) config('cab.cache_ttl', 600);

        if ($ttl <= 0) {
            return $this->fetchGet($url) ?? [];
        }

        $cacheKey = 'cab.api:'.hash('sha256', $url);

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $result = $this->fetchGet($url);

        if ($result === null) {
            return [];
        }

        Cache::put($cacheKey, $result, $ttl);

        return $result;
    }

    /**
     * @return array<int, mixed>|null null quando a requisição falha (não cachear)
     */
    private function fetchGet(string $url): ?array
    {
        $startedAt = microtime(true);

        try {
            $response = Http::timeout(config('cab.timeout'))
                ->acceptJson()
                ->get($url);

            $durationMs = (int) round((microtime(true) - $startedAt) * 1000);

            if (! $response->successful()) {
                $this->logCabEvent('warning', 'cab_api_get_failed', [
                    'method' => 'GET',
                    'url' => $url,
                    'http_status' => $response->status(),
                    'duration_ms' => $durationMs,
                    'body_preview' => substr((string) $response->body(), 0, 500),
                ]);

                return null;
            }

            $this->logCabEvent('debug', 'cab_api_get_ok', [
                'method' => 'GET',
                'url' => $url,
                'http_status' => $response->status(),
                'duration_ms' => $durationMs,
            ]);

            return $this->normalizeListResponse($response->json());
        } catch (\Throwable $exception) {
            $this->logCabEvent('error', 'cab_api_get_error', [
                'method' => 'GET',
                'url' => $url,
                'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                'message' => $exception->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * @return array<int, mixed>
     */
    private function normalizeListResponse(mixed $json): array
    {
        if (! is_array($json)) {
            return [];
        }

        if (array_is_list($json)) {
            return $json;
        }

        $data = $json['data'] ?? null;

        return is_array($data) ? $data : [];
    }

    /**
     * @param  array<string, mixed>  $payload
     * @param  array<string, string|int>  $replacements
     */
    public function post(string $endpoint, array $payload = [], array $replacements = []): bool
    {
        if (! config('cab.enabled')) {
            return false;
        }

        $url = $this->buildUrl($endpoint, $replacements);
        $startedAt = microtime(true);

        try {
            $response = Http::timeout(config('cab.timeout'))
                ->acceptJson()
                ->asJson()
                ->post($url, $payload);

            $durationMs = (int) round((microtime(true) - $startedAt) * 1000);

            if (! $response->successful()) {
                $this->logCabEvent('warning', 'cab_api_post_failed', [
                    'method' => 'POST',
                    'url' => $url,
                    'http_status' => $response->status(),
                    'duration_ms' => $durationMs,
                    'body_preview' => substr((string) $response->body(), 0, 500),
                ]);

                return false;
            }

            $this->logCabEvent('debug', 'cab_api_post_ok', [
                'method' => 'POST',
                'url' => $url,
                'http_status' => $response->status(),
                'duration_ms' => $durationMs,
            ]);

            return true;
        } catch (\Throwable $exception) {
            $this->logCabEvent('error', 'cab_api_post_error', [
                'method' => 'POST',
                'url' => $url,
                'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                'message' => $exception->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function logCabEvent(string $level, string $event, array $context): void
    {
        Log::channel('cab')->{$level}($event, array_merge([
            'service' => 'cab_api',
        ], $context));
    }

    /**
     * @param  array<string, string|int>  $replacements
     */
    public function buildUrl(string $endpoint, array $replacements = []): string
    {
        foreach ($replacements as $key => $value) {
            $endpoint = str_replace('{'.$key.'}', (string) $value, $endpoint);
        }

        if (str_starts_with($endpoint, 'http://') || str_starts_with($endpoint, 'https://')) {
            return rtrim($endpoint, '/');
        }

        $baseUrl = config('cab.base_url');

        if (str_starts_with($baseUrl, 'http://')) {
            $baseUrl = 'https://'.substr($baseUrl, 7);
        }

        return rtrim($baseUrl, '/').'/'.ltrim($endpoint, '/');
    }
}
