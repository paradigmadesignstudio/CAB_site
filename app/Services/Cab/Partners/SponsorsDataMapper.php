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

            $shortDescription = $this->textValue($sponsor, [
                'short_description',
                'descricao_curta',
                'descricao',
                'resumo',
            ]);
            $longDescription = $this->textValue($sponsor, [
                'long_description',
                'descricao_longa',
                'historia',
                'descricao_completa',
                'sobre',
            ]);

            $description = $shortDescription;
            $story = $longDescription;

            $featuredRank = $this->featuredRank(
                (int) ($sponsor['id'] ?? 0),
                $slug,
                (string) ($sponsor['nome'] ?? ''),
            );

            $place = $this->mapPlace($sponsor);
            $phone = $this->textValue($sponsor, ['telefone', 'phone']);
            $whatsapp = $this->textValue($sponsor, ['whatsapp']);
            $highlights = $this->stringList($sponsor['diferenciais'] ?? $sponsor['highlights'] ?? []);
            $logo = $this->textValue($sponsor, ['logo_url', 'logo']);

            return [
                'id' => (int) ($sponsor['id'] ?? 0),
                'slug' => $slug,
                'name' => (string) ($sponsor['nome'] ?? ''),
                'logo' => $this->resolveLogoUrl($logo),
                'logoMobile' => $this->resolveLogoMobileUrl($sponsor),
                'website' => SafeUrl::httpHttpsOnly($this->textValue($sponsor, ['site', 'url'])),
                'shortDescription' => $shortDescription !== '' ? $this->plainText($shortDescription) : '',
                'description' => $this->plainText($description),
                'story' => $story,
                'fullDescription' => $story,
                'videoUrl' => SafeUrl::httpHttpsOnly((string) ($sponsor['video_url'] ?? '')),
                'role' => $featuredRank < PHP_INT_MAX ? 'sponsor' : 'partner',
                'category' => $this->textValue($sponsor, ['categoria', 'category']),
                'address' => $place['address'],
                'city' => $place['city'],
                'state' => $place['state'],
                'phone' => $phone,
                'whatsapp' => $whatsapp,
                'email' => $this->emailValue($sponsor),
                'highlights' => $highlights,
                'coordinates' => $place['coordinates'] ?? $this->mapCoordinates($sponsor),
                'socials' => $this->mapSocials($sponsor),
                'gallery' => $this->mapGallery($sponsor),
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

    /**
     * @param  mixed  $value
     * @return array<int, string>
     */
    private function stringList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $items = [];

        foreach ($value as $item) {
            if (is_string($item) && trim($item) !== '') {
                $items[] = trim($item);
            } elseif (is_array($item)) {
                $label = trim((string) ($item['nome'] ?? $item['label'] ?? $item['titulo'] ?? ''));

                if ($label !== '') {
                    $items[] = $label;
                }
            }
        }

        return array_values($items);
    }

    /**
     * @param  array<string, mixed>  $sponsor
     * @return array{lat: float, lng: float}|null
     */
    /**
     * @param  array<string, mixed>  $sponsor
     * @return array{address: string, city: string, state: string, coordinates: array{lat: float, lng: float}|null}
     */
    private function mapPlace(array $sponsor): array
    {
        $endereco = $sponsor['endereco'] ?? null;

        if (is_array($endereco)) {
            $street = trim(implode(', ', array_filter([
                trim((string) ($endereco['logradouro'] ?? '')),
                trim((string) ($endereco['numero'] ?? '')),
            ], fn (string $part): bool => $part !== '')));
            $extra = trim(implode(' - ', array_filter([
                trim((string) ($endereco['complemento'] ?? '')),
                trim((string) ($endereco['bairro'] ?? '')),
            ], fn (string $part): bool => $part !== '')));
            $address = trim(implode(' - ', array_filter([$street, $extra], fn (string $part): bool => $part !== '')));

            return [
                'address' => $address,
                'city' => trim((string) ($endereco['cidade'] ?? '')),
                'state' => trim((string) ($endereco['uf'] ?? $endereco['estado'] ?? '')),
                'coordinates' => $this->coordinatesFrom($endereco['latitude'] ?? null, $endereco['longitude'] ?? null),
            ];
        }

        return [
            'address' => $this->textValue($sponsor, ['endereco_completo', 'address']),
            'city' => $this->textValue($sponsor, ['cidade', 'city']),
            'state' => $this->textValue($sponsor, ['estado', 'uf', 'state']),
            'coordinates' => null,
        ];
    }

    /**
     * @param  array<string, mixed>  $sponsor
     * @return array<int, array{label: string, url: string}>
     */
    private function mapSocials(array $sponsor): array
    {
        $source = is_array($sponsor['redes_sociais'] ?? null) ? $sponsor['redes_sociais'] : [];
        $labels = [
            'instagram' => 'Instagram',
            'facebook' => 'Facebook',
            'linkedin' => 'LinkedIn',
            'tiktok' => 'TikTok',
            'youtube' => 'YouTube',
        ];
        $links = [];

        foreach ($labels as $key => $label) {
            $url = SafeUrl::httpHttpsOnly(trim((string) ($source[$key] ?? '')));

            if ($url !== '') {
                $links[] = ['label' => $label, 'url' => $url];
            }
        }

        return $links;
    }

    /**
     * @param  array<string, mixed>  $sponsor
     * @return array<int, string>
     */
    private function mapGallery(array $sponsor): array
    {
        $gallery = $sponsor['galeria'] ?? [];

        if (! is_array($gallery)) {
            return [];
        }

        $urls = [];

        foreach ($gallery as $item) {
            $raw = '';

            if (is_string($item)) {
                $raw = $item;
            } elseif (is_array($item)) {
                $raw = $this->textValue($item, ['url', 'imagem', 'src', 'logo_url']);
            }

            $url = $this->resolveLogoUrl($raw);

            if ($url !== '') {
                $urls[] = $url;
            }
        }

        return $urls;
    }

    private function emailValue(array $sponsor): string
    {
        $email = trim((string) ($sponsor['email'] ?? ''));

        return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : '';
    }

    private function mapCoordinates(array $sponsor): ?array
    {
        $lat = $sponsor['latitude'] ?? $sponsor['lat'] ?? null;
        $lng = $sponsor['longitude'] ?? $sponsor['lng'] ?? $sponsor['lon'] ?? null;

        if (is_array($sponsor['coordenadas'] ?? null)) {
            $lat = $lat ?? ($sponsor['coordenadas']['lat'] ?? $sponsor['coordenadas']['latitude'] ?? null);
            $lng = $lng ?? ($sponsor['coordenadas']['lng'] ?? $sponsor['coordenadas']['longitude'] ?? null);
        }

        return $this->coordinatesFrom($lat, $lng);
    }

    private function coordinatesFrom(mixed $lat, mixed $lng): ?array
    {
        if (! is_numeric($lat) || ! is_numeric($lng)) {
            return null;
        }

        if ((float) $lat === 0.0 && (float) $lng === 0.0) {
            return null;
        }

        return [
            'lat' => (float) $lat,
            'lng' => (float) $lng,
        ];
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
