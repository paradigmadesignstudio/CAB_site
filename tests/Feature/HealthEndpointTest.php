<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HealthEndpointTest extends TestCase
{
    #[Test]
    public function health_endpoint_reports_app_as_ok(): void
    {
        config([
            'cab.enabled' => false,
            'cab.observability.health_ping_enabled' => false,
        ]);

        $this->getJson('/health')
            ->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('checks.app.status', 'ok')
            ->assertJsonPath('checks.cab_api.status', 'skipped');
    }

    #[Test]
    public function health_endpoint_returns_degraded_when_cab_ping_fails(): void
    {
        config([
            'cab.enabled' => true,
            'cab.base_url' => 'https://hml.cambioautomaticodobrasil.com.br/api/site',
            'cab.observability.health_ping_enabled' => true,
            'cab.observability.health_ping_endpoint' => 'blog/categorias',
            'cab.observability.health_ping_timeout' => 5,
        ]);

        Http::fake([
            'https://hml.cambioautomaticodobrasil.com.br/api/site/blog/categorias' => Http::response([], 503),
        ]);

        $this->getJson('/health')
            ->assertStatus(503)
            ->assertJsonPath('status', 'degraded')
            ->assertJsonPath('checks.cab_api.status', 'degraded')
            ->assertJsonPath('checks.cab_api.http_status', 503);
    }

    #[Test]
    public function health_endpoint_reports_cab_ping_as_ok_on_success(): void
    {
        config([
            'app.debug' => true,
            'cab.enabled' => true,
            'cab.base_url' => 'https://hml.cambioautomaticodobrasil.com.br/api/site',
            'cab.observability.health_ping_enabled' => true,
            'cab.observability.health_ping_endpoint' => 'blog/categorias',
        ]);

        Http::fake([
            'https://hml.cambioautomaticodobrasil.com.br/api/site/blog/categorias' => Http::response(['data' => []], 200),
        ]);

        $this->getJson('/health')
            ->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('checks.cab_api.status', 'ok')
            ->assertJsonPath(
                'checks.cab_api.url',
                'https://hml.cambioautomaticodobrasil.com.br/api/site/blog/categorias',
            );
    }

    #[Test]
    public function health_endpoint_hides_internal_api_url_when_debug_is_off(): void
    {
        config([
            'app.debug' => false,
            'cab.enabled' => true,
            'cab.base_url' => 'https://hml.cambioautomaticodobrasil.com.br/api/site',
            'cab.observability.health_ping_enabled' => true,
            'cab.observability.health_ping_endpoint' => 'blog/categorias',
        ]);

        Http::fake([
            'https://hml.cambioautomaticodobrasil.com.br/api/site/blog/categorias' => Http::response(['data' => []], 200),
        ]);

        $this->getJson('/health')
            ->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('checks.cab_api.status', 'ok')
            ->assertJsonMissingPath('checks.cab_api.url');
    }
}
