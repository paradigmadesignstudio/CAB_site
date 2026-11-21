<?php

namespace App\Services\Cab\Events;

use App\Support\CabMediaUrl;
use Carbon\Carbon;
use Illuminate\Support\Str;

class EventsDataMapper
{
    /**
     * @param  array<int, array<string, mixed>>  $events
     * @return array<int, array<string, mixed>>
     */
    public function mapList(array $events): array
    {
        $mapped = array_values(array_map(
            fn (array $event) => $this->mapCard($event),
            $events,
        ));

        usort(
            $mapped,
            fn (array $a, array $b) => ($a['sortTimestamp'] ?? 0) <=> ($b['sortTimestamp'] ?? 0),
        );

        return array_map(function (array $event) {
            unset($event['sortTimestamp']);

            return $event;
        }, $mapped);
    }

    /**
     * @param  array<string, mixed>  $event
     * @return array<string, mixed>
     */
    public function mapCard(array $event): array
    {
        $start = $this->parseDateTime((string) ($event['data_hora_inicio'] ?? ''));
        $end = $this->parseDateTime((string) ($event['data_hora_fim'] ?? ''));
        $slug = (string) ($event['slug'] ?? '');
        $status = $this->resolveStatus($start, $end, (string) ($event['fuso_horario'] ?? 'America/Sao_Paulo'));

        return [
            'id' => (int) ($event['id'] ?? 0),
            'slug' => $slug,
            'title' => (string) ($event['titulo'] ?? ''),
            'excerpt' => (string) ($event['resumo'] ?? ''),
            'date' => $this->formatDateRange($start, $end),
            'time' => $this->formatTimeRange($start, $end),
            'location' => $this->formatLocation($event),
            'status' => $status,
            'image' => $this->resolveBannerUrl((string) ($event['banner_url'] ?? '')),
            'imageMobile' => $this->resolveBannerThumbUrl($event),
            'link' => $slug !== '' ? '/blog/eventos/'.$slug : '/blog/eventos',
            'modalidade' => (string) ($event['modalidade'] ?? ''),
            'uf' => (string) ($event['uf'] ?? ''),
            'priceLabel' => '',
            'sortTimestamp' => $start?->timestamp ?? 0,
        ];
    }

    /**
     * @param  array<string, mixed>  $event
     * @return array<string, mixed>
     */
    public function mapDetail(array $event): array
    {
        $card = $this->mapCard($event);
        $start = $this->parseDateTime((string) ($event['data_hora_inicio'] ?? ''));
        $end = $this->parseDateTime((string) ($event['data_hora_fim'] ?? ''));
        $latitude = $event['latitude'] ?? null;
        $longitude = $event['longitude'] ?? null;
        $venueName = trim((string) ($event['local_evento'] ?? ''));

        if ($venueName === '') {
            $venueName = trim((string) ($event['cidade'] ?? 'Local a confirmar'));
        }

        $city = trim((string) ($event['cidade'] ?? ''));
        $state = trim((string) ($event['uf'] ?? ''));
        $address = $venueName;

        return array_merge($card, [
            'description' => $this->splitDescription((string) ($event['descricao'] ?? ''))
                ?: array_values(array_filter([(string) ($event['resumo'] ?? '')])),
            'venue' => [
                'name' => $venueName,
                'address' => $address,
                'city' => $city,
                'state' => $state,
                'coordinates' => is_numeric($latitude) && is_numeric($longitude)
                    ? ['lat' => (float) $latitude, 'lng' => (float) $longitude]
                    : null,
            ],
            'schedule' => [],
            'ticketUrl' => $this->resolveTicketUrl($event),
            'organizer' => 'Câmbio Automático do Brasil (CAB)',
            'tags' => $this->buildTags($event),
            'highlights' => $this->buildHighlights($event),
            'galleryImages' => $this->mapGalleryImages(
                $event['fotos'] ?? [],
                (string) ($event['banner_url'] ?? ''),
            ),
            'formasPagamento' => is_array($event['formas_pagamento'] ?? null)
                ? array_values($event['formas_pagamento'])
                : [],
            'parcelamento' => isset($event['parcelamento']) ? (int) $event['parcelamento'] : null,
            'capacidadeTotal' => isset($event['capacidade_total']) ? (int) $event['capacidade_total'] : null,
            'inscricoesAbertasEm' => (string) ($event['data_abertura_inscricoes'] ?? ''),
            'inscricoesEncerramEm' => (string) ($event['data_encerramento_inscricoes'] ?? ''),
        ]);
    }

