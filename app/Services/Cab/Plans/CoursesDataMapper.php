<?php

namespace App\Services\Cab\Plans;

class CoursesDataMapper
{
    private const DEFAULT_IMAGE = 'bg-gradient-to-br from-primary to-[#0E55B0]';

    /**
     * @param  array<int, array<string, mixed>>  $courses
     * @return array<string, mixed>
     */
    public function mapTrainingsTable(array $courses): array
    {
        $platform14Limit = (int) config('cab.plans_course_thresholds.platform_14', 20);
        $platform20Limit = (int) config('cab.plans_course_thresholds.platform_20', 38);

        usort($courses, fn (array $a, array $b) => ($a['id'] ?? 0) <=> ($b['id'] ?? 0));

        $rows = [];

        foreach ($courses as $index => $course) {
            $rows[] = [
                'id' => (int) ($course['id'] ?? 0),
                'n' => str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
                'label' => (string) ($course['nome'] ?? ''),
                'image' => $this->imageValue($course),
                'imageMobile' => $this->mobileImageValue($course),
                'lessonCount' => (int) ($course['quantidade_aulas'] ?? 0),
                'languages' => $this->languagesValue($course),
                'p1' => $index < $platform14Limit,
                'p2' => $index < $platform20Limit,
                'p3' => true,
            ];
        }

        $total = count($rows);
        $platform14Count = min($total, $platform14Limit);
        $platform20Count = min($total, $platform20Limit);

        return [
            'title' => "+{$total} Treinamentos Online Incluídos",
            'description' => 'Assista com toda a sua equipe, quando e onde quiser. Aprenda na prática o passo a passo completo de montagem e desmontagem de todas as transmissões automáticas e automatizadas.',
            'planSummary' => [
                [
                    'plan' => 'Plataforma 1.4',
                    'range' => "1 – {$platform14Count}",
                    'count' => $platform14Count,
                    'highlight' => false,
                ],
                [
                    'plan' => 'Plataforma 2.0',
                    'range' => "1 – {$platform20Count}",
                    'count' => $platform20Count,
                    'highlight' => false,
                ],
                [
                    'plan' => 'Plataforma 3.0',
                    'range' => $total > $platform20Limit
                        ? "1 – {$total} e mais"
                        : "1 – {$total}",
                    'count' => $total,
                    'highlight' => true,
                ],
            ],
            'groups' => [
                [
                    'category' => 'Treinamentos online inclusos',
                    'rows' => $rows,
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $course
     * @return array<int, string>
     */
    private function languagesValue(array $course): array
    {
        $languages = $course['idiomas'] ?? [];

        if (! is_array($languages) || $languages === []) {
            return ['Português'];
        }

        return array_values(array_filter(array_map(
            fn (mixed $language) => trim((string) $language),
            $languages,
        )));
    }

    /**
     * @param  array<string, mixed>  $course
     */
    private function imageValue(array $course): string
    {
        foreach ([
            'capa',
            'capa_url',
            'imagem_capa',
            'cover_image_url',
            'featured_image_url',
            'imagem',
            'image',
            'image_url',
        ] as $key) {
            if (! empty($course[$key])) {
                return (string) $course[$key];
            }
        }

        return self::DEFAULT_IMAGE;
    }

    /**
     * @param  array<string, mixed>  $course
     */
    private function mobileImageValue(array $course): ?string
    {
        foreach ([
            'imagem_mobile_url',
            'mobile_image_url',
            'thumbnail_url',
            'thumb_url',
            'featured_image_thumb_url',
            'cover_image_thumb_url',
            'image_thumb_url',
            'url_thumb',
            'miniatura_url',
        ] as $key) {
            if (! empty($course[$key])) {
                return (string) $course[$key];
            }
        }

        return null;
    }
}
