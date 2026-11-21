<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SeoSharedPropsTest extends TestCase
{
    #[Test]
    public function home_shares_seo_defaults_for_open_graph_and_schema(): void
    {
        config([
            'app.url' => 'https://www.cambioautomaticodobrasil.com.br',
            'cab.default_og_image' => '/images/carousel/cab_carousel_1.webp',
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home/page')
                ->where('appUrl', 'https://www.cambioautomaticodobrasil.com.br')
                ->where('defaultOgImage', '/images/carousel/cab_carousel_1.webp')
                ->has('siteCompany.trade_name')
                ->has('siteCompany.legal_name')
                ->has('siteCompany.cnpj')
            );
    }
}
