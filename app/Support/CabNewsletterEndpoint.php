<?php

namespace App\Support;

class CabNewsletterEndpoint
{
    public const DEFAULT_URL = 'https://crm.cambioautomaticodobrasil.com.br/api/newsletter';

    public static function resolve(?string $configured = null): string
    {
        $endpoint = trim((string) ($configured ?? config('cab.endpoints.newsletter', '')));

        if ($endpoint === '' || $endpoint === 'leads') {
            return self::DEFAULT_URL;
        }

        if (str_starts_with($endpoint, 'http://') || str_starts_with($endpoint, 'https://')) {
            return rtrim($endpoint, '/');
        }

        return self::DEFAULT_URL;
    }
}
