<?php

namespace App\Services\Cab\Partners;

use App\Services\Cab\CabApiClient;

class SponsorsService
{
    /** @var array<int, array<string, mixed>>|null */
    private ?array $listCache = null;

    /** @var array<string, array<string, mixed>> */
    private array $slugIndex = [];

    public function __construct(
        private CabApiClient $client,
        private SponsorsDataMapper $mapper,
    ) {}

    public function isEnabled(): bool
    {
        return (bool) config('cab.enabled')
            && (string) config('cab.endpoints.sponsors') !== '';
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function list(): array
    {
        if ($this->listCache !== null) {
            return $this->listCache;
        }

        if (! $this->isEnabled()) {
            $this->listCache = [];

            return $this->listCache;
        }

        $sponsors = $this->client->getAbsolute((string) config('cab.endpoints.sponsors'));

        if ($sponsors === []) {
            $this->listCache = [];

            return $this->listCache;
        }

        $this->listCache = $this->mapper->mapList($sponsors);
        $this->buildSlugIndex($this->listCache);

        return $this->listCache;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findBySlug(string $slug): ?array
    {
        if (! $this->isEnabled()) {
            return null;
        }

        $this->list();

        return $this->slugIndex[$slug] ?? null;
    }

    /**
     * @param  array<int, array<string, mixed>>  $sponsors
     */
    private function buildSlugIndex(array $sponsors): void
    {
        foreach ($sponsors as $sponsor) {
            $slug = (string) ($sponsor['slug'] ?? '');

            if ($slug !== '') {
                $this->slugIndex[$slug] = $sponsor;
            }
        }
    }
}
