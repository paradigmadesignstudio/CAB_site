<?php

namespace App\Services\Cab\Events;

use App\Services\Cab\CabApiClient;

class EventsService
{
    /** @var array<int, array<string, mixed>>|null */
    private ?array $listCache = null;

    public function __construct(
        private CabApiClient $client,
        private EventsDataMapper $mapper,
    ) {}

    public function isConfigured(): bool
    {
        return (bool) config('cab.enabled')
            && (string) config('cab.endpoints.events') !== '';
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function list(?string $modalidade = null, ?string $uf = null): array
    {
        if (! $this->isConfigured()) {
            return [];
        }

        if ($modalidade === null && $uf === null && $this->listCache !== null) {
            return $this->listCache;
        }

        $events = $this->client->getAbsolute($this->buildListUrl($modalidade, $uf));

        if ($events === []) {
            return [];
        }

        $mapped = $this->mapper->mapList($events);

        if ($modalidade === null && $uf === null) {
            $this->listCache = $mapped;
        }

        return $mapped;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function find(string $idOrSlug): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $base = rtrim((string) config('cab.endpoints.events'), '/');
        $event = $this->client->getAbsoluteOne($base.'/'.rawurlencode($idOrSlug));

        if ($event === null) {
            return null;
        }

        return $this->mapper->mapDetail($event);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listEnded(int $limit = 0): array
    {
        $events = array_values(array_filter(
            $this->list(),
            fn (array $event) => ($event['status'] ?? '') === 'ended',
        ));

        $events = array_reverse($events);

        if ($limit > 0) {
            $events = array_slice($events, 0, $limit);
        }

        return $events;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listUpcoming(int $limit = 0): array
    {
        $events = array_values(array_filter(
            $this->list(),
            fn (array $event) => in_array($event['status'] ?? '', ['upcoming', 'happening'], true),
        ));

        if ($limit > 0) {
            $events = array_slice($events, 0, $limit);
        }

        return $events;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listForHome(int $limit = 5): array
    {
        $upcoming = $this->listUpcoming();
        $ended = $this->listEnded();

        if ($upcoming === []) {
            return array_slice($ended, 0, $limit);
        }

        if ($ended === []) {
            return array_slice($upcoming, 0, $limit);
        }

        $pastSlots = min(count($ended), max(1, intdiv($limit, 2)));
        $upcomingSlots = min(count($upcoming), $limit - $pastSlots);
        $pastSlots = min(count($ended), $limit - $upcomingSlots);

        return array_merge(
            array_slice($upcoming, 0, $upcomingSlots),
            array_slice($ended, 0, $pastSlots),
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listRelated(string $slug, int $limit = 3): array
    {
        $related = array_values(array_filter(
            $this->list(),
            fn (array $event) => ($event['slug'] ?? '') !== $slug,
        ));

        return array_slice($related, 0, $limit);
    }

    private function buildListUrl(?string $modalidade, ?string $uf): string
    {
        $base = rtrim((string) config('cab.endpoints.events'), '/');
        $query = [];

        $modalidade = strtolower(trim((string) $modalidade));

        if (in_array($modalidade, ['online', 'presencial', 'hibrido'], true)) {
            $query['modalidade'] = $modalidade;
        }

        $uf = strtoupper(trim((string) $uf));

        if (strlen($uf) === 2) {
            $query['uf'] = $uf;
        }

        if ($query === []) {
            return $base;
        }

        return $base.'?'.http_build_query($query);
    }
}
