<?php

namespace App\Support;

/**
 * Reescreve URLs de mídia do CRM para /media/{token} no domínio do site,
 * mascarando o host de storage no HTML/Inertia.
 */
class CabMediaUrl
{
    /**
     * Converte URL absoluta do CRM (se permitida) em URL local de proxy.
     * URLs vazias, relativas ou de hosts não autorizados permanecem iguais.
     */
    public static function proxy(string $url): string
    {
        $url = trim($url);

        if ($url === '' || ! config('cab.media_proxy_enabled', true)) {
            return $url;
        }

        if (str_starts_with($url, 'http://')) {
            $url = 'https://'.substr($url, 7);
        }

        if (! str_starts_with($url, 'https://')) {
            return $url;
        }

        $parts = parse_url($url);
        $host = $parts['host'] ?? null;
        $path = $parts['path'] ?? null;

        if (! is_string($host) || $host === '' || ! is_string($path) || $path === '') {
            return $url;
        }

        if (! self::isAllowedHost($host)) {
            return $url;
        }

        // Preferir /storage/; legado /img/patrocinadores → storage.
        if (str_contains($path, '/img/patrocinadores/')) {
            $path = str_replace('/img/patrocinadores/', '/storage/patrocinadores/', $path);
        }

        if (! str_starts_with($path, '/storage/')) {
            return $url;
        }

        $normalized = 'https://'.$host.$path;
        if (! empty($parts['query'])) {
            $normalized .= '?'.$parts['query'];
        }

        return '/media/'.self::encode($normalized);
    }

    public static function encode(string $absoluteUrl): string
    {
        $payload = rtrim(strtr(base64_encode($absoluteUrl), '+/', '-_'), '=');
        $signature = substr(hash_hmac('sha256', $payload, self::signingKey()), 0, 20);

        return $signature.'.'.$payload;
    }

    public static function decode(string $token): ?string
    {
        $token = trim($token);

        if ($token === '' || ! str_contains($token, '.')) {
            return null;
        }

        [$signature, $payload] = explode('.', $token, 2);

        if ($signature === '' || $payload === '') {
            return null;
        }

        $expected = substr(hash_hmac('sha256', $payload, self::signingKey()), 0, 20);

        if (! hash_equals($expected, $signature)) {
            return null;
        }

        $padded = strtr($payload, '-_', '+/');
        $pad = strlen($padded) % 4;
        if ($pad > 0) {
            $padded .= str_repeat('=', 4 - $pad);
        }

        $decoded = base64_decode($padded, true);

        if (! is_string($decoded) || $decoded === '') {
            return null;
        }

        if (! str_starts_with($decoded, 'https://')) {
            return null;
        }

        $host = parse_url($decoded, PHP_URL_HOST);
        $path = parse_url($decoded, PHP_URL_PATH);

        if (! is_string($host) || ! self::isAllowedHost($host)) {
            return null;
        }

        if (! is_string($path) || ! str_starts_with($path, '/storage/')) {
            return null;
        }

        return $decoded;
    }

    public static function isAllowedHost(string $host): bool
    {
        $host = strtolower($host);
        $allowed = self::allowedHosts();

        return isset($allowed[$host]);
    }

    /**
     * @return array<string, true>
     */
    public static function allowedHosts(): array
    {
        $hosts = [];

        foreach ((array) config('cab.media_proxy_allowed_hosts', []) as $host) {
            $host = strtolower(trim((string) $host));
            if ($host !== '') {
                $hosts[$host] = true;
            }
        }

        foreach ([
            config('cab.base_url'),
            config('cab.blog_media_base_url'),
            config('cab.sponsors_media_base_url'),
        ] as $candidate) {
            $parsed = parse_url((string) $candidate, PHP_URL_HOST);
            if (is_string($parsed) && $parsed !== '') {
                $hosts[strtolower($parsed)] = true;
            }
        }

        return $hosts;
    }

    private static function signingKey(): string
    {
        return (string) config('app.key', 'cab-media-proxy');
    }
}
