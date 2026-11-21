<?php

namespace App\Services\Cab\MemberWorkshops;

use App\Support\CabMediaUrl;
use App\Support\SafeUrl;

class HotsitesDataMapper
{
    /**
     * @param  array<int, array<string, mixed>>  $hotsites
     * @return array<int, array<string, mixed>>
     */
    public function mapList(array $hotsites): array
    {
        $mapped = array_values(array_map(
            fn (array $hotsite): array => $this->mapCard($hotsite),
            $hotsites,
        ));

        usort(
            $mapped,
            fn (array $a, array $b): int => strcasecmp((string) $a['name'], (string) $b['name']),
        );

        return $mapped;
    }

    /**
     * @param  array<string, mixed>  $hotsite
     * @return array<string, mixed>
     */
    public function mapCard(array $hotsite): array
    {
        $city = trim((string) ($hotsite['cidade'] ?? ''));
        $state = $this->normalizeState((string) ($hotsite['estado'] ?? ''));
        $description = $this->plainText($this->descriptionText($hotsite));
        $slug = trim((string) ($hotsite['slug'] ?? ''));

        if ($slug === '' && isset($hotsite['id'])) {
            $slug = 'oficina-'.$hotsite['id'];
        }

        return $this->sanitizeWorkshop([
            'id' => (int) ($hotsite['id'] ?? 0),
            'slug' => $slug,
            'name' => trim((string) ($hotsite['nome'] ?? '')),
            'description' => $description,
            'fullDescription' => $description,
            'category' => $this->resolveCategory($hotsite),
            'logo' => $this->resolveMediaUrl((string) ($hotsite['logo_url'] ?? '')),
            'coverImage' => $this->resolveCoverImage($hotsite),
            'coverImageMobile' => $this->resolveCoverImageMobile($hotsite),
            'website' => SafeUrl::httpHttpsOnly((string) ($hotsite['site_externo'] ?? '')),
            'address' => trim((string) ($hotsite['endereco_completo'] ?? '')),
            'city' => $city,
            'state' => $state,
            'phone' => $this->normalizePhone((string) ($hotsite['telefone'] ?? '')),
            'whatsapp' => $this->normalizePhone((string) ($hotsite['whatsapp'] ?? '')),
            'specialties' => $this->mapCommodityNames($hotsite['commodities'] ?? []),
            'coordinates' => $this->mapCoordinates($hotsite),
            'hours' => $this->formatHours((string) ($hotsite['horario_funcionamento'] ?? '')),
        ]);
    }

    /**
     * @param  array<string, mixed>  $hotsite
     * @return array<string, mixed>
     */
    public function mapDetail(array $hotsite): array
    {
        $card = $this->mapCard($hotsite);
        $fullDescription = $this->plainText(trim((string) ($hotsite['descricao_completa'] ?? '')));

        if ($fullDescription === '') {
            $fullDescription = (string) $card['description'];
        }

        $specialties = array_values(array_unique(array_merge(
            (array) $card['specialties'],
            $this->mapCommodityNames($hotsite['servicos_cliente'] ?? []),
        )));

        return $this->sanitizeWorkshop([
            ...$card,
            'fullDescription' => $fullDescription,
            'specialties' => $specialties,
            'address' => trim((string) ($hotsite['endereco_completo'] ?? $card['address'])),
            'galleryImages' => $this->mapGalleryImages(
                is_array($hotsite['fotos'] ?? null) ? $hotsite['fotos'] : [],
                (string) ($hotsite['banner_url'] ?? ''),
            ),
        ]);
    }

    /**
     * @param  array<int, mixed>  $photos
     * @return list<array{full: string, thumb: string}>
     */
    private function mapGalleryImages(array $photos, string $bannerUrl = ''): array
    {
        $normalized = [];

        foreach ($photos as $photo) {
            if (is_array($photo)) {
                $normalized[] = $photo;
            }
        }

        usort(
            $normalized,
            fn (array $a, array $b): int => ((int) ($a['ordem'] ?? 0)) <=> ((int) ($b['ordem'] ?? 0)),
        );

        $bannerNormalized = $this->normalizeImageUrl($this->resolveMediaUrl($bannerUrl));
        $images = [];

        foreach ($normalized as $photo) {
            $fullUrl = $this->resolveMediaUrl((string) ($photo['url'] ?? ''));

            if ($fullUrl === '') {
                continue;
            }

            if ($bannerNormalized !== '' && $this->normalizeImageUrl($fullUrl) === $bannerNormalized) {
                continue;
            }

            $images[] = [
                'full' => $fullUrl,
                'thumb' => $this->resolveGalleryThumbUrl($photo, $fullUrl),
            ];
        }

        return $images;
    }

    /**
     * @param  array<string, mixed>  $photo
     */
    private function resolveGalleryThumbUrl(array $photo, string $fullUrl): string
    {
        foreach (['thumb_url', 'thumbnail_url', 'url_thumb', 'miniatura_url'] as $key) {
            $candidate = $this->resolveMediaUrl((string) ($photo[$key] ?? ''));

            if ($candidate !== '') {
                return $candidate;
            }
        }

        return $fullUrl;
    }

    private function normalizeImageUrl(string $url): string
    {
        $url = trim($url);

        if ($url === '') {
            return '';
        }

        if (str_starts_with($url, 'http://')) {
            $url = 'https://'.substr($url, 7);
        }

        return rtrim($url, '/');
    }

