<?php

namespace App\Http\Middleware;

use App\Support\CabPreconnectOrigins;
use App\Support\ViteDevServerCspSources;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddSecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        $response->headers->set(
            'X-Content-Type-Options',
            'nosniff',
        );
        $response->headers->set(
            'X-Frame-Options',
            (string) config('cab.x_frame_options', 'DENY'),
        );
        $response->headers->set(
            'Referrer-Policy',
            (string) config('cab.referrer_policy', 'strict-origin-when-cross-origin'),
        );
        $response->headers->set(
            'Permissions-Policy',
            (string) config('cab.permissions_policy', 'camera=(), microphone=(), geolocation=()'),
        );
        $response->headers->set(
            'Cross-Origin-Opener-Policy',
            (string) config('cab.cross_origin_opener_policy', 'same-origin-allow-popups'),
        );
        $response->headers->set(
            'Cross-Origin-Resource-Policy',
            (string) config('cab.cross_origin_resource_policy', 'cross-origin'),
        );
        $response->headers->set(
            'X-Permitted-Cross-Domain-Policies',
            (string) config('cab.x_permitted_cross_domain_policies', 'none'),
        );

        if (config('cab.csp_enabled', true)) {
            $response->headers->set('Content-Security-Policy', $this->buildContentSecurityPolicy());
        } else {
            $response->headers->set('Content-Security-Policy', "frame-ancestors 'none'");
        }

        if ($request->secure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload',
            );
        }

        return $response;
    }

    private function buildContentSecurityPolicy(): string
    {
        /** @var array<string, array<int, string>> $directives */
        $directives = config('cab.csp_directives', []);

        if ($directives === []) {
            return "frame-ancestors 'none'";
        }

        $connectSrc = $directives['connect-src'] ?? ["'self'"];

        foreach (CabPreconnectOrigins::hosts() as $host) {
            $connectSrc[] = 'https://'.$host;
        }

        // HML/CRM e mídia de blog/parceiros (quando base_url muda por ambiente).
        foreach ([
            config('cab.base_url'),
            config('cab.blog_media_base_url'),
            config('cab.sponsors_media_base_url'),
            config('cab.endpoints.hotsites'),
            config('cab.endpoints.courses'),
            config('cab.endpoints.events'),
        ] as $candidate) {
            $host = parse_url((string) $candidate, PHP_URL_HOST);

            if (is_string($host) && $host !== '') {
                $connectSrc[] = 'https://'.$host;
            }
        }

        $directives['connect-src'] = array_values(array_unique($connectSrc));

        $this->allowLocalViteDevServer($directives);

        $parts = [];

        foreach ($directives as $name => $values) {
            $clean = array_values(array_filter(
                array_map('strval', $values),
                fn (string $value): bool => $value !== '',
            ));

            if ($clean === []) {
                continue;
            }

            $parts[] = $name.' '.implode(' ', $clean);
        }

        return implode('; ', $parts);
    }

    /**
     * O Vite de desenvolvimento serve scripts, CSS e o websocket de HMR
     * em outra origem (http://127.0.0.1:porta). Isso só entra na CSP
     * no ambiente local, e só enquanto public/hot existir.
     *
     * @param  array<string, array<int, string>>  $directives
     */
    private function allowLocalViteDevServer(array &$directives): void
    {
        $origins = ViteDevServerCspSources::origins();

        if ($origins === null) {
            return;
        }

        foreach (['script-src', 'style-src', 'font-src', 'img-src'] as $directive) {
            $directives[$directive][] = $origins['http'];
        }

        $directives['connect-src'][] = $origins['http'];
        $directives['connect-src'][] = $origins['ws'];
    }
}
