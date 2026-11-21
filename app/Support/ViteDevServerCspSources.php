<?php

namespace App\Support;

class ViteDevServerCspSources
{
    /**
     * Origem HTTP e websocket do Vite em desenvolvimento.
     *
     * Lê public/hot (ou cab.vite_hot_file) e só devolve algo no ambiente local,
     * para a CSP de produção não ganhar o servidor de assets.
     *
     * @return array{http: string, ws: string}|null
     */
    public static function origins(): ?array
    {
        if (! app()->environment('local')) {
            return null;
        }

        $configured = config('cab.vite_hot_file');
        $hotFile = is_string($configured) && $configured !== ''
            ? $configured
            : public_path('hot');

        if (! is_file($hotFile)) {
            return null;
        }

        $url = trim((string) file_get_contents($hotFile));
        $parts = parse_url($url);

        if (! is_array($parts)) {
            return null;
        }

        $scheme = $parts['scheme'] ?? '';
        $host = $parts['host'] ?? '';

        if (! in_array($scheme, ['http', 'https'], true) || $host === '') {
            return null;
        }

        if (preg_match('/[\s;]/', $host) === 1) {
            return null;
        }

        $port = '';

        if (isset($parts['port'])) {
            $portNumber = (int) $parts['port'];

            if ($portNumber < 1 || $portNumber > 65535) {
                return null;
            }

            $port = ':'.$portNumber;
        }

        $wsScheme = $scheme === 'https' ? 'wss' : 'ws';

        return [
            'http' => $scheme.'://'.$host.$port,
            'ws' => $wsScheme.'://'.$host.$port,
        ];
    }
}
