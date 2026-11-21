<?php

namespace Tests\Unit;

use App\Support\CabMediaUrl;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CabMediaUrlTest extends TestCase
{
    #[Test]
    public function it_proxies_allowed_crm_storage_urls(): void
    {
        config([
            'cab.media_proxy_enabled' => true,
            'cab.media_proxy_allowed_hosts' => ['crm.cambioautomaticodobrasil.com.br'],
            'app.key' => 'base64:'.base64_encode(str_repeat('a', 32)),
        ]);

        $proxied = CabMediaUrl::proxy(
            'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/3567/logo/file.jpg',
        );

        $this->assertStringStartsWith('/media/', $proxied);
        $this->assertStringNotContainsString('crm.cambioautomaticodobrasil.com.br', $proxied);

        $token = substr($proxied, strlen('/media/'));
        $decoded = CabMediaUrl::decode($token);

        $this->assertSame(
            'https://crm.cambioautomaticodobrasil.com.br/storage/hotsites/3567/logo/file.jpg',
            $decoded,
        );
    }

    #[Test]
    public function it_rejects_foreign_hosts_and_tampered_tokens(): void
    {
        config([
            'cab.media_proxy_enabled' => true,
            'cab.media_proxy_allowed_hosts' => ['crm.cambioautomaticodobrasil.com.br'],
            'app.key' => 'base64:'.base64_encode(str_repeat('b', 32)),
        ]);

        $this->assertSame(
            'https://evil.example/storage/x.jpg',
            CabMediaUrl::proxy('https://evil.example/storage/x.jpg'),
        );

        $valid = CabMediaUrl::proxy(
            'https://crm.cambioautomaticodobrasil.com.br/storage/hotsites/a.jpg',
        );
        $token = substr($valid, strlen('/media/'));
        [$sig, $payload] = explode('.', $token, 2);

        $this->assertNull(CabMediaUrl::decode('deadbeef.'.$payload));
        $this->assertNull(CabMediaUrl::decode($sig.'.'.strrev($payload)));
    }

    #[Test]
    public function it_can_be_disabled(): void
    {
        config([
            'cab.media_proxy_enabled' => false,
            'cab.media_proxy_allowed_hosts' => ['crm.cambioautomaticodobrasil.com.br'],
        ]);

        $url = 'https://crm.cambioautomaticodobrasil.com.br/storage/hotsites/a.jpg';

        $this->assertSame($url, CabMediaUrl::proxy($url));
    }
}
