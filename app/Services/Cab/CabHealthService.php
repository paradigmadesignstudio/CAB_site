<?php

namespace App\Services\Cab;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CabHealthService
{
    /**
     * @return array{status: string, checks: array<string, array<string, mixed>>, checked_at: string}
     */
    public function report(): array
    {
        $checks = [
            'app' => ['status' => 'ok'],
            'cab_api' => $this->checkCabApi(),
        ];

        $status = collect($checks)->contains(fn (array $check): bool => ($check['status'] ?? '') === 'degraded')
            ? 'degraded'
            : 'ok';

        return [
            'status' => $status,
            'checks' => $checks,
            'checked_at' => now()->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function checkCabApi(): array
    {
        if (! config('cab.enabled')) {
            return [
                'status' => 'skipped',
                'reason' => 'CAB_API_ENABLED=false',
            ];
        }

        if (! config('cab.observability.health_ping_enabled')) {
            return [
                'status' => 'skipped',
                'reason' => 'CAB_HEALTH_PING_ENABLED=false',
            ];
        }

        $baseUrl = (string) config('cab.base_url');

        if ($baseUrl === '') {
            return [
                'status' => 'degraded',
                'reason' => 'CAB_API_BASE_URL not configured',
            ];
        }

        $client = app(CabApiClient::class);
        $endpoint = (string) config('cab.observability.health_ping_endpoint', 'blog/categorias');
        $url = $client->buildUrl($endpoint);
        $timeout = (int) config('cab.observability.health_ping_timeout', 5);

        try {
            $startedAt = microtime(true);

            $response = Http::timeout($timeout)
                ->acceptJson()
                ->get($url);

            $durationMs = (int) round((microtime(true) - $startedAt) * 1000);

            if ($response->successful()) {
                return $this->cabApiResult([
                    'status' => 'ok',
                    'url' => $url,
                    'http_status' => $response->status(),
                    'duration_ms' => $durationMs,
                ]);
            }

            Log::channel('cab')->warning('cab_health_ping_failed', [
                'url' => $url,
                'http_status' => $response->status(),
                'duration_ms' => $durationMs,
            ]);

            return $this->cabApiResult([
                'status' => 'degraded',
                'url' => $url,
                'http_status' => $response->status(),
                'duration_ms' => $durationMs,
            ]);
        } catch (\Throwable $exception) {
            Log::channel('cab')->error('cab_health_ping_error', [
                'url' => $url,
                'message' => $exception->getMessage(),
            ]);

            return $this->cabApiResult([
                'status' => 'degraded',
                'url' => $url,
                'message' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * Em produção, não expõe URL interna da API nem mensagens de exceção.
     *
     * @param  array<string, mixed>  $result
     * @return array<string, mixed>
     */
    private function cabApiResult(array $result): array
    {
        if (config('app.debug')) {
            return $result;
        }

        unset($result['url'], $result['message']);

        return $result;
    }
}
