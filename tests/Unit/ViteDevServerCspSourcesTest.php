<?php

namespace Tests\Unit;

use App\Support\ViteDevServerCspSources;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ViteDevServerCspSourcesTest extends TestCase
{
    #[Test]
    public function it_ignores_the_hot_file_outside_local(): void
    {
        $hotFile = $this->hotFile("http://[::1]:5173\n");

        config(['cab.vite_hot_file' => $hotFile]);

        $this->assertNull(ViteDevServerCspSources::origins());
    }

    #[Test]
    public function it_reads_ipv6_vite_origin_in_local(): void
    {
        $hotFile = $this->hotFile("http://[::1]:5173\n");

        $this->app['env'] = 'local';
        config(['cab.vite_hot_file' => $hotFile]);

        $this->assertSame([
            'http' => 'http://[::1]:5173',
            'ws' => 'ws://[::1]:5173',
        ], ViteDevServerCspSources::origins());
    }

    #[Test]
    public function it_rejects_a_hot_file_that_is_not_http(): void
    {
        $hotFile = $this->hotFile("javascript:alert(1)\n");

        $this->app['env'] = 'local';
        config(['cab.vite_hot_file' => $hotFile]);

        $this->assertNull(ViteDevServerCspSources::origins());
    }

    private function hotFile(string $contents): string
    {
        $hotFile = tempnam(sys_get_temp_dir(), 'vite-hot-');
        $this->assertNotFalse($hotFile);
        file_put_contents($hotFile, $contents);

        return $hotFile;
    }
}
