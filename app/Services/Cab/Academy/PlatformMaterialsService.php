<?php

namespace App\Services\Cab\Academy;

use App\Services\Cab\CabApiClient;

class PlatformMaterialsService
{
    /** @var array<int, array<string, mixed>>|null */
    private ?array $categoriesCache = null;

    public function __construct(
        private CabApiClient $client,
        private PlatformMaterialsDataMapper $mapper,
    ) {}

    public function isConfigured(): bool
    {
        return (bool) config('cab.enabled')
            && (string) config('cab.endpoints.platform_materials') !== '';
    }

    /**
     * @return array{meta: array<string, int>, featured: array<int, array<string, mixed>>, categories: array<int, array<string, mixed>>}|null
     */
    public function getSectionPayload(): ?array
    {
        $categories = $this->getCategories();

        if ($categories === []) {
            return null;
        }

        $allMaterials = $this->mapper->flattenMaterials($categories);
        $featuredLimit = max(1, (int) config('cab.academy_platform_materials_featured_count', 6));

        return [
            'meta' => [
                'totalCount' => count($allMaterials),
                'categoryCount' => count($categories),
            ],
            'featured' => $this->mapper->pickFeatured($categories, $featuredLimit),
            'categories' => $categories,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getCategories(): array
    {
        if ($this->categoriesCache !== null) {
            return $this->categoriesCache;
        }

        if (! $this->isConfigured()) {
            return [];
        }

        $url = (string) config('cab.endpoints.platform_materials');
        $rawCategories = $this->client->getAbsolute($url);

        if ($rawCategories === []) {
            return [];
        }

        $this->categoriesCache = $this->mapper->mapCategories($rawCategories);

        return $this->categoriesCache;
    }
}
