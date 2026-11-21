<?php

namespace App\Services\Site;

class RobotsService
{
    public function content(): string
    {
        $lines = [
            'User-agent: *',
        ];

        foreach ((array) config('cab.robots_disallow_paths', []) as $path) {
            $path = trim((string) $path);

            if ($path !== '') {
                $lines[] = 'Disallow: '.$path;
            }
        }

        $lines[] = '';
        $lines[] = 'Sitemap: '.$this->sitemapUrl();

        return implode("\n", $lines)."\n";
    }

    private function sitemapUrl(): string
    {
        return rtrim((string) config('app.url'), '/').'/sitemap.xml';
    }
}