    /**
     * @param  array<string, mixed>  $event
     * @return array<string, mixed>
     */
    public function mapFeaturedCard(array $event): array
    {
        $card = $this->mapCard($event);

        return [
            'id' => $card['id'],
            'title' => $card['title'],
            'excerpt' => $card['excerpt'],
            'category' => 'Eventos',
            'author' => 'CAB',
            'authorInitials' => 'CAB',
            'date' => $card['date'],
            'readTime' => '',
            'image' => $card['image'],
            'link' => $card['link'],
        ];
    }

    private function parseDateTime(string $value): ?Carbon
    {
        $value = trim($value);

        if ($value === '') {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (\Throwable) {
            return null;
        }
    }

    private function formatDateRange(?Carbon $start, ?Carbon $end): string
    {
        if ($start === null) {
            return 'Data a confirmar';
        }

        $start = $start->locale('pt_BR');
        $end = $end?->locale('pt_BR');

        if ($end === null || $start->isSameDay($end)) {
            return $start->translatedFormat('j \d\e F \d\e Y');
        }

        if ($start->isSameMonth($end) && $start->isSameYear($end)) {
            return sprintf(
                '%s a %s de %s',
                $start->format('j'),
                $end->format('j'),
                $start->translatedFormat('F \d\e Y'),
            );
        }

        if ($start->isSameYear($end)) {
            return sprintf(
                '%s a %s',
                $start->translatedFormat('j \d\e F'),
                $end->translatedFormat('j \d\e F \d\e Y'),
            );
        }

        return sprintf(
            '%s a %s',
            $start->translatedFormat('j \d\e F \d\e Y'),
            $end->translatedFormat('j \d\e F \d\e Y'),
        );
    }

    private function formatTimeRange(?Carbon $start, ?Carbon $end): string
    {
        if ($start === null) {
            return 'Horário a confirmar';
        }

        $startLabel = $start->format('H\hi');

        if ($end === null || $start->equalTo($end)) {
            return $startLabel;
        }

        return $startLabel.' às '.$end->format('H\hi');
    }

    /**
     * @param  array<string, mixed>  $event
     */
    private function formatLocation(array $event): string
    {
        $city = trim((string) ($event['cidade'] ?? ''));
        $state = trim((string) ($event['uf'] ?? ''));
        $modalidade = strtolower(trim((string) ($event['modalidade'] ?? '')));

        if ($modalidade === 'online') {
            return 'Online';
        }

        if ($city !== '' && $state !== '') {
            return $city.', '.$state;
        }

        if ($city !== '') {
            return $city;
        }

        return 'Local a confirmar';
    }

    private function resolveStatus(?Carbon $start, ?Carbon $end, string $timezone): string
    {
        if ($start === null) {
            return 'upcoming';
        }

        try {
            $now = Carbon::now($timezone !== '' ? $timezone : 'America/Sao_Paulo');
        } catch (\Throwable) {
            $now = Carbon::now('America/Sao_Paulo');
        }

        $startAt = $start->copy()->timezone($now->timezone);
        $endAt = ($end ?? $start)->copy()->timezone($now->timezone);

        if ($now->greaterThan($endAt)) {
            return 'ended';
        }

        if ($now->greaterThanOrEqualTo($startAt) && $now->lessThanOrEqualTo($endAt)) {
            return 'happening';
        }

        return 'upcoming';
    }

    private function resolveBannerUrl(string $url): string
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

    /**
     * @param  array<string, mixed>  $event
     */
    private function resolveBannerThumbUrl(array $event): ?string
    {
        foreach ([
            'thumb_url',
            'thumbnail_url',
            'banner_thumb_url',
            'banner_thumbnail_url',
            'miniatura_url',
            'url_thumb',
        ] as $key) {
            if (! empty($event[$key])) {
                return $this->resolveBannerUrl((string) $event[$key]);
            }
        }

        return null;
    }

    /**
     * @return array<int, string>
     */
    private function splitDescription(string $description): array
    {
        $description = trim($description);

        if ($description === '') {
            return [];
        }

        $paragraphs = preg_split("/\R{2,}/", $description) ?: [];

        $paragraphs = array_values(array_filter(
            array_map('trim', $paragraphs),
            fn (string $paragraph) => $paragraph !== '',
        ));

        if ($paragraphs !== []) {
            return $paragraphs;
        }

        return [$description];
    }

    /**
     * @param  array<string, mixed>  $event
     * @return array<int, string>
     */
    private function buildTags(array $event): array
    {
        $tags = [];

        $modalidade = trim((string) ($event['modalidade'] ?? ''));

        if ($modalidade !== '') {
            $tags[] = Str::title($modalidade);
        }

        $state = trim((string) ($event['uf'] ?? ''));

        if ($state !== '') {
            $tags[] = $state;
        }

        return $tags;
    }

    /**
     * @param  array<string, mixed>  $event
     * @return array<int, string>
     */
    private function buildHighlights(array $event): array
    {
        $highlights = [];

        $paymentMethods = is_array($event['formas_pagamento'] ?? null)
            ? array_values($event['formas_pagamento'])
            : [];

        if ($paymentMethods !== []) {
            $labels = array_map(fn (string $method) => $this->paymentMethodLabel($method), $paymentMethods);
            $highlights[] = 'Pagamento: '.implode(', ', $labels);
        }

        $parcelamento = (int) ($event['parcelamento'] ?? 0);

        if ($parcelamento > 1) {
            $highlights[] = 'Parcelamento em até '.$parcelamento.'x';
        }

        $capacidade = (int) ($event['capacidade_total'] ?? 0);

        if ($capacidade > 0) {
            $highlights[] = 'Capacidade para '.$capacidade.' participantes';
        }

        return $highlights;
    }

    private function paymentMethodLabel(string $method): string
    {
        return match (strtolower(trim($method))) {
            'pix' => 'PIX',
            'cartao' => 'cartão',
            'boleto' => 'boleto',
            'dinheiro' => 'dinheiro',
            default => $method,
        };
    }

    /**
     * @param  array<int, array<string, mixed>>  $photos
     * @return array<int, array{full: string, thumb: string}>
     */
    private function mapGalleryImages(array $photos, string $bannerUrl = ''): array
    {
        usort($photos, fn (array $a, array $b) => ($a['ordem'] ?? 0) <=> ($b['ordem'] ?? 0));

        $bannerUrl = $this->normalizeImageUrl($this->resolveBannerUrl($bannerUrl));
        $images = [];

        foreach ($photos as $photo) {
            $fullUrl = $this->resolveBannerUrl((string) ($photo['url'] ?? ''));

            if ($fullUrl === '') {
                continue;
            }

            if ($bannerUrl !== '' && $this->normalizeImageUrl($fullUrl) === $bannerUrl) {
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
     * Usa thumb da API quando disponível; caso contrário, reutiliza a URL full.
     *
     * @param  array<string, mixed>  $photo
     */
    private function resolveGalleryThumbUrl(array $photo, string $fullUrl): string
    {
        foreach (['thumb_url', 'thumbnail_url', 'url_thumb', 'miniatura_url'] as $key) {
            $candidate = $this->resolveBannerUrl((string) ($photo[$key] ?? ''));

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
     * @param  array<string, mixed>  $event
     */
    private function resolveTicketUrl(array $event): string
    {
        foreach ([
            'url_inscricao',
            'url_compra',
            'link_inscricao',
            'link_compra',
            'url_lp',
            'link_lp',
            'url_venda',
        ] as $key) {
            $url = trim((string) ($event[$key] ?? ''));

            if ($url !== '') {
                return $url;
            }
        }

        $slug = trim((string) ($event['slug'] ?? ''));
        $lpSlug = $this->resolveLpSlug($event);
        $id = trim((string) ($event['id'] ?? ''));
        $configured = trim((string) config('cab.events_ticket_url', ''));

        if ($configured !== '') {
            return str_replace(
                ['{slug}', '{lp_slug}', '{id}'],
                [$slug, $lpSlug, $id],
                $configured,
            );
        }

        if ($lpSlug !== '') {
            return 'https://lp.cambioautomaticodobrasil.com.br/'.$lpSlug;
        }

        return '';
    }

    /**
     * @param  array<string, mixed>  $event
     */
    private function resolveLpSlug(array $event): string
    {
        foreach (['lp_slug', 'slug_lp', 'slug_landing'] as $key) {
            $value = trim((string) ($event[$key] ?? ''));

            if ($value !== '') {
                return $value;
            }
        }

        $slug = trim((string) ($event['slug'] ?? ''));

        if ($slug === '') {
            return '';
        }

        $overrides = config('cab.events_ticket_slug_overrides', []);

        if (is_array($overrides) && isset($overrides[$slug])) {
            return (string) $overrides[$slug];
        }

        return $slug;
    }

}
