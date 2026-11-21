<?php

namespace Tests\Unit;

use App\Services\Cab\Academy\PlatformMaterialsDataMapper;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PlatformMaterialsDataMapperTest extends TestCase
{
    private PlatformMaterialsDataMapper $mapper;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mapper = new PlatformMaterialsDataMapper;
    }

    #[Test]
    public function it_maps_categories_and_material_cards(): void
    {
        config(['cab.academy_platform_materials_plans_link' => 'https://crm.cambioautomaticodobrasil.com.br/login-associado']);

        $mapped = $this->mapper->mapCategories([
            [
                'categoria_id' => 1,
                'categoria' => 'Artigos / Informativos Técnicos',
                'materiais' => [
                    [
                        'id' => 1240,
                        'nome' => '01J - CVT / INFORMAÇÕES TÉCNICAS',
                        'imagem_url' => 'https://crm.example.com/storage/tips/image/01jj-1240.jpg',
                    ],
                ],
            ],
        ]);

        $this->assertCount(1, $mapped);
        $this->assertSame(1, $mapped[0]['id']);
        $this->assertSame('Artigos / Informativos Técnicos', $mapped[0]['name']);
        $this->assertCount(1, $mapped[0]['materials']);
        $this->assertSame(1240, $mapped[0]['materials'][0]['id']);
        $this->assertSame('01J - CVT / INFORMAÇÕES TÉCNICAS', $mapped[0]['materials'][0]['title']);
        $this->assertSame(
            'https://crm.cambioautomaticodobrasil.com.br/login-associado',
            $mapped[0]['materials'][0]['link'],
        );
    }

    #[Test]
    public function it_picks_featured_materials_randomly_from_flattened_categories(): void
    {
        $categories = [
            [
                'id' => 1,
                'name' => 'Categoria A',
                'materials' => [
                    ['id' => 1, 'title' => 'A1', 'image' => '', 'category' => 'Categoria A', 'categoryId' => 1, 'link' => 'https://crm.cambioautomaticodobrasil.com.br/login-associado'],
                    ['id' => 2, 'title' => 'A2', 'image' => '', 'category' => 'Categoria A', 'categoryId' => 1, 'link' => 'https://crm.cambioautomaticodobrasil.com.br/login-associado'],
                ],
            ],
            [
                'id' => 2,
                'name' => 'Categoria B',
                'materials' => [
                    ['id' => 3, 'title' => 'B1', 'image' => '', 'category' => 'Categoria B', 'categoryId' => 2, 'link' => 'https://crm.cambioautomaticodobrasil.com.br/login-associado'],
                ],
            ],
        ];

        $featured = $this->mapper->pickFeatured($categories, 3);

        $this->assertCount(3, $featured);
        $this->assertEqualsCanonicalizing([1, 2, 3], array_column($featured, 'id'));
    }
}