    /**
     * @param  array<string, mixed>  $hotsite
     */
    private function resolveCategory(array $hotsite): string
    {
        $commodities = $this->mapCommodityNames($hotsite['commodities'] ?? []);

        if ($commodities !== []) {
            return $commodities[0];
        }

        return 'Assinante CAB';
    }

    /**
     * @param  array<string, mixed>  $hotsite
     */
    private function resolveCoverImage(array $hotsite): string
    {
        $banner = $this->resolveMediaUrl((string) ($hotsite['banner_url'] ?? ''));

        if ($banner !== '') {
            return $banner;
        }

        $photos = $hotsite['fotos'] ?? [];

        if (is_array($photos) && isset($photos[0]) && is_array($photos[0])) {
            return $this->resolveMediaUrl((string) ($photos[0]['url'] ?? ''));
        }

        return $this->resolveMediaUrl((string) ($hotsite['logo_url'] ?? ''));
    }

    /**
     * @param  array<string, mixed>  $hotsite
     */
    private function resolveCoverImageMobile(array $hotsite): ?string
    {
        foreach ([
            'banner_thumb_url',
            'banner_thumbnail_url',
            'thumb_url',
            'thumbnail_url',
            'miniatura_url',
            'url_thumb',
        ] as $key) {
            if (! empty($hotsite[$key])) {
                return $this->resolveMediaUrl((string) $hotsite[$key]);
            }
        }

        $photos = $hotsite['fotos'] ?? [];

        if (is_array($photos) && isset($photos[0]) && is_array($photos[0])) {
            foreach (['thumb_url', 'thumbnail_url', 'url_thumb', 'miniatura_url'] as $key) {
                if (! empty($photos[0][$key])) {
                    return $this->resolveMediaUrl((string) $photos[0][$key]);
                }
            }
        }

        return null;
    }

    /**
     * @param  mixed  $commodities
     * @return list<string>
     */
    private function mapCommodityNames(mixed $commodities): array
    {
        if (! is_array($commodities)) {
            return [];
        }

        $names = [];

        foreach ($commodities as $commodity) {
            if (! is_array($commodity)) {
                continue;
            }

            $name = trim((string) ($commodity['nome'] ?? ''));

            if ($name !== '') {
                $names[] = $name;
            }
        }

        return array_values(array_unique($names));
    }

    /**
     * @param  array<string, mixed>  $hotsite
     * @return array{lat: float, lng: float}|null
     */
    private function mapCoordinates(array $hotsite): ?array
    {
        $lat = $hotsite['latitude'] ?? null;
        $lng = $hotsite['longitude'] ?? null;

        if (! is_numeric($lat) || ! is_numeric($lng)) {
            return null;
        }

        return [
            'lat' => (float) $lat,
            'lng' => (float) $lng,
        ];
    }

    /**
     * @param  array<string, mixed>  $hotsite
     */
    private function descriptionText(array $hotsite): string
    {
        foreach (['descricao_curta', 'descricao_completa', 'palavras_chave'] as $key) {
            $value = trim((string) ($hotsite[$key] ?? ''));

            if ($value !== '') {
                return $value;
            }
        }

        return '';
    }

    private function formatHours(string $raw): string
    {
        $raw = trim($raw);

        if ($raw === '') {
            return '';
        }

        $decoded = json_decode($raw, true);

        if (! is_array($decoded)) {
            return $this->plainText($raw);
        }

        $segments = [];

        foreach ($decoded as $entry) {
            if (! is_array($entry)) {
                continue;
            }

            $day = trim((string) ($entry['dia'] ?? ''));
            $open = (bool) ($entry['aberto'] ?? false);
            $opensAt = trim((string) ($entry['abertura'] ?? ''));
            $closesAt = trim((string) ($entry['fechamento'] ?? ''));

            if ($day === '') {
                continue;
            }

            if (! $open) {
                $segments[] = "{$day}: fechado";

                continue;
            }

            if ($opensAt !== '' && $closesAt !== '') {
                $segments[] = "{$day}: {$opensAt}–{$closesAt}";
            }
        }

        return implode(' | ', $segments);
    }

    private function normalizeState(string $state): string
    {
        $state = strtoupper(trim($state));

        if ($state === 'UNDEFINED') {
            return '';
        }

        return $state;
    }

    private function normalizePhone(string $phone): string
    {
        return trim($phone);
    }

    private function resolveMediaUrl(string $url): string
    {
        $url = trim($url);

        if ($url === '') {
            return '';
        }

        if (str_starts_with($url, 'http://')) {
            $url = 'https://'.substr($url, 7);
        }

        return CabMediaUrl::proxy($url);
    }

    private function plainText(string $html): string
    {
        $text = trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'));

        return preg_replace('/\s+/u', ' ', $text) ?? '';
    }

    /**
     * @param  array<string, mixed>  $workshop
     * @return array<string, mixed>
     */
    private function sanitizeWorkshop(array $workshop): array
    {
        if (array_key_exists('website', $workshop)) {
            $workshop['website'] = SafeUrl::httpHttpsOnly((string) $workshop['website']);
        }

        if (($workshop['coordinates'] ?? null) === null) {
            unset($workshop['coordinates']);
        }

        return $workshop;
    }
}
