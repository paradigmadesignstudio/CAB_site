<?php

namespace App\Services\Cab\Plans;

use App\Services\Cab\CabApiClient;

class PlansService
{
    public function __construct(
        private CabApiClient $client,
        private PlansDataMapper $mapper,
    ) {}

    public function warmWithCourses(): void
    {
        $this->client->warm([
            (string) config('cab.endpoints.plans'),
            (string) config('cab.endpoints.courses'),
        ]);
    }

    public function isConfigured(): bool
    {
        return (bool) config('cab.enabled')
            && (string) config('cab.endpoints.plans') !== '';
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function list(): array
    {
        if (! $this->isConfigured()) {
            return [];
        }

        $plans = $this->client->getAbsolute((string) config('cab.endpoints.plans'));

        if ($plans === []) {
            return [];
        }

        return $this->mapper->mapList($plans);
    }
}
