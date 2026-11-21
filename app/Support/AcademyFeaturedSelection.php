<?php

namespace App\Support;

class AcademyFeaturedSelection
{
    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array<int, array<string, mixed>>
     */
    public static function pickRandom(array $items, int $limit): array
    {
        if ($limit <= 0 || $items === []) {
            return [];
        }

        $pool = $items;
        shuffle($pool);

        return array_slice($pool, 0, $limit);
    }
}
