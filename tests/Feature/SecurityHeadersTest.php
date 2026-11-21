<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    #[Test]
    public function responses_include_anti_clickjacking_and_security_headers(): void
    {
        $response = $this->get('/health');

        $response->assertOk();
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
        $response->assertHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        $response->assertHeader('X-Permitted-Cross-Domain-Policies', 'none');

        $this->assertFalse($response->headers->has('X-Powered-By'));

        $csp = (string) $response->headers->get('Content-Security-Policy');

        $this->assertStringContainsString("frame-ancestors 'none'", $csp);
        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString("form-action 'self' https://www.facebook.com", $csp);
        $this->assertStringContainsString('https://www.googletagmanager.com', $csp);
        $this->assertStringContainsString('https://www.facebook.com', $csp);
        $this->assertStringContainsString('https://connect.facebook.net', $csp);
        $this->assertStringContainsString('https://d335luupugsy2.cloudfront.net', $csp);
        $this->assertStringContainsString('https://d1sag09wwfbul8.cloudfront.net', $csp);
        $this->assertStringContainsString('https://www.google.com', $csp);
        $this->assertStringContainsString('https://popups.rdstation.com.br', $csp);
        $this->assertStringContainsString('https://pageview-notify.rdstation.com.br', $csp);
        $this->assertStringContainsString('https://mpc-prod-23-s6uit34pua-ue.a.run.app', $csp);
        $this->assertStringContainsString('https://5z-2b6b7616f94640c2840d1841e1ac24c3.ecs.us-east-1.on.aws', $csp);
        $this->assertStringContainsString('https://googleads.g.doubleclick.net', $csp);
        $this->assertStringContainsString('https://ad.doubleclick.net', $csp);
        $this->assertStringContainsString('https://fonts.googleapis.com', $csp);
        $this->assertStringContainsString('https://fonts.gstatic.com', $csp);
        $this->assertStringContainsString('https://tiles.openfreemap.org', $csp);
        $this->assertStringContainsString('https://s3.amazonaws.com', $csp);
        $this->assertStringContainsString("worker-src 'self' blob:", $csp);
        $this->assertStringNotContainsString('[::1]', $csp);
    }

    #[Test]
    public function local_vite_dev_server_origin_is_allowed_in_csp(): void
    {
        $hotFile = tempnam(sys_get_temp_dir(), 'vite-hot-');
        $this->assertNotFalse($hotFile);

        file_put_contents($hotFile, "http://[::1]:5173\n");

        $this->app['env'] = 'local';
        config(['cab.vite_hot_file' => $hotFile]);

        try {
            $csp = (string) $this->get('/health')->headers->get('Content-Security-Policy');
        } finally {
            unlink($hotFile);
        }

        $this->assertStringContainsString("script-src 'self' 'unsafe-inline'", $csp);
        $this->assertStringContainsString('http://[::1]:5173', $csp);
        $this->assertStringContainsString('ws://[::1]:5173', $csp);
        $this->assertMatchesRegularExpression(
            '/script-src [^;]*http:\/\/\[::1\]:5173/',
            $csp,
        );
        $this->assertMatchesRegularExpression(
            '/connect-src [^;]*ws:\/\/\[::1\]:5173/',
            $csp,
        );
    }
}
