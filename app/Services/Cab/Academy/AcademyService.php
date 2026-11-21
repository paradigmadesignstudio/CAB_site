<?php

namespace App\Services\Cab\Academy;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class AcademyService
{
    /**
     * @return array<string, mixed>
     */
    public function getPageData(): array
    {
        return [
            'materials' => $this->getMaterials(),
            'testimonials' => $this->getTestimonials(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getMaterials(): array
    {
        $materials = $this->loadSection('materials');

        $available = array_values(array_filter(
            $materials,
            fn (array $material): bool => $this->materialHasDownload($material),
        ));

        // Não envia downloadUrl no HTML/Inertia — só após lead no backend.
        return array_map(
            static fn (array $material): array => Arr::except($material, ['downloadUrl']),
            $available,
        );
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findMaterialBySlug(string $slug): ?array
    {
        foreach ($this->loadSection('materials') as $material) {
            if (($material['slug'] ?? '') === $slug && $this->materialHasDownload($material)) {
                return $material;
            }
        }

        return null;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getTestimonials(): array
    {
        return $this->loadSection('testimonials');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function loadSection(string $key): array
    {
        $ttl = (int) config('cab.academy_mock_cache_ttl', 3600);

        $payload = $ttl > 0
            ? Cache::remember('cab.academy.mock.v5', $ttl, fn (): array => $this->loadMockPayload())
            : $this->loadMockPayload();

        $section = $payload[$key] ?? [];

        return is_array($section) ? array_values($section) : [];
    }

    /**
     * @return array<string, mixed>
     */
    private function loadMockPayload(): array
    {
        $path = database_path('data/academy.json');

        if (! File::exists($path)) {
            return ['materials' => [], 'testimonials' => []];
        }

        $decoded = json_decode(File::get($path), true);

        return is_array($decoded) ? $decoded : ['materials' => [], 'testimonials' => []];
    }

    /**
     * @param  array<string, mixed>  $material
     */
    private function materialHasDownload(array $material): bool
    {
        $downloadUrl = (string) ($material['downloadUrl'] ?? '');

        if ($downloadUrl === '' || $downloadUrl === '#') {
            return false;
        }

        $path = parse_url($downloadUrl, PHP_URL_PATH);

        if (! is_string($path) || $path === '') {
            return false;
        }

        return File::exists(public_path(ltrim($path, '/')));
    }
}
