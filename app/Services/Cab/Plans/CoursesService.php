<?php

namespace App\Services\Cab\Plans;

use App\Services\Cab\CabApiClient;

class CoursesService
{
    public function __construct(
        private CabApiClient $client,
        private CoursesDataMapper $mapper,
    ) {}

    public function warmWithMaterials(): void
    {
        $this->client->warm([
            (string) config('cab.endpoints.courses'),
            (string) config('cab.endpoints.platform_materials'),
        ]);
    }

    public function isEnabled(): bool
    {
        return (bool) config('cab.enabled');
    }

    /**
     * Metadados + grupos para a seção de treinamentos da Academia (uma única leitura da API).
     *
     * @return array{meta: array<string, mixed>, groups: array<int, array<string, mixed>>}|null
     */
    public function getTrainingsSectionPayload(): ?array
    {
        $table = $this->getTrainingsTableData();

        if ($table === null) {
            return null;
        }

        return [
            'meta' => [
                'title' => $table['title'],
                'description' => $table['description'],
                'planSummary' => $table['planSummary'],
                'totalCount' => $this->countTrainingRows($table),
            ],
            'groups' => $table['groups'],
        ];
    }

    /**
     * Metadados da tabela de treinamentos (sem linhas — carregadas sob demanda).
     *
     * @return array<string, mixed>|null
     */
    public function getTrainingsTableMeta(): ?array
    {
        if (! $this->isEnabled()) {
            return null;
        }

        $courses = $this->client->get((string) config('cab.endpoints.courses'));

        if ($courses === []) {
            return null;
        }

        return $this->mapper->mapTrainingsMeta($courses);
    }

    /**
     * Linhas agrupadas da tabela de treinamentos.
     *
     * @return array<int, array<string, mixed>>|null
     */
    public function getTrainingsTableGroups(): ?array
    {
        $table = $this->getTrainingsTableData();

        if ($table === null) {
            return null;
        }

        return $table['groups'];
    }

    /**
     * @param  array<string, mixed>  $table
     */
    private function countTrainingRows(array $table): int
    {
        $groups = $table['groups'] ?? [];

        if (! is_array($groups)) {
            return 0;
        }

        $total = 0;

        foreach ($groups as $group) {
            $rows = $group['rows'] ?? [];
            $total += is_array($rows) ? count($rows) : 0;
        }

        return $total;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getTrainingsTableData(): ?array
    {
        if (! $this->isEnabled()) {
            return null;
        }

        $courses = $this->client->get((string) config('cab.endpoints.courses'));

        if ($courses === []) {
            return null;
        }

        return $this->mapper->mapTrainingsTable($courses);
    }
}
