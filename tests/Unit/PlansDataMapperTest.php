<?php

namespace Tests\Unit;

use App\Services\Cab\Plans\PlansDataMapper;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PlansDataMapperTest extends TestCase
{
    #[Test]
    public function it_maps_api_plans_with_static_overlays_and_pricing(): void
    {
        config([
            'cab.plans_signup_url' => 'https://example.com/cadastro',
            'cab.plans_overlays' => config('cab.plans_overlays'),
        ]);

        $mapper = new PlansDataMapper();

        $result = $mapper->mapList([
            [
                'id' => 2,
                'titulo' => 'Associação 1.4',
                'valor_anual' => 1733,
                'valor_recorrente' => 169.9,
                'parcelas' => 10,
                'duracao_meses' => 12,
                'beneficios' => ['acesso_app' => true],
                'desconto_cursos' => null,
                'max_treinamentos_gratuitos' => null,
            ],
            [
                'id' => 3,
                'titulo' => 'Associação 2.0',
                'valor_anual' => 2650.98,
                'valor_recorrente' => 259.9,
                'parcelas' => 10,
                'duracao_meses' => 12,
                'beneficios' => ['acesso_app' => true],
            ],
            [
                'id' => 4,
                'titulo' => 'Associação 3.0',
                'valor_anual' => 3039.3,
                'valor_recorrente' => 297.99,
                'parcelas' => 10,
                'duracao_meses' => 12,
                'beneficios' => ['acesso_app' => true],
            ],
        ]);

        $this->assertCount(3, $result);

        $this->assertSame('14', $result[0]['key']);
        $this->assertSame('Plataforma 1.4', $result[0]['name']);
        $this->assertSame('https://example.com/cadastro', $result[0]['href']);
        $this->assertSame(169.9, $result[0]['basePriceWithFidelity']);
        $this->assertSame(339.8, $result[0]['basePriceWithoutFidelity']);
        $this->assertContains('APP Guia de Transmissões CAB', $result[0]['features']);

        $this->assertSame('20', $result[1]['key']);
        $this->assertFalse($result[1]['popular']);

        $this->assertSame('30', $result[2]['key']);
        $this->assertSame('Plataforma 3.0', $result[2]['name']);
        $this->assertTrue($result[2]['popular']);
        $this->assertSame(297.99, $result[2]['basePriceWithFidelity']);
    }

    #[Test]
    public function it_maps_legacy_2_0t_api_titles_to_platform_3_0(): void
    {
        config([
            'cab.plans_signup_url' => 'https://example.com/cadastro',
            'cab.plans_overlays' => config('cab.plans_overlays'),
        ]);

        $mapper = new PlansDataMapper();

        $result = $mapper->mapList([
            [
                'id' => 4,
                'titulo' => 'Associação 2.0T',
                'valor_recorrente' => 297.99,
                'duracao_meses' => 12,
            ],
        ]);

        $this->assertCount(1, $result);
        $this->assertSame('30', $result[0]['key']);
        $this->assertSame('Plataforma 3.0', $result[0]['name']);
    }

    #[Test]
    public function it_ignores_unknown_plan_titles(): void
    {
        $mapper = new PlansDataMapper();

        $result = $mapper->mapList([
            [
                'id' => 99,
                'titulo' => 'Plano experimental',
                'valor_recorrente' => 99.9,
            ],
        ]);

        $this->assertSame([], $result);
    }
}
