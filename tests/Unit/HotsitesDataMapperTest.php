<?php

namespace Tests\Unit;

use App\Services\Cab\MemberWorkshops\HotsitesDataMapper;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HotsitesDataMapperTest extends TestCase
{
    #[Test]
    public function it_maps_list_item_from_hotsites_api(): void
    {
        $mapper = new HotsitesDataMapper();

        $mapped = $mapper->mapList([[
            'id' => 26,
            'nome' => 'CHECKAUTO AUTO CENTER',
            'slug' => 'checkauto-auto-center',
            'cidade' => 'Arapiraca',
            'estado' => 'AL',
            'logo_url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/logo.png',
            'descricao_curta' => 'Oficina completa, especializada em câmbios automáticos.',
            'telefone' => '(82)99841-0225',
            'whatsapp' => '82998410225',
            'commodities' => [
                ['id' => 1, 'nome' => 'Câmbio Automático', 'slug' => 'cambio-automatico'],
            ],
            'servicos_cliente' => [],
        ]])[0];

        $this->assertSame(26, $mapped['id']);
        $this->assertSame('checkauto-auto-center', $mapped['slug']);
        $this->assertSame('CHECKAUTO AUTO CENTER', $mapped['name']);
        $this->assertSame('Arapiraca', $mapped['city']);
        $this->assertSame('AL', $mapped['state']);
        $this->assertSame('Câmbio Automático', $mapped['category']);
        $this->assertSame(['Câmbio Automático'], $mapped['specialties']);
        $this->assertStringStartsWith('/media/', $mapped['logo']);
        $this->assertStringNotContainsString('crm.cambioautomaticodobrasil.com.br', $mapped['logo']);
        $this->assertNull($mapped['coverImageMobile']);
    }

    #[Test]
    public function it_maps_cover_image_mobile_from_banner_thumb_url(): void
    {
        $mapper = new HotsitesDataMapper();

        $mapped = $mapper->mapList([[
            'id' => 99,
            'nome' => 'Oficina Teste',
            'slug' => 'oficina-teste',
            'cidade' => 'São Paulo',
            'estado' => 'SP',
            'banner_url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/banner.webp',
            'banner_thumb_url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/banner-thumb.webp',
            'logo_url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/logo.png',
            'descricao_curta' => 'Oficina de teste.',
            'commodities' => [],
            'servicos_cliente' => [],
        ]])[0];

        $this->assertStringStartsWith('/media/', $mapped['coverImage']);
        $this->assertStringStartsWith('/media/', $mapped['coverImageMobile']);
        $this->assertNotSame($mapped['coverImage'], $mapped['coverImageMobile']);
    }

    #[Test]
    public function it_maps_detail_payload_with_address_and_client_services(): void
    {
        $mapper = new HotsitesDataMapper();

        $detail = $mapper->mapDetail([
            'id' => 26,
            'nome' => 'CHECKAUTO AUTO CENTER',
            'slug' => 'checkauto-auto-center',
            'cidade' => 'Arapiraca',
            'estado' => 'AL',
            'descricao_curta' => 'Resumo da oficina.',
            'descricao_completa' => '<p>Descrição completa da oficina.</p>',
            'endereco_completo' => 'Rua José Emídio de Lima',
            'telefone' => '(82)99841-0225',
            'whatsapp' => '82998410225',
            'site_externo' => 'https://www.checkautoautocenter.com.br',
            'latitude' => -9.7523,
            'longitude' => -36.6612,
            'commodities' => [
                ['id' => 1, 'nome' => 'Câmbio Automático', 'slug' => 'cambio-automatico'],
            ],
            'servicos_cliente' => [
                ['id' => 4, 'nome' => 'Wi-Fi Gratuito', 'slug' => 'wi-fi-gratuito'],
            ],
            'horario_funcionamento' => json_encode([
                ['dia' => 'Segunda-feira', 'aberto' => true, 'abertura' => '08:00', 'fechamento' => '18:00'],
            ], JSON_THROW_ON_ERROR),
        ]);

        $this->assertSame('Descrição completa da oficina.', $detail['fullDescription']);
        $this->assertSame('Rua José Emídio de Lima', $detail['address']);
        $this->assertContains('Wi-Fi Gratuito', $detail['specialties']);
        $this->assertSame('https://www.checkautoautocenter.com.br', $detail['website']);
        $this->assertSame(-9.7523, $detail['coordinates']['lat']);
        $this->assertArrayHasKey('coordinates', $detail);
        $this->assertSame(-9.7523, $detail['coordinates']['lat']);
        $this->assertStringContainsString('Segunda-feira: 08:00–18:00', (string) $detail['hours']);
    }

    #[Test]
    public function it_maps_gallery_images_from_fotos_on_detail(): void
    {
        $mapper = new HotsitesDataMapper();

        $detail = $mapper->mapDetail([
            'id' => 65,
            'nome' => 'Serramalta Auto Center',
            'slug' => 'serramalta-auto-center',
            'cidade' => 'Ipixuna do Pará',
            'estado' => 'PA',
            'banner_url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/3393/banner/banner.png',
            'fotos' => [
                [
                    'id' => 57,
                    'url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/3393/galeria/two.png',
                    'legenda' => null,
                    'ordem' => 2,
                ],
                [
                    'id' => 56,
                    'url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/3393/galeria/one.png',
                    'legenda' => 'Fachada',
                    'ordem' => 1,
                ],
                [
                    'id' => 99,
                    'url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/3393/banner/banner.png',
                    'ordem' => 3,
                ],
            ],
            'commodities' => [],
            'servicos_cliente' => [],
        ]);

        $this->assertCount(2, $detail['galleryImages']);
        $this->assertStringContainsString('one.png', \App\Support\CabMediaUrl::decode(
            substr((string) $detail['galleryImages'][0]['full'], strlen('/media/')),
        ));
        $this->assertSame($detail['galleryImages'][0]['full'], $detail['galleryImages'][0]['thumb']);
        $this->assertStringStartsWith('/media/', $detail['galleryImages'][1]['full']);
    }

    #[Test]
    public function it_does_not_include_gallery_images_on_list_cards(): void
    {
        $mapper = new HotsitesDataMapper();

        $mapped = $mapper->mapList([[
            'id' => 26,
            'nome' => 'CHECKAUTO AUTO CENTER',
            'slug' => 'checkauto-auto-center',
            'cidade' => 'Arapiraca',
            'estado' => 'AL',
            'fotos' => [
                [
                    'id' => 1,
                    'url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/1/galeria/a.jpg',
                    'ordem' => 1,
                ],
            ],
            'commodities' => [],
            'servicos_cliente' => [],
        ]])[0];

        $this->assertArrayNotHasKey('galleryImages', $mapped);
    }
}
