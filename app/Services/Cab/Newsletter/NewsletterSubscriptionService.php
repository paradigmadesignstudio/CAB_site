<?php

namespace App\Services\Cab\Newsletter;

use App\Support\CabNewsletterEndpoint;
use App\Services\Cab\CabApiClient;

class NewsletterSubscriptionService
{
    public const TIPO_GERAL = 'GERAL';

    public const TIPO_BLOG = 'BLOG';

    public const TIPO_DICAS = 'DICAS';

    public const TIPO_CURSOS = 'CURSOS';

    /** @var list<string> */
    public const ALLOWED_TIPOS = [
        self::TIPO_GERAL,
        self::TIPO_BLOG,
        self::TIPO_DICAS,
        self::TIPO_CURSOS,
        'Eventos',
        'Artigos Técnicos',
        'Marketing para Oficinas',
        'Híbridos e Elétricos',
        'Mercado do Automático',
        'MATERIAIS_GRATUITOS',
    ];

    public function __construct(
        private CabApiClient $client,
    ) {}

    public function isConfigured(): bool
    {
        return (bool) config('cab.enabled')
            && CabNewsletterEndpoint::resolve() !== '';
    }

    /**
     * @return array<string, string>
     */
    public function mapPayload(string $name, string $email, ?string $phone, string $tipo): array
    {
        $keys = config('cab.newsletter_payload_keys', []);

        $payload = [
            (string) ($keys['name'] ?? 'nome') => $name,
            (string) ($keys['email'] ?? 'email') => $email,
            (string) ($keys['type'] ?? 'tipo') => $tipo,
        ];

        if ($phone !== null && $phone !== '') {
            $payload[(string) ($keys['phone'] ?? 'telefone')] = $phone;
        }

        return $payload;
    }

    public function submit(
        string $name,
        string $email,
        ?string $phone,
        string $tipo,
        ?string $configuredEndpoint = null,
    ): bool {
        if (! $this->isConfigured() && $configuredEndpoint === null) {
            return false;
        }

        $endpoint = CabNewsletterEndpoint::resolve(
            $configuredEndpoint ?? config('cab.endpoints.newsletter'),
        );

        if ($endpoint === '' || ! (bool) config('cab.enabled')) {
            return false;
        }

        return $this->client->post(
            $endpoint,
            $this->mapPayload($name, $email, $phone, $tipo),
        );
    }
}
