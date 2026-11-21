<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EventsRoutesTest extends TestCase
{
    #[Test]
    public function event_detail_page_renders_when_api_returns_event(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.events' => 'https://crm.cambioautomaticodobrasil.com.br/api/site/eventos',
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/site/eventos/congresso-cab' => Http::response([
                'data' => [
                    'id' => 1,
                    'slug' => 'congresso-cab',
                    'titulo' => 'Congresso CAB',
                    'resumo' => 'Resumo do evento.',
                    'modalidade' => 'presencial',
                    'data_hora_inicio' => now()->addDays(10)->toIso8601String(),
                    'data_hora_fim' => now()->addDays(11)->toIso8601String(),
                    'fuso_horario' => 'America/Sao_Paulo',
                    'cidade' => 'São Paulo',
                    'uf' => 'SP',
                    'local_evento' => 'Expo Center Norte',
                    'valor' => 299,
                    'banner_url' => 'https://crm.cambioautomaticodobrasil.com.br/storage/eventos/banners/test.webp',
                    'descricao' => 'Descrição completa do congresso.',
                    'fotos' => [],
                ],
            ], 200),
            'https://crm.cambioautomaticodobrasil.com.br/api/site/eventos' => Http::response(['data' => []], 200),
        ]);

        $this->get('/blog/eventos/congresso-cab')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('events/show/page')
                ->where('event.slug', 'congresso-cab')
                ->where('event.title', 'Congresso CAB')
                ->where('event.galleryImageCount', 0)
                ->missing('event.galleryImages'));
    }

    #[Test]
    public function event_detail_page_returns_not_found_when_api_has_no_event(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.events' => 'https://crm.cambioautomaticodobrasil.com.br/api/site/eventos',
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/site/eventos/inexistente' => Http::response([], 404),
        ]);

        $this->get('/blog/eventos/inexistente')->assertNotFound();
    }

    #[Test]
    public function blog_events_page_loads_upcoming_and_past_events_from_api(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.events' => 'https://crm.cambioautomaticodobrasil.com.br/api/site/eventos',
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/site/eventos' => Http::response([
                'data' => [
                    [
                        'id' => 1,
                        'slug' => 'evento-futuro',
                        'titulo' => 'Evento Futuro',
                        'resumo' => 'Resumo futuro.',
                        'modalidade' => 'presencial',
                        'data_hora_inicio' => now()->addDays(10)->toIso8601String(),
                        'data_hora_fim' => now()->addDays(11)->toIso8601String(),
                        'fuso_horario' => 'America/Sao_Paulo',
                        'cidade' => 'São Paulo',
                        'uf' => 'SP',
                        'banner_url' => 'https://crm.cambioautomaticodobrasil.com.br/storage/eventos/banners/future.webp',
                    ],
                    [
                        'id' => 2,
                        'slug' => 'evento-passado',
                        'titulo' => 'Evento Passado',
                        'resumo' => 'Resumo passado.',
                        'modalidade' => 'online',
                        'data_hora_inicio' => now()->subDays(30)->toIso8601String(),
                        'data_hora_fim' => now()->subDays(29)->toIso8601String(),
                        'fuso_horario' => 'America/Sao_Paulo',
                        'cidade' => 'Curitiba',
                        'uf' => 'PR',
                        'banner_url' => 'https://crm.cambioautomaticodobrasil.com.br/storage/eventos/banners/past.webp',
                    ],
                ],
            ], 200),
        ]);

        $this->get('/blog/eventos')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('blog/category/page')
                ->has('categoryData.upcomingEvents', 1)
                ->has('categoryData.pastEvents', 1)
                ->where('categoryData.upcomingEvents.0.slug', 'evento-futuro')
                ->where('categoryData.pastEvents.0.slug', 'evento-passado')
                ->where('categoryData.posts', []));
    }
}
