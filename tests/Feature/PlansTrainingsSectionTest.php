<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PlansTrainingsSectionTest extends TestCase
{
    #[Test]
    public function plans_page_loads_trainings_section_meta_in_initial_payload(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.courses' => 'https://crm.example.com/api/site/courses',
            'cab.endpoints.plans' => 'https://crm.example.com/api/site/plans',
        ]);

        Http::fake([
            'https://crm.example.com/api/site/courses' => Http::response([
                'data' => [
                    ['id' => 1, 'nome' => 'Curso A', 'quantidade_aulas' => 5, 'idiomas' => []],
                    ['id' => 2, 'nome' => 'Curso B', 'quantidade_aulas' => 8, 'idiomas' => []],
                ],
            ], 200),
            'https://crm.example.com/api/site/plans' => Http::response([
                [
                    'id' => 2,
                    'titulo' => 'Associação 1.4',
                    'valor_recorrente' => 169.9,
                    'valor_anual' => 1733,
                    'duracao_meses' => 12,
                    'beneficios' => [],
                ],
                [
                    'id' => 3,
                    'titulo' => 'Associação 2.0',
                    'valor_recorrente' => 259.9,
                    'valor_anual' => 2650.98,
                    'duracao_meses' => 12,
                    'beneficios' => [],
                ],
                [
                    'id' => 4,
                    'titulo' => 'Associação 3.0',
                    'valor_recorrente' => 297.99,
                    'valor_anual' => 3039.3,
                    'duracao_meses' => 12,
                    'beneficios' => [],
                ],
            ], 200),
        ]);

        $this->get('/planos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('plans/page')
                ->where('trainingsTableMeta.totalCount', 2)
                ->has('trainingsTableMeta.planSummary', 3)
                ->where('trainingsTableMeta.planSummary.0.count', 2)
                ->where('trainingsTableMeta.planSummary.2.count', 2)
                ->where('trainingsTableMeta.title', '+2 Treinamentos Online Incluídos')
            );
    }

    #[Test]
    public function trainings_table_endpoint_returns_groups_from_courses_api(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.courses' => 'https://crm.example.com/api/site/courses',
        ]);

        Http::fake([
            'https://crm.example.com/api/site/courses' => Http::response([
                'data' => [
                    ['id' => 10, 'nome' => '6T40', 'quantidade_aulas' => 9, 'idiomas' => ['Português']],
                ],
            ], 200),
        ]);

        $this->getJson('/planos/treinamentos')
            ->assertOk()
            ->assertJsonPath('groups.0.rows.0.label', '6T40')
            ->assertJsonPath('groups.0.rows.0.lessonCount', 9);
    }
}
