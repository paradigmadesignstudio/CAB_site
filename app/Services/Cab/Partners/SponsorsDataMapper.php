<?php

namespace App\Services\Cab\Partners;

use App\Support\CabMediaUrl;
use App\Support\SafeUrl;
use Illuminate\Support\Str;

class SponsorsDataMapper
{
    /**
     * @param  array<int, array<string, mixed>>  $sponsors
     * @return array<int, array<string, mixed>>
     */
    public function mapList(array $sponsors): array
    {
        $slugCounts = [];

        $mapped = array_values(array_map(function (array $sponsor) use (&$slugCounts) {
            $baseSlug = Str::slug((string) ($sponsor['nome'] ?? 'parceiro'));
            $slugCounts[$baseSlug] = ($slugCounts[$baseSlug] ?? 0) + 1;
            $slug = $slugCounts[$baseSlug] > 1
                ? "{$baseSlug}-{$sponsor['id']}"
                : $baseSlug;

            $shortDescription = trim((string) ($sponsor['short_description'] ?? ''));
            $longDescription = trim((string) ($sponsor['long_description'] ?? ''));

            $description = $shortDescription !== ''
                ? $shortDescription
                : $this->textValue($sponsor, [
                    'descricao',
                    'descricao_curta',
                    'resumo',
                ]);

            $story = $longDescription !== ''
                ? $longDescription
                : $this->textValue($sponsor, [
                    'historia',
                    'descricao_completa',
                    'sobre',
                ]);

            $featuredRank = $this->featuredRank(
                (int) ($sponsor['id'] ?? 0),
                $slug,
                (string) ($sponsor['nome'] ?? ''),
            );

            return [
                'id' => (int) ($sponsor['id'] ?? 0),
                'slug' => $slug,
                'name' => (string) ($sponsor['nome'] ?? ''),
                'logo' => $this->resolveLogoUrl((string) ($sponsor['logo'] ?? '')),
                'logoMobile' => $this->resolveLogoMobileUrl($sponsor),
                'website' => SafeUrl::httpHttpsOnly((string) ($sponsor['url'] ?? '')),
                'shortDescription' => $shortDescription !== '' ? $this->plainText($shortDescription) : '',
                'description' => $description,
                'story' => $story,
                'fullDescription' => $story,
                'videoUrl' => SafeUrl::httpHttpsOnly((string) ($sponsor['video_url'] ?? '')),
                'role' => $featuredRank < PHP_INT_MAX ? 'sponsor' : 'partner',
            ];
        }, $sponsors));

        usort($mapped, function (array $a, array $b): int {
            $rankA = $this->featuredRank((int) $a['id'], (string) $a['slug'], (string) $a['name']);
            $rankB = $this->featuredRank((int) $b['id'], (string) $b['slug'], (string) $b['name']);

            if ($rankA !== $rankB) {
                return $rankA <=> $rankB;
            }

            return strcasecmp((string) $a['name'], (string) $b['name']);
        });

        return $mapped;
    }

    /**
     * @param  array<string, mixed>  $item
     * @param  array<int, string>  $keys
     */
    private function textValue(array $item, array $keys): string
    {
        foreach ($keys as $key) {
            if (! empty($item[$key])) {
                return trim((string) $item[$key]);
            }
        }

        return '';
    }

    private function plainText(string $html): string
    {
        $text = trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'));

        return preg_replace('/\s+/u', ' ', $text) ?? '';
    }

    private function featuredRank(int $id, string $slug, string $name): int
    {
        $order = (array) config('cab.featured_sponsor_order', []);
        $byId = array_search($id, $order, true);

        if ($byId !== false) {
            return (int) $byId;
        }

        $slug = Str::slug($slug);
        $nameSlug = Str::slug($name);

        foreach ((array) config('cab.featured_sponsor_slugs', []) as $index => $featuredSlug) {
            $featuredSlug = Str::slug((string) $featuredSlug);

            if ($featuredSlug !== '' && ($slug === $featuredSlug || $nameSlug === $featuredSlug)) {
                return (int) $index;
            }
        }

        return PHP_INT_MAX;
    }

    private function resolveLogoUrl(string $logo): string
    {
        $logo = trim($logo);

        if ($logo === '') {
            return '';
        }

        if (str_starts_with($logo, 'http://') || str_starts_with($logo, 'https://')) {
            return CabMediaUrl::proxy($this->normalizeStoredLogoUrl($logo));
        }

        $base = rtrim((string) config('cab.sponsors_media_base_url', 'https://crm.cambioautomaticodobrasil.com.br'), '/');
        $prefix = trim((string) config('cab.sponsors_media_path_prefix', 'img'), '/');
        $path = ltrim($logo, '/');

        if ($prefix !== '' && ! str_starts_with($path, $prefix.'/')) {
            $path = $prefix.'/'.$path;
        }

        return CabMediaUrl::proxy(
            str_replace('/img/patrocinadores/', '/storage/patrocinadores/', $base.'/'.$path),
        );
    }

    /**
     * @param  array<string, mixed>  $sponsor
     */
    private function resolveLogoMobileUrl(array $sponsor): ?string
    {
        foreach ([
            'logo_thumb',
            'logo_thumb_url',
            'thumb_url',
            'thumbnail_url',
            'miniatura_url',
            'url_thumb',
        ] as $key) {
            if (! empty($sponsor[$key])) {
                return $this->resolveLogoUrl((string) $sponsor[$key]);
            }
        }

        return null;
    }

    private function normalizeStoredLogoUrl(string $url): string
    {
        $base = rtrim((string) config('cab.sponsors_media_base_url', 'https://crm.cambioautomaticodobrasil.com.br'), '/');

        if (! str_starts_with($url, $base.'/')) {
            return $url;
        }

        return str_replace('/img/patrocinadores/', '/storage/patrocinadores/', $url);
    }
}
