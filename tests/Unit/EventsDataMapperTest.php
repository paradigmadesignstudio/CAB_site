<?php

namespace Tests\Unit;

use App\Services\Cab\Events\EventsDataMapper;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EventsDataMapperTest extends TestCase
{
    #[Test]
    public function it_maps_list_and_detail_payloads_from_crm_api(): void
    {
        $mapper = new EventsDataMapper();

        $listItem = [
            'id' => 8,
            'slug' => '1o-seminario-tecnico-do-mecanica-geral-do-brasil',
            'titulo' => '1º Seminário Técnico do Mecânica Geral do Brasil',
            'resumo' => 'O marco inicial para a excelência em mecânica e transmissões.',
            'modalidade' => 'presencial',
            'data_hora_inicio' => '2017-03-28T07:00:00-03:00',
            'data_hora_fim' => '2017-03-30T12:00:00-03:00',
            'fuso_horario' => 'America/Sao_Paulo',
            'cidade' => 'São João da Boa Vista',
            'uf' => 'SP',
            'local_evento' => 'Hotel Mansão dos Nobres',
            'valor' => 100,
            'banner_url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/eventos/banners/example.webp',
        ];

        $card = $mapper->mapList([$listItem])[0];

        $this->assertSame(8, $card['id']);
        $this->assertSame('1o-seminario-tecnico-do-mecanica-geral-do-brasil', $card['slug']);
        $this->assertSame('/blog/eventos/1o-seminario-tecnico-do-mecanica-geral-do-brasil', $card['link']);
        $this->assertSame('ended', $card['status']);
        $this->assertSame('São João da Boa Vista, SP', $card['location']);
        $this->assertSame('', $card['priceLabel']);
        $this->assertStringStartsWith('/media/', $card['image']);

        $detail = $mapper->mapDetail(array_merge($listItem, [
            'descricao' => 'Realizado entre os dias 28 e 30 de março no Hotel Mansão dos Nobres.',
            'latitude' => -21.9878,
            'longitude' => -46.8047,
            'capacidade_total' => 150,
            'formas_pagamento' => ['pix', 'cartao', 'boleto'],
            'parcelamento' => 12,
            'fotos' => [
                [
                    'id' => 310,
                    'url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/eventos/8/galeria/one.webp',
                    'ordem' => 1,
                ],
            ],
        ]));

        $this->assertSame('Hotel Mansão dos Nobres', $detail['venue']['name']);
        $this->assertCount(1, $detail['description']);
        $this->assertCount(1, $detail['galleryImages']);
        $this->assertStringStartsWith('/media/', $detail['galleryImages'][0]['full']);
        $this->assertSame($detail['galleryImages'][0]['full'], $detail['galleryImages'][0]['thumb']);
        $this->assertStringContainsString('PIX', implode(' ', $detail['highlights']));
        $this->assertArrayHasKey('coordinates', $detail['venue']);
        $this->assertNotNull($detail['venue']['coordinates']);
    }

    #[Test]
    public function it_excludes_banner_from_gallery_images(): void
    {
        $mapper = new EventsDataMapper();

        $banner = 'http://crm.cambioautomaticodobrasil.com.br/storage/eventos/banners/example.webp';
        $gallery = 'http://crm.cambioautomaticodobrasil.com.br/storage/eventos/8/galeria/one.webp';

        $detail = $mapper->mapDetail([
            'id' => 8,
            'slug' => 'evento-teste',
            'titulo' => 'Evento teste',
            'resumo' => 'Resumo',
            'modalidade' => 'presencial',
            'data_hora_inicio' => now()->subDays(5)->toIso8601String(),
            'data_hora_fim' => now()->subDays(4)->toIso8601String(),
            'fuso_horario' => 'America/Sao_Paulo',
            'cidade' => 'São Paulo',
            'uf' => 'SP',
            'banner_url' => $banner,
            'fotos' => [
                ['id' => 1, 'url' => $banner, 'ordem' => 0],
                ['id' => 2, 'url' => $gallery, 'ordem' => 1],
            ],
        ]);

        $this->assertCount(1, $detail['galleryImages']);
        $token = substr((string) $detail['galleryImages'][0]['full'], strlen('/media/'));
        $decoded = \App\Support\CabMediaUrl::decode($token);
        $this->assertNotNull($decoded);
        $this->assertStringContainsString('/galeria/', $decoded);
    }

    #[Test]
    public function it_uses_api_thumb_url_when_available(): void
    {
        $mapper = new EventsDataMapper();

        $detail = $mapper->mapDetail([
            'id' => 9,
            'slug' => 'evento-thumb',
            'titulo' => 'Evento thumb',
            'resumo' => 'Resumo',
            'modalidade' => 'presencial',
            'data_hora_inicio' => now()->subDays(5)->toIso8601String(),
            'data_hora_fim' => now()->subDays(4)->toIso8601String(),
            'fuso_horario' => 'America/Sao_Paulo',
            'cidade' => 'São Paulo',
            'uf' => 'SP',
            'fotos' => [
                [
                    'id' => 1,
                    'url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/eventos/9/galeria/full.webp',
                    'thumb_url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/eventos/9/galeria/full-thumb.webp',
                    'ordem' => 1,
                ],
            ],
        ]);

        $thumbToken = substr((string) $detail['galleryImages'][0]['thumb'], strlen('/media/'));
        $fullToken = substr((string) $detail['galleryImages'][0]['full'], strlen('/media/'));

        $this->assertSame(
            'https://crm.cambioautomaticodobrasil.com.br/storage/eventos/9/galeria/full-thumb.webp',
            \App\Support\CabMediaUrl::decode($thumbToken),
        );
        $this->assertSame(
            'https://crm.cambioautomaticodobrasil.com.br/storage/eventos/9/galeria/full.webp',
            \App\Support\CabMediaUrl::decode($fullToken),
        );
    }

    #[Test]
    public function it_resolves_ticket_url_using_lp_slug_override(): void
    {
        $mapper = new EventsDataMapper();

        $detail = $mapper->mapDetail([
            'id' => 9,
            'slug' => '7o-congresso-da-cambio-automatico-do-brasil',
            'titulo' => '7º Congresso da Câmbio Automático do Brasil',
            'resumo' => 'Resumo.',
            'modalidade' => 'presencial',
            'data_hora_inicio' => now()->addDays(30)->toIso8601String(),
            'data_hora_fim' => now()->addDays(31)->toIso8601String(),
            'fuso_horario' => 'America/Sao_Paulo',
            'cidade' => 'Joinville',
            'uf' => 'SC',
        ]);

        $this->assertSame(
            'https://lp.cambioautomaticodobrasil.com.br/7-congresso-cab',
            $detail['ticketUrl'],
        );
    }

    #[Test]
    public function it_resolves_ticket_url_from_slug_and_hides_price_label(): void
    {
        config([
            'cab.events_ticket_url' => 'https://lp.cambioautomaticodobrasil.com.br/{slug}',
        ]);

        $mapper = new EventsDataMapper();

        $event = [
            'id' => 7,
            'slug' => 'imersao-12h-cambio-automatico-do-brasil',
            'titulo' => 'Imersão 12H',
            'resumo' => 'Resumo.',
            'modalidade' => 'presencial',
            'data_hora_inicio' => now()->addDays(20)->toIso8601String(),
            'data_hora_fim' => now()->addDays(21)->toIso8601String(),
            'fuso_horario' => 'America/Sao_Paulo',
            'cidade' => 'Joinville',
            'uf' => 'SC',
            'valor' => 500,
        ];

        $card = $mapper->mapList([$event])[0];
        $detail = $mapper->mapDetail($event);

        $this->assertSame('', $card['priceLabel']);
        $this->assertSame('upcoming', $card['status']);
        $this->assertSame(
            'https://lp.cambioautomaticodobrasil.com.br/imersao-12h-cambio-automatico-do-brasil',
            $detail['ticketUrl'],
        );
    }

    #[Test]
    public function it_uses_api_ticket_url_when_available(): void
    {
        $mapper = new EventsDataMapper();

        $detail = $mapper->mapDetail([
            'id' => 10,
            'slug' => 'evento-com-link',
            'titulo' => 'Evento com link',
            'resumo' => 'Resumo',
            'modalidade' => 'presencial',
            'data_hora_inicio' => now()->addDays(5)->toIso8601String(),
            'data_hora_fim' => now()->addDays(6)->toIso8601String(),
            'fuso_horario' => 'America/Sao_Paulo',
            'cidade' => 'São Paulo',
            'uf' => 'SP',
            'url_inscricao' => 'https://ingressos.exemplo.com/evento-customizado',
        ]);

        $this->assertSame('https://ingressos.exemplo.com/evento-customizado', $detail['ticketUrl']);
    }
}
