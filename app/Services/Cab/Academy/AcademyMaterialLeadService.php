<?php

namespace App\Services\Cab\Academy;

use App\Services\Cab\CabApiClient;
use App\Support\CabNewsletterEndpoint;

class AcademyMaterialLeadService
{
    public const TIPO = 'MATERIAIS_GRATUITOS';

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
    public function mapPayload(
        string $name,
        string $email,
        string $phone,
        string $materialSlug,
        string $materialTitle,
    ): array {
        $keys = config('cab.newsletter_payload_keys', []);
        $materialKeys = config('cab.academy_material_payload_keys', []);

        return [
            (string) ($keys['name'] ?? 'nome') => $name,
            (string) ($keys['email'] ?? 'email') => $email,
            (string) ($keys['phone'] ?? 'telefone') => $phone,
            (string) ($keys['type'] ?? 'tipo') => self::TIPO,
            (string) ($materialKeys['material'] ?? 'material') => $materialTitle,
            (string) ($materialKeys['material_slug'] ?? 'material_slug') => $materialSlug,
        ];
    }

    public function submit(
        string $name,
        string $email,
        string $phone,
        string $materialSlug,
        string $materialTitle,
    ): bool {
        if (! $this->isConfigured()) {
            return false;
        }

        return $this->client->post(
            CabNewsletterEndpoint::resolve(),
            $this->mapPayload($name, $email, $phone, $materialSlug, $materialTitle),
        );
    }
}
