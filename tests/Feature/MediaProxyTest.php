<?php

namespace Tests\Feature;

use App\Support\CabMediaUrl;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MediaProxyTest extends TestCase
{
    #[Test]
    public function it_streams_allowed_crm_image_through_site_domain(): void
    {
        config([
            'cab.media_proxy_enabled' => true,
            'cab.media_proxy_allowed_hosts' => ['crm.cambioautomaticodobrasil.com.br'],
            'cab.media_proxy_cache_seconds' => 3600,
            'app.key' => 'base64:'.base64_encode(str_repeat('c', 32)),
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/storage/hotsites/1/logo.jpg' => Http::response(
                'fake-image-bytes',
                200,
                ['Content-Type' => 'image/jpeg'],
            ),
        ]);

        $token = CabMediaUrl::encode(
            'https://crm.cambioautomaticodobrasil.com.br/storage/hotsites/1/logo.jpg',
        );

        $response = $this->get('/media/'.$token)
            ->assertOk()
            ->assertHeader('Content-Type', 'image/jpeg')
            ->assertSee('fake-image-bytes', false);

        $this->assertStringContainsString('max-age=3600', (string) $response->headers->get('Cache-Control'));
        $this->assertStringContainsString('public', (string) $response->headers->get('Cache-Control'));
    }

    #[Test]
    public function it_returns_not_found_for_invalid_token(): void
    {
        $this->get('/media/invalid.tokenhere')
            ->assertNotFound();
    }

    #[Test]
    public function home_width_returns_a_webp_no_wider_than_the_preset_and_reuses_the_cache(): void
    {
        config([
            'cab.media_proxy_enabled' => true,
            'cab.media_proxy_allowed_hosts' => ['crm.cambioautomaticodobrasil.com.br'],
            'cab.media_proxy_cache_seconds' => 3600,
            'cab.media_proxy_home_width' => 1600,
            'app.key' => 'base64:'.base64_encode(str_repeat('c', 32)),
        ]);

        $url = 'https://crm.cambioautomaticodobrasil.com.br/storage/eventos/banners/'.bin2hex(random_bytes(4)).'.png';

        Http::fake([
            $url => Http::response($this->png(2400, 40), 200, ['Content-Type' => 'image/png']),
        ]);

        $token = CabMediaUrl::encode($url);

        $response = $this->get('/media/'.$token.'?w=1600')
            ->assertOk()
            ->assertHeader('Content-Type', 'image/webp');

        $image = imagecreatefromstring($response->getContent());
        $this->assertNotFalse($image);
        $this->assertSame(1600, imagesx($image));
        imagedestroy($image);

        $this->get('/media/'.$token.'?w=1600')
            ->assertOk()
            ->assertHeader('Content-Type', 'image/webp');

        Http::assertSentCount(1);
    }

    #[Test]
    public function other_widths_keep_the_original_file(): void
    {
        config([
            'cab.media_proxy_enabled' => true,
            'cab.media_proxy_allowed_hosts' => ['crm.cambioautomaticodobrasil.com.br'],
            'cab.media_proxy_home_width' => 1600,
            'app.key' => 'base64:'.base64_encode(str_repeat('c', 32)),
        ]);

        $png = $this->png(80, 20);
        $url = 'https://crm.cambioautomaticodobrasil.com.br/storage/eventos/banners/'.bin2hex(random_bytes(4)).'.png';

        Http::fake([
            $url => Http::response($png, 200, ['Content-Type' => 'image/png']),
        ]);

        $token = CabMediaUrl::encode($url);

        $this->get('/media/'.$token.'?w=400')
            ->assertOk()
            ->assertHeader('Content-Type', 'image/png')
            ->assertSee($png, false);
    }

    private function png(int $width, int $height): string
    {
        $image = imagecreatetruecolor($width, $height);
        $color = imagecolorallocate($image, 180, 30, 30);
        imagefilledrectangle($image, 0, 0, $width - 1, $height - 1, $color);

        ob_start();
        imagepng($image);
        imagedestroy($image);

        return (string) ob_get_clean();
    }
}
