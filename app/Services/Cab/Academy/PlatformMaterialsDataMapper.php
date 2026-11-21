<?php

namespace App\Services\Cab\Academy;

use App\Support\AcademyFeaturedSelection;

class PlatformMaterialsDataMapper
{
    /**
     * @param  array<string, mixed>  $category
     * @param  array<string, mixed>  $material
     * @return array<string, mixed>
     */
    public function mapCard(array $category, array $material): array
    {
        $categoryName = (string) ($category['categoria'] ?? '');
        $plansLink = (string) config(
            'cab.academy_platform_materials_plans_link',
            'https://crm.cambioautomaticodobrasil.com.br/login-associado',
        );

        return [
            'id' => (int) ($material['id'] ?? 0),
            'title' => (string) ($material['nome'] ?? ''),
            'image' => (string) ($material['imagem_url'] ?? ''),
            'imageMobile' => $this->mobileImageValue($material),
            'category' => $categoryName,
            'categoryId' => (int) ($category['categoria_id'] ?? 0),
            'link' => $plansLink,
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $categories
     * @return array<int, array<string, mixed>>
     */
    public function mapCategories(array $categories): array
    {
        $mapped = [];

        foreach ($categories as $category) {
            if (! is_array($category)) {
                continue;
            }

            $materials = $category['materiais'] ?? [];

            if (! is_array($materials) || $materials === []) {
                continue;
            }

            $mappedMaterials = [];

            foreach ($materials as $material) {
                if (! is_array($material)) {
                    continue;
                }

                $mappedMaterials[] = $this->mapCard($category, $material);
            }

            if ($mappedMaterials === []) {
                continue;
            }

            $mapped[] = [
                'id' => (int) ($category['categoria_id'] ?? 0),
                'name' => (string) ($category['categoria'] ?? ''),
                'materials' => $mappedMaterials,
            ];
        }

        return $mapped;
    }

    /**
     * @param  array<int, array<string, mixed>>  $categories
     * @return array<int, array<string, mixed>>
     */
    public function flattenMaterials(array $categories): array
    {
        $items = [];

        foreach ($categories as $category) {
            foreach ($category['materials'] ?? [] as $material) {
                if (! is_array($material)) {
                    continue;
                }

                $items[] = $material;
            }
        }

        return $items;
    }

    /**
     * @param  array<int, array<string, mixed>>  $categories
     * @return array<int, array<string, mixed>>
     */
    public function pickFeatured(array $categories, int $limit): array
    {
        return AcademyFeaturedSelection::pickRandom(
            $this->flattenMaterials($categories),
            $limit,
        );
    }

    /**
     * @param  array<string, mixed>  $material
     */
    private function mobileImageValue(array $material): ?string
    {
        foreach ([
            'imagem_mobile_url',
            'mobile_image_url',
            'thumbnail_url',
            'thumb_url',
            'imagem_thumb_url',
            'url_thumb',
            'miniatura_url',
        ] as $key) {
            if (! empty($material[$key])) {
                return (string) $material[$key];
            }
        }

        return null;
    }
}
