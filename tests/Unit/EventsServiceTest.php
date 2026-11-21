<?php

namespace Tests\Unit;

use App\Services\Cab\Events\EventsService;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EventsServiceTest extends TestCase
{
    #[Test]
    public function it_splits_list_into_upcoming_and_ended_events(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.events' => 'https://crm.example.com/api/site/eventos',
        ]);

        Http::fake([
            'https://crm.example.com/api/site/eventos' => Http::response([
                'data' => [
                    [
                        'id' => 1,
                        'slug' => 'futuro',
                        'titulo' => 'Futuro',
                        'resumo' => 'Resumo',
                        'modalidade' => 'presencial',
                        'data_hora_inicio' => now()->addDays(5)->toIso8601String(),
                        'data_hora_fim' => now()->addDays(6)->toIso8601String(),
                        'fuso_horario' => 'America/Sao_Paulo',
                        'cidade' => 'São Paulo',
                        'uf' => 'SP',
                    ],
                    [
                        'id' => 2,
                        'slug' => 'passado',
                        'titulo' => 'Passado',
                        'resumo' => 'Resumo',
                        'modalidade' => 'online',
                        'data_hora_inicio' => now()->subDays(20)->toIso8601String(),
                        'data_hora_fim' => now()->subDays(19)->toIso8601String(),
                        'fuso_horario' => 'America/Sao_Paulo',
                        'cidade' => 'Curitiba',
                        'uf' => 'PR',
                    ],
                ],
            ], 200),
        ]);

        $service = app(EventsService::class);

        $this->assertCount(1, $service->listUpcoming());
        $this->assertSame('futuro', $service->listUpcoming()[0]['slug']);
        $this->assertCount(1, $service->listEnded());
        $this->assertSame('passado', $service->listEnded()[0]['slug']);
    }

    #[Test]
    public function home_slider_keeps_recent_past_events_behind_upcoming_ones(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.events' => 'https://crm.example.com/api/site/eventos',
        ]);

        Http::fake([
            'https://crm.example.com/api/site/eventos' => Http::response([
                'data' => [
                    $this->event(1, 'antigo', now()->subDays(90), now()->subDays(89)),
                    $this->event(2, 'recente', now()->subDays(3), now()->subDays(2)),
                    $this->event(3, 'futuro', now()->addDays(8), now()->addDays(9)),
                ],
            ], 200),
        ]);

        $slides = app(EventsService::class)->listForHome(3);

        $this->assertSame(['futuro', 'recente', 'antigo'], array_column($slides, 'slug'));
    }

    /**
     * @return array<string, mixed>
     */
    private function event(int $id, string $slug, \DateTimeInterface $start, \DateTimeInterface $end): array
    {
        return [
            'id' => $id,
            'slug' => $slug,
            'titulo' => $slug,
            'resumo' => 'Resumo',
            'modalidade' => 'presencial',
            'data_hora_inicio' => $start->format(DATE_ATOM),
            'data_hora_fim' => $end->format(DATE_ATOM),
            'fuso_horario' => 'America/Sao_Paulo',
            'cidade' => 'São Paulo',
            'uf' => 'SP',
        ];
    }
}
