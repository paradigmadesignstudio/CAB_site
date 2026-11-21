<?php

namespace Tests\Unit;

use App\Services\Cab\Partners\SponsorsDataMapper;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SponsorsDataMapperTest extends TestCase
{
    #[Test]
    public function it_maps_sponsors_from_api_payload(): void
    {
        config([
            'cab.sponsors_media_base_url' => 'https://crm.cambioautomaticodobrasil.com.br',
            'cab.featured_sponsor_order' => [1],
            'cab.featured_sponsor_slugs' => ['motul'],
        ]);

        $mapper = new SponsorsDataMapper();

        $result = $mapper->mapList([
            [
                'id' => 18,
                'nome' => 'CAAMBIOCWB',
                'logo' => 'patrocinadores/logo/logo-caambiocwb-18.jpg',
                'url' => 'https://www.caambiocwb.com.br/',
            ],
            [
                'id' => 2,
                'nome' => 'MOTUL',
                'logo' => 'https://crm.example.com/motul-2.jpg',
                'url' => '',
                'historia' => 'História completa do patrocinador.',
                'descricao' => 'Resumo curto.',
            ],
            [
                'id' => 16,
                'nome' => 'MTP',
                'logo' => 'https://crm.cambioautomaticodobrasil.com.br/img/patrocinadores/mtp.png',
                'url' => '',
            ],
        ]);

        $this->assertSame('motul', $result[0]['slug']);
        $this->assertSame('sponsor', $result[0]['role']);
        $this->assertSame('Resumo curto.', $result[0]['description']);
        $this->assertSame('História completa do patrocinador.', $result[0]['story']);

        $this->assertSame('caambiocwb', $result[1]['slug']);
        $this->assertSame('partner', $result[1]['role']);
        $this->assertSame('CAAMBIOCWB', $result[1]['name']);
        $this->assertStringStartsWith('/media/', $result[1]['logo']);
        $this->assertSame(
            'https://crm.cambioautomaticodobrasil.com.br/storage/patrocinadores/logo/logo-caambiocwb-18.jpg',
            \App\Support\CabMediaUrl::decode(substr($result[1]['logo'], strlen('/media/'))),
        );
        $this->assertSame('https://www.caambiocwb.com.br/', $result[1]['website']);
        $this->assertSame('', $result[1]['description']);
        $this->assertSame('', $result[1]['story']);

        $this->assertSame('mtp', $result[2]['slug']);
        $this->assertSame('partner', $result[2]['role']);
        $this->assertStringStartsWith('/media/', $result[2]['logo']);
        $this->assertSame(
            'https://crm.cambioautomaticodobrasil.com.br/storage/patrocinadores/mtp.png',
            \App\Support\CabMediaUrl::decode(substr($result[2]['logo'], strlen('/media/'))),
        );
    }

    #[Test]
    public function it_sorts_featured_sponsors_by_configured_id_order(): void
    {
        config([
            'cab.featured_sponsor_order' => [2, 1],
            'cab.featured_sponsor_slugs' => ['tecnomotor', 'motul'],
        ]);

        $mapper = new SponsorsDataMapper();

        $result = $mapper->mapList([
            [
                'id' => 1,
                'nome' => 'MOTUL',
                'logo' => '',
                'url' => '',
            ],
            [
                'id' => 2,
                'nome' => 'TECNOMOTOR',
                'logo' => '',
                'url' => '',
            ],
        ]);

        $this->assertSame('tecnomotor', $result[0]['slug']);
        $this->assertSame('motul', $result[1]['slug']);
    }

    #[Test]
    public function it_maps_api_description_fields_and_video_url(): void
    {
        config([
            'cab.featured_sponsor_order' => [2],
            'cab.featured_sponsor_slugs' => ['tecnomotor'],
        ]);

        $mapper = new SponsorsDataMapper();

        $result = $mapper->mapList([
            [
                'id' => 2,
                'nome' => 'TECNOMOTOR',
                'logo' => '',
                'url' => '',
                'short_description' => 'Resumo vindo da API.',
                'long_description' => '<p>História <strong>com HTML</strong>.</p>',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
        ]);

        $this->assertSame('tecnomotor', $result[0]['slug']);
        $this->assertSame('sponsor', $result[0]['role']);
        $this->assertSame('Resumo vindo da API.', $result[0]['description']);
        $this->assertSame('Resumo vindo da API.', $result[0]['shortDescription']);
        $this->assertSame('<p>História <strong>com HTML</strong>.</p>', $result[0]['story']);
        $this->assertSame('https://www.youtube.com/watch?v=dQw4w9WgXcQ', $result[0]['videoUrl']);
    }

    #[Test]
    public function it_strips_unsafe_website_urls(): void
    {
        $mapper = new SponsorsDataMapper();

        $result = $mapper->mapList([
            [
                'id' => 99,
                'nome' => 'Unsafe Sponsor',
                'logo' => '',
                'url' => 'javascript:alert(1)',
            ],
        ]);

        $this->assertSame('', $result[0]['website']);
        $this->assertSame('partner', $result[0]['role']);
    }

    #[Test]
    public function it_maps_logo_mobile_from_api_thumb_field(): void
    {
        config([
            'cab.sponsors_media_base_url' => 'https://crm.cambioautomaticodobrasil.com.br',
        ]);

        $mapper = new SponsorsDataMapper();

        $result = $mapper->mapList([
            [
                'id' => 7,
                'nome' => 'Parceiro Mobile',
                'logo' => 'patrocinadores/logo/logo-parceiro-7.jpg',
                'logo_thumb_url' => 'patrocinadores/logo/logo-parceiro-7-thumb.webp',
                'url' => '',
            ],
        ]);

        $this->assertStringStartsWith('/media/', $result[0]['logo']);
        $this->assertStringStartsWith('/media/', (string) $result[0]['logoMobile']);
        $this->assertNotSame($result[0]['logo'], $result[0]['logoMobile']);
    }
}
