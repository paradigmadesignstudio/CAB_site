<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MemberWorkshopsRoutesTest extends TestCase
{
    #[Test]
    public function oficinas_index_renders_workshops_from_hotsites_api(): void
    {
        config([
            'cab.enabled' => true,
            'cab.features.oficinas_enabled' => true,
            'cab.endpoints.hotsites' => 'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites',
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites' => Http::response([
                'total' => 1,
                'data' => [[
                    'id' => 26,
                    'nome' => 'CHECKAUTO AUTO CENTER',
                    'slug' => 'checkauto-auto-center',
                    'cidade' => 'Arapiraca',
                    'estado' => 'AL',
                    'logo_url' => null,
                    'descricao_curta' => 'Oficina completa.',
                    'telefone' => '(82)99841-0225',
                    'whatsapp' => '82998410225',
                    'commodities' => [
                        ['id' => 1, 'nome' => 'Câmbio Automático', 'slug' => 'cambio-automatico'],
                    ],
                    'servicos_cliente' => [],
                ]],
            ], 200),
        ]);

        $this->get('/oficinas')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('member-workshops/find-member/page')
                ->has('workshops', 1)
                ->where('workshops.0.slug', 'checkauto-auto-center')
                ->where('workshops.0.name', 'CHECKAUTO AUTO CENTER')
            );
    }

    #[Test]
    public function oficinas_show_renders_workshop_detail_from_hotsites_api(): void
    {
        config([
            'cab.enabled' => true,
            'cab.features.oficinas_enabled' => true,
            'cab.endpoints.hotsites' => 'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites',
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites/checkauto-auto-center' => Http::response([
                'data' => [
                    'id' => 26,
                    'nome' => 'CHECKAUTO AUTO CENTER',
                    'slug' => 'checkauto-auto-center',
                    'cidade' => 'Arapiraca',
                    'estado' => 'AL',
                    'descricao_curta' => 'Oficina completa.',
                    'descricao_completa' => 'Descrição detalhada da oficina.',
                    'endereco_completo' => 'Rua José Emídio de Lima',
                    'telefone' => '(82)99841-0225',
                    'whatsapp' => '82998410225',
                    'site_externo' => 'https://www.checkautoautocenter.com.br',
                    'fotos' => [
                        [
                            'id' => 3,
                            'url' => 'http://crm.cambioautomaticodobrasil.com.br/storage/hotsites/5332/galeria/foto.jpg',
                            'legenda' => null,
                            'ordem' => 1,
                        ],
                    ],
                    'fotos_total' => 1,
                    'commodities' => [
                        ['id' => 1, 'nome' => 'Câmbio Automático', 'slug' => 'cambio-automatico'],
                    ],
                    'servicos_cliente' => [],
                ],
            ], 200),
        ]);

        $this->get('/oficinas/checkauto-auto-center')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('member-workshops/workshop-home/page')
                ->where('slug', 'checkauto-auto-center')
                ->where('workshop.name', 'CHECKAUTO AUTO CENTER')
                ->where('workshop.fullDescription', 'Descrição detalhada da oficina.')
                ->where('workshop.address', 'Rua José Emídio de Lima')
                ->where('workshop.galleryImageCount', 1)
                ->missing('workshop.galleryImages')
            );
    }

    #[Test]
    public function oficinas_show_returns_not_found_when_hotsite_does_not_exist(): void
    {
        config([
            'cab.enabled' => true,
            'cab.features.oficinas_enabled' => true,
            'cab.endpoints.hotsites' => 'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites',
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites/inexistente' => Http::response([], 404),
            'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites' => Http::response(['data' => []], 200),
        ]);

        $this->get('/oficinas/inexistente')->assertNotFound();
    }

    #[Test]
    public function legacy_sou_cab_urls_redirect_to_oficinas(): void
    {
        config([
            'cab.enabled' => true,
            'cab.features.oficinas_enabled' => true,
            'cab.endpoints.hotsites' => 'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites',
        ]);

        Http::fake([
            'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites' => Http::response(['data' => []], 200),
            'https://crm.cambioautomaticodobrasil.com.br/api/site/hotsites/checkauto-auto-center' => Http::response([
                'data' => [
                    'id' => 26,
                    'nome' => 'CHECKAUTO AUTO CENTER',
                    'slug' => 'checkauto-auto-center',
                    'cidade' => 'Arapiraca',
                    'estado' => 'AL',
                    'descricao_curta' => 'Oficina completa.',
                    'commodities' => [],
                    'servicos_cliente' => [],
                ],
            ], 200),
        ]);

        $this->get('/sou-cab')->assertRedirect('/oficinas');
        $this->get('/sou-cab/checkauto-auto-center')->assertRedirect('/oficinas/checkauto-auto-center');
    }
}
