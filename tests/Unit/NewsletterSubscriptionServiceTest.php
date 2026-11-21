<?php

namespace Tests\Unit;

use App\Services\Cab\Newsletter\NewsletterSubscriptionService;
use App\Support\CabNewsletterEndpoint;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NewsletterSubscriptionServiceTest extends TestCase
{
    #[Test]
    public function it_submits_mapped_payload_with_required_fields(): void
    {
        config([
            'cab.enabled' => true,
            'cab.base_url' => 'https://hml.cambioautomaticodobrasil.com.br/api/site',
            'cab.endpoints.newsletter' => 'https://crm.cambioautomaticodobrasil.com.br/api/newsletter',
            'cab.newsletter_payload_keys' => [
                'name' => 'nome',
                'email' => 'email',
                'phone' => 'telefone',
                'type' => 'tipo',
            ],
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/newsletter' => Http::response(['data' => true], 201),
        ]);

        $service = app(NewsletterSubscriptionService::class);

        $this->assertTrue($service->isConfigured());
        $this->assertTrue($service->submit('João Silva', 'joao@email.com', null, 'BLOG'));

        Http::assertSent(function ($request) {
            return $request->url() === 'https://crm.cambioautomaticodobrasil.com.br/api/newsletter'
                && $request['nome'] === 'João Silva'
                && $request['email'] === 'joao@email.com'
                && $request['tipo'] === 'BLOG'
                && ! array_key_exists('telefone', $request->data());
        });
    }

    #[Test]
    public function it_includes_phone_when_provided(): void
    {
        config([
            'cab.enabled' => true,
            'cab.base_url' => 'https://hml.cambioautomaticodobrasil.com.br/api/site',
            'cab.endpoints.newsletter' => 'https://crm.cambioautomaticodobrasil.com.br/api/newsletter',
            'cab.newsletter_payload_keys' => [
                'name' => 'nome',
                'email' => 'email',
                'phone' => 'telefone',
                'type' => 'tipo',
            ],
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/newsletter' => Http::response(['data' => true], 201),
        ]);

        $service = app(NewsletterSubscriptionService::class);

        $this->assertTrue($service->submit(
            'João Silva',
            'joao@email.com',
            '(11) 99999-9999',
            'DICAS',
        ));

        Http::assertSent(function ($request) {
            return $request['telefone'] === '(11) 99999-9999'
                && $request['tipo'] === 'DICAS';
        });
    }

    #[Test]
    public function it_returns_false_when_cab_integration_is_disabled(): void
    {
        config([
            'cab.enabled' => false,
            'cab.endpoints.newsletter' => 'https://crm.cambioautomaticodobrasil.com.br/api/newsletter',
        ]);

        $service = app(NewsletterSubscriptionService::class);

        $this->assertFalse($service->isConfigured());
        $this->assertFalse($service->submit('João', 'joao@email.com', null, 'GERAL'));
    }

    #[Test]
    public function it_uses_default_crm_url_when_legacy_leads_endpoint_is_configured(): void
    {
        config([
            'cab.enabled' => true,
            'cab.base_url' => 'https://hml.cambioautomaticodobrasil.com.br/api/site',
            'cab.endpoints.newsletter' => 'leads',
            'cab.newsletter_payload_keys' => [
                'name' => 'nome',
                'email' => 'email',
                'phone' => 'telefone',
                'type' => 'tipo',
            ],
        ]);

        Http::fake([
            CabNewsletterEndpoint::DEFAULT_URL => Http::response(['data' => true], 201),
        ]);

        $service = app(NewsletterSubscriptionService::class);

        $this->assertTrue($service->submit('João Silva', 'joao@email.com', null, 'BLOG'));

        Http::assertSent(function ($request) {
            return $request->url() === CabNewsletterEndpoint::DEFAULT_URL;
        });
    }
}
