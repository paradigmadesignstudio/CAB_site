<?php

namespace Tests\Unit;

use App\Services\Cab\Home\CtaLeadService;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CtaLeadServiceTest extends TestCase
{
    #[Test]
    public function it_submits_mapped_payload_to_configured_endpoint(): void
    {
        config([
            'cab.enabled' => true,
            'cab.base_url' => 'https://hml.cambioautomaticodobrasil.com.br/api/site',
            'cab.endpoints.home_cta' => 'https://crm.cambioautomaticodobrasil.com.br/api/newsletter',
            'cab.endpoints.newsletter' => 'https://crm.cambioautomaticodobrasil.com.br/api/newsletter',
            'cab.newsletter_payload_keys' => [
                'name' => 'nome',
                'phone' => 'telefone',
                'email' => 'email',
                'type' => 'tipo',
            ],
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/newsletter' => Http::response(['data' => true], 201),
        ]);

        $service = app(CtaLeadService::class);

        $this->assertTrue($service->isConfigured());
        $this->assertTrue($service->submit('João Silva', '11999999999', 'joao@exemplo.com'));

        Http::assertSent(function ($request) {
            return $request->url() === 'https://crm.cambioautomaticodobrasil.com.br/api/newsletter'
                && $request['nome'] === 'João Silva'
                && $request['telefone'] === '11999999999'
                && $request['email'] === 'joao@exemplo.com'
                && $request['tipo'] === 'GERAL';
        });
    }

    #[Test]
    public function it_returns_false_when_cab_integration_is_disabled(): void
    {
        config([
            'cab.enabled' => false,
            'cab.endpoints.home_cta' => 'https://crm.cambioautomaticodobrasil.com.br/api/newsletter',
        ]);

        $service = app(CtaLeadService::class);

        $this->assertFalse($service->isConfigured());
        $this->assertFalse($service->submit('João', '11999999999', 'joao@exemplo.com'));
    }
}
