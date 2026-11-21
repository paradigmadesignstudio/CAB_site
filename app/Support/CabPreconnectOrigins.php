<?php

namespace App\Support;

class CabPreconnectOrigins
{
    /**
     * Hosts HTTPS usados por imagens e APIs do CRM — candidatos a preconnect no HTML inicial.
     *
     * @return array<int, string>
     */
    public static function hosts(): array
    {
        if (! config('cab.enabled')) {
            return [];
        }

        $candidates = [
            config('cab.base_url'),
            config('cab.blog_media_base_url'),
            config('cab.sponsors_media_base_url'),
            config('cab.endpoints.plans'),
            config('cab.endpoints.sponsors'),
            config('cab.endpoints.newsletter'),
            config('cab.endpoints.home_cta'),
            config('cab.endpoints.support_contact'),
        ];

        $hosts = [];

        foreach ($candidates as $candidate) {
            $host = parse_url((string) $candidate, PHP_URL_HOST);

            if (is_string($host) && $host !== '') {
                $hosts[$host] = true;
            }
        }

        return array_keys($hosts);
    }
}
