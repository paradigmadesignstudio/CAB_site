<?php

namespace App\Services\Site;

use App\Services\Cab\Blog\BlogService;
use App\Services\Cab\Events\EventsService;
use App\Services\Cab\MemberWorkshops\WorkshopService;
use App\Services\Cab\Partners\SponsorsService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class SitemapService
{
    public function __construct(
        private BlogService $blogService,
        private EventsService $eventsService,
        private SponsorsService $sponsorsService,
        private WorkshopService $workshopService,
    ) {}

    public function xml(): string
    {
        $ttl = max(0, (int) config('cab.sitemap_cache_ttl', 3600));

        if ($ttl === 0) {
            return $this->buildXml();
        }

        return Cache::remember('site.sitemap.xml', $ttl, fn (): string => $this->buildXml());
    }

    /**
     * @return array<int, array<string, string|null>>
     */
    public function entries(): array
    {
        $entries = [];
        $oficinasEnabled = (bool) config('cab.features.oficinas_enabled');

        foreach ((array) config('cab.sitemap_static_pages', []) as $page) {
            $path = (string) ($page['path'] ?? '');

            if ($path === '' || (! $oficinasEnabled && $path === '/oficinas')) {
                continue;
            }

            $entries[] = $this->entry($path, null, $page);
        }

        foreach ($this->blogService->listPostsForSitemap() as $post) {
            $entries[] = $this->entry(
                (string) $post['path'],
                isset($post['lastmod']) ? (string) $post['lastmod'] : null,
                ['changefreq' => 'weekly', 'priority' => '0.7'],
            );
        }

        foreach ($this->eventsService->list() as $event) {
            $slug = trim((string) ($event['slug'] ?? ''));

            if ($slug === '') {
                continue;
            }

            $entries[] = $this->entry(
                '/blog/eventos/'.$slug,
                null,
                ['changefreq' => 'weekly', 'priority' => '0.7'],
            );
        }

        foreach ($this->sponsorsService->list() as $partner) {
            $slug = trim((string) ($partner['slug'] ?? ''));

            if ($slug === '') {
                continue;
            }

            $entries[] = $this->entry(
                '/parceiros/'.$slug,
                null,
                ['changefreq' => 'monthly', 'priority' => '0.6'],
            );
        }

        if ($oficinasEnabled) {
            foreach ($this->workshopService->list() as $workshop) {
                $slug = trim((string) ($workshop['slug'] ?? ''));

                if ($slug === '') {
                    continue;
                }

                $entries[] = $this->entry(
                    '/oficinas/'.$slug,
                    null,
                    ['changefreq' => 'monthly', 'priority' => '0.6'],
                );
            }
        }

        return $this->deduplicateEntries($entries);
    }

    private function buildXml(): string
    {
        $lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];

        foreach ($this->entries() as $entry) {
            $lines[] = '  <url>';
            $lines[] = '    <loc>'.htmlspecialchars((string) $entry['loc'], ENT_XML1 | ENT_COMPAT, 'UTF-8').'</loc>';

            if (! empty($entry['lastmod'])) {
                $lines[] = '    <lastmod>'.htmlspecialchars((string) $entry['lastmod'], ENT_XML1 | ENT_COMPAT, 'UTF-8').'</lastmod>';
            }

            if (! empty($entry['changefreq'])) {
                $lines[] = '    <changefreq>'.htmlspecialchars((string) $entry['changefreq'], ENT_XML1 | ENT_COMPAT, 'UTF-8').'</changefreq>';
            }

            if (! empty($entry['priority'])) {
                $lines[] = '    <priority>'.htmlspecialchars((string) $entry['priority'], ENT_XML1 | ENT_COMPAT, 'UTF-8').'</priority>';
            }

            $lines[] = '  </url>';
        }

        $lines[] = '</urlset>';

        return implode("\n", $lines)."\n";
    }

    /**
     * @param  array<string, mixed>  $meta
     * @return array<string, string|null>
     */
    private function entry(string $path, ?string $lastmod, array $meta = []): array
    {
        return [
            'loc' => $this->absoluteUrl($path),
            'lastmod' => $this->normalizeLastmod($lastmod),
            'changefreq' => isset($meta['changefreq']) ? (string) $meta['changefreq'] : null,
            'priority' => isset($meta['priority']) ? (string) $meta['priority'] : null,
        ];
    }

    private function absoluteUrl(string $path): string
    {
        $base = rtrim((string) config('app.url'), '/');
        $path = '/'.ltrim($path, '/');

        if ($path === '//') {
            $path = '/';
        }

        return $base.$path;
    }

    private function normalizeLastmod(?string $value): ?string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return null;
        }

        try {
            return Carbon::parse($value)->utc()->format('Y-m-d');
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @param  array<int, array<string, string|null>>  $entries
     * @return array<int, array<string, string|null>>
     */
    private function deduplicateEntries(array $entries): array
    {
        $unique = [];

        foreach ($entries as $entry) {
            $loc = (string) ($entry['loc'] ?? '');

            if ($loc !== '') {
                $unique[$loc] = $entry;
            }
        }

        return array_values($unique);
    }
}
