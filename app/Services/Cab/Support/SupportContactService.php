<?php

namespace App\Services\Cab\Support;

use App\Services\Cab\CabApiClient;

class SupportContactService
{
    public function __construct(
        private CabApiClient $client,
    ) {}

    public function isConfigured(): bool
    {
        return (bool) config('cab.enabled')
            && (string) config('cab.endpoints.support_contact') !== '';
    }

    /**
     * @return array<string, string>
     */
    public function mapPayload(
        string $name,
        string $email,
        ?string $phone,
        string $subject,
        string $message,
    ): array {
        $keys = config('cab.support_contact_payload_keys', []);

        $payload = [
            (string) ($keys['name'] ?? 'nome') => $name,
            (string) ($keys['email'] ?? 'email') => $email,
            (string) ($keys['subject'] ?? 'assunto') => $subject,
            (string) ($keys['message'] ?? 'mensagem') => $message,
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
        string $subject,
        string $message,
    ): bool {
        if (! $this->isConfigured()) {
            return false;
        }

        return $this->client->post(
            (string) config('cab.endpoints.support_contact'),
            $this->mapPayload($name, $email, $phone, $subject, $message),
        );
    }
}
