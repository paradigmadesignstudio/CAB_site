<?php

namespace App\Http\Controllers;

use App\Services\Cab\Plans\CoursesService;
use App\Services\Cab\Plans\PlansService;
use App\Services\Site\PageContentService;
use Inertia\Inertia;
use Inertia\Response;

class PlansController extends Controller
{
    public function __construct(
        private CoursesService $coursesService,
        private PlansService $plansService,
        private PageContentService $pageContentService,
    ) {}

    public function index(): Response
    {
        $plans = $this->plansService->list();
        $plansProp = $plans !== [] ? $plans : null;

        return Inertia::render('plans/page', [
            'staticContent' => $this->pageContentService->plans(),
            'plans' => $plansProp,
            'trainingsTableMeta' => (function () use ($plans): ?array {
                $trainingsTableMeta = $this->coursesService->getTrainingsTableMeta();

                if ($trainingsTableMeta !== null && $plans !== []) {
                    $trainingsTableMeta = $this->syncTrainingsPlanSummary($trainingsTableMeta, $plans);
                }

                return $trainingsTableMeta;
            })(),
        ]);
    }

    public function trainingsTable(): \Illuminate\Http\JsonResponse
    {
        if (! $this->coursesService->isEnabled()) {
            return response()->json(['groups' => []]);
        }

        $groups = $this->coursesService->getTrainingsTableGroups();

        return response()->json([
            'groups' => $groups ?? [],
        ]);
    }

    public function ecosystem(): Response
    {
        return Inertia::render('plans/ecosystem/page', [
            'pageContent' => $this->pageContentService->ecosystem(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $trainingsTable
     * @param  array<int, array<string, mixed>>  $plans
     * @return array<string, mixed>
     */
    private function syncTrainingsPlanSummary(array $trainingsTable, array $plans): array
    {
        $summary = $trainingsTable['planSummary'] ?? [];

        if (! is_array($summary)) {
            return $trainingsTable;
        }

        foreach ($plans as $index => $plan) {
            if (! isset($summary[$index]) || ! is_array($summary[$index])) {
                continue;
            }

            $summary[$index]['plan'] = (string) ($plan['name'] ?? $summary[$index]['plan']);
            $summary[$index]['highlight'] = (bool) ($plan['popular'] ?? $summary[$index]['highlight'] ?? false);
        }

        $trainingsTable['planSummary'] = $summary;

        return $trainingsTable;
    }
}
