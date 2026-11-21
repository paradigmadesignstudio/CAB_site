<?php

namespace Tests\Unit;

use App\Services\Cab\CabApiClient;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CabApiClientCacheTest extends TestCase
{
    #[Test]
    public function it_caches_successful_get_responses(): void
    {
        config([
            'cab.enabled' => true,
            'cab.base_url' => 'https://example.test/api/site',
            'cab.version' => 'v1',
            'cab.timeout' => 5,
            'cab.cache_ttl' => 600,
        ]);

        Http::fake([
            'https://example.test/api/site/blog/materias' => Http::response([
                'data' => [['id' => 1, 'title' => 'Post']],
            ]),
        ]);

        $client = new CabApiClient();

        $first = $client->get('blog/materias');
        $second = $client->get('blog/materias');

        $this->assertSame($first, $second);
        Http::assertSentCount(1);
    }

    #[Test]
    public function it_skips_cache_when_ttl_is_zero(): void
    {
        config([
            'cab.enabled' => true,
            'cab.base_url' => 'https://example.test/api/site',
            'cab.version' => 'v1',
            'cab.timeout' => 5,
            'cab.cache_ttl' => 0,
        ]);

        Http::fake([
            'https://example.test/api/site/blog/materias' => Http::response(['data' => []]),
        ]);

        $client = new CabApiClient();
        $client->get('blog/materias');
        $client->get('blog/materias');

        Http::assertSentCount(2);
    }

    #[Test]
    public function it_does_not_cache_failed_get_responses(): void
    {
        config([
            'cab.enabled' => true,
            'cab.base_url' => 'https://example.test/api/site',
            'cab.version' => 'v1',
            'cab.timeout' => 5,
            'cab.cache_ttl' => 600,
        ]);

        Http::fake([
            'https://example.test/api/site/blog/materias' => Http::sequence()
                ->push([], 503)
                ->push(['data' => [['id' => 1, 'title' => 'Post']]], 200),
        ]);

        $client = new CabApiClient();

        $this->assertSame([], $client->get('blog/materias'));
        $this->assertCount(1, $client->get('blog/materias'));

        Http::assertSentCount(2);
    }

    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }
}
