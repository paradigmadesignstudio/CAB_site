<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AcademyPlatformMaterialsSectionTest extends TestCase
{
    #[Test]
    public function academy_page_loads_platform_materials_section_in_initial_payload(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.platform_materials' => 'https://crm.example.com/api/site/materiais',
            'cab.academy_platform_materials_featured_count' => 2,
        ]);

        Http::fake([
            'https://crm.example.com/api/site/materiais' => Http::response([
                'data' => [
                    [
                        'categoria_id' => 10,
                        'categoria' => 'Boletins Técnicos',
                        'materiais' => [
                            [
                                'id' => 99,
                                'nome' => 'Boletim 6T40',
                                'imagem_url' => 'https://crm.example.com/storage/tips/image/boletim.jpg',
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->get('/academia-cab');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('academy/page')
            ->has('pageContent.platformMaterialsSection')
            ->has('platformMaterialsSectionData.meta.totalCount')
            ->has('platformMaterialsSectionData.featured', 1)
            ->has('platformMaterialsSectionData.categories', 1)
            ->where('platformMaterialsSectionData.featured.0.title', 'Boletim 6T40')
        );
    }
}
