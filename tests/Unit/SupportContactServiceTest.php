<?php

namespace Tests\Unit;

use App\Services\Cab\Support\SupportContactService;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SupportContactServiceTest extends TestCase
{
    private const ENDPOINT = 'https://crm.cambioautomaticodobrasil.com.br/api/contato';

    #[Test]
    public function it_submits_mapped_payload_to_configured_endpoint(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.support_contact' => self::ENDPOINT,
            'cab.support_contact_payload_keys' => [
                'name' => 'nome',
                'email' => 'email',
                'phone' => 'telefone',
                'subject' => 'assunto',
                'message' => 'mensagem',
            ],
        ]);

        Http::fake([
            self::ENDPOINT => Http::response(['data' => true], 201),
        ]);

        $service = app(SupportContactService::class);

        $this->assertTrue($service->isConfigured());
        $this->assertTrue($service->submit(
            'João Silva',
            'joao@exemplo.com',
            '(11) 99999-9999',
            'Dúvida sobre planos',
            'Gostaria de saber mais sobre os planos disponíveis.',
        ));

        Http::assertSent(function ($request) {
            return $request->url() === self::ENDPOINT
                && $request['nome'] === 'João Silva'
                && $request['email'] === 'joao@exemplo.com'
                && $request['telefone'] === '(11) 99999-9999'
                && $request['assunto'] === 'Dúvida sobre planos'
                && $request['mensagem'] === 'Gostaria de saber mais sobre os planos disponíveis.';
        });
    }

    #[Test]
    public function it_omits_phone_when_not_provided(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.support_contact' => self::ENDPOINT,
            'cab.support_contact_payload_keys' => [
                'name' => 'nome',
                'email' => 'email',
                'phone' => 'telefone',
                'subject' => 'assunto',
                'message' => 'mensagem',
            ],
        ]);

        Http::fake([
            self::ENDPOINT => Http::response(['data' => true], 201),
        ]);

        $service = app(SupportContactService::class);

        $this->assertTrue($service->submit(
            'Maria Souza',
            'maria@exemplo.com',
            null,
            'Suporte técnico',
            'Preciso de ajuda com um diagnóstico.',
        ));

        Http::assertSent(function ($request) {
            return $request->url() === self::ENDPOINT
                && ! array_key_exists('telefone', $request->data());
        });
    }

    #[Test]
    public function it_returns_false_when_endpoint_is_not_configured(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.support_contact' => '',
        ]);

        $service = app(SupportContactService::class);

        $this->assertFalse($service->isConfigured());
        $this->assertFalse($service->submit(
            'João',
            'joao@exemplo.com',
            null,
            'Assunto',
            'Mensagem de teste longa o suficiente.',
        ));
    }
}
