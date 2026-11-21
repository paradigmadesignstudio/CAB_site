<?php

namespace App\Support;

class SafeUrl
{
    /**
     * Retorna a URL apenas se o esquema for http ou https; caso contrário, string vazia.
     */
    public static function httpHttpsOnly(?string $url): string
    {
        $url = trim((string) $url);

        if ($url === '') {
            return '';
        }

        $parsed = parse_url($url);

        if ($parsed === false || ! isset($parsed['scheme'], $parsed['host'])) {
            return '';
        }

        $scheme = strtolower((string) $parsed['scheme']);

        if (! in_array($scheme, ['http', 'https'], true)) {
            return '';
        }

        return $url;
    }
}
