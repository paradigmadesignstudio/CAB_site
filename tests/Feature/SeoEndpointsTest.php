<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SeoEndpointsTest extends TestCase
{
    #[Test]
    public function robots_txt_lists_disallow_rules_and_sitemap_url(): void
    {
        config(['app.url' => 'https://www.example.test']);

        $this->get('/robots.txt')
            ->assertOk()
            ->assertHeader('content-type', 'text/plain; charset=UTF-8')
            ->assertSee('User-agent: *')
            ->assertSee('Disallow: /health')
            ->assertSee('Disallow: /blog/posts/load-more')
            ->assertSee('Disallow: /blog/search-index')
            ->assertSee('Disallow: /planos/treinamentos')
            ->assertSee('Sitemap: https://www.example.test/sitemap.xml');
    }

    #[Test]
    public function sitemap_xml_includes_static_pages_when_api_is_disabled(): void
    {
        Cache::flush();

        config([
            'app.url' => 'https://www.example.test',
            'cab.enabled' => false,
            'cab.features.oficinas_enabled' => false,
            'cab.sitemap_cache_ttl' => 0,
        ]);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('content-type', 'application/xml; charset=UTF-8')
            ->assertSee('<loc>https://www.example.test/</loc>', false)
            ->assertSee('<loc>https://www.example.test/planos</loc>', false)
            ->assertSee('<loc>https://www.example.test/parceiros</loc>', false)
            ->assertSee('<loc>https://www.example.test/blog</loc>', false)
            ->assertDontSee('<loc>https://www.example.test/planos/treinamentos</loc>', false)
            ->assertDontSee('<loc>https://www.example.test/oficinas</loc>', false);
    }

    #[Test]
    public function sitemap_xml_includes_dynamic_urls_from_api(): void
    {
        Cache::flush();

        config([
            'app.url' => 'https://www.example.test',
            'cab.enabled' => true,
            'cab.base_url' => 'https://api.example.test',
            'cab.endpoints.blog.posts' => 'blog/posts',
            'cab.endpoints.events' => 'https://api.example.test/eventos',
            'cab.endpoints.sponsors' => 'https://api.example.test/patrocinadores',
            'cab.sitemap_cache_ttl' => 0,
        ]);

        Http::fake([
            'https://api.example.test/blog/posts' => Http::response([
                [
                    'slug' => 'artigo-teste',
                    'published_at' => '2026-06-01T10:00:00Z',
                    'category' => ['slug' => 'dicas', 'name' => 'Dicas'],
                ],
                [
                    'slug' => 'evento-blog',
                    'category' => ['slug' => 'eventos', 'name' => 'Eventos'],
                ],
            ], 200),
            'https://api.example.test/eventos' => Http::response([
                [
                    'id' => 1,
                    'slug' => 'congresso-cab',
                    'titulo' => 'Congresso',
                    'data_hora_inicio' => '2026-09-01 09:00:00',
                    'data_hora_fim' => '2026-09-01 18:00:00',
                ],
            ], 200),
            'https://api.example.test/patrocinadores' => Http::response([
                [
                    'id' => 2,
                    'nome' => 'TECNOMOTOR',
                    'logo' => '',
                    'url' => '',
                ],
            ], 200),
        ]);

        $response = $this->get('/sitemap.xml')->assertOk();

        $response->assertSee('<loc>https://www.example.test/blog/artigo-teste</loc>', false);
        $response->assertSee('<lastmod>2026-06-01</lastmod>', false);
        $response->assertSee('<loc>https://www.example.test/blog/eventos/congresso-cab</loc>', false);
        $response->assertSee('<loc>https://www.example.test/parceiros/tecnomotor</loc>', false);
        $response->assertDontSee('<loc>https://www.example.test/blog/evento-blog</loc>', false);
    }
}
