<?php

namespace App\Services\Cab\MemberWorkshops;

use App\Services\Cab\CabApiClient;
use App\Support\SafeUrl;

class WorkshopService
{
    /** @var array<int, array<string, mixed>>|null */
    private ?array $listCache = null;

    /** @var array<string, array<string, mixed>> */
    private array $slugIndex = [];

    public function __construct(
        private CabApiClient $client,
        private HotsitesDataMapper $mapper,
    ) {}

    public function isConfigured(): bool
    {
        return (bool) config('cab.enabled')
            && trim((string) config('cab.endpoints.hotsites')) !== '';
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function list(): array
    {
        if ($this->listCache !== null) {
            return $this->listCache;
        }

        if (! $this->isConfigured()) {
            $this->listCache = [];

            return $this->listCache;
        }

        $hotsites = $this->client->getAbsolute(rtrim((string) config('cab.endpoints.hotsites'), '/'));

        if ($hotsites === []) {
            $this->listCache = [];

            return $this->listCache;
        }

        $this->listCache = $this->mapper->mapList($hotsites);
        $this->buildSlugIndex($this->listCache);

        return $this->listCache;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findBySlug(string $slug): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $detail = $this->findFromApi($slug);

        if ($detail !== null) {
            return $detail;
        }

        $this->list();

        return $this->slugIndex[$slug] ?? null;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function findFromApi(string $idOrSlug): ?array
    {
        $base = rtrim((string) config('cab.endpoints.hotsites'), '/');
        $hotsite = $this->client->getAbsoluteOne($base.'/'.rawurlencode($idOrSlug));

        if ($hotsite === null) {
            return null;
        }

        return $this->sanitizeWorkshop($this->mapper->mapDetail($hotsite));
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

        if (array_key_exists('mapEmbedUrl', $workshop)) {
            $workshop['mapEmbedUrl'] = SafeUrl::httpHttpsOnly((string) $workshop['mapEmbedUrl']);
        }

        return $workshop;
    }

    /**
     * @param  array<int, array<string, mixed>>  $workshops
     */
    private function buildSlugIndex(array $workshops): void
    {
        foreach ($workshops as $workshop) {
            $slug = (string) ($workshop['slug'] ?? '');

            if ($slug !== '') {
                $this->slugIndex[$slug] = $workshop;
            }
        }
    }
}
