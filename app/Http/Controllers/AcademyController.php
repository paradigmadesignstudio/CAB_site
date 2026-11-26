<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademyMaterialLeadRequest;
use App\Jobs\Cab\SubmitAcademyMaterialLeadJob;
use App\Services\Cab\Academy\AcademyMaterialLeadService;
use App\Services\Cab\Academy\AcademyService;
use App\Services\Cab\Academy\PlatformMaterialsService;
use App\Services\Cab\Plans\CoursesService;
use App\Services\Site\PageContentService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class AcademyController extends Controller
{
    public function __construct(
        private AcademyService $academyService,
        private AcademyMaterialLeadService $materialLeadService,
        private CoursesService $coursesService,
        private PlatformMaterialsService $platformMaterialsService,
        private PageContentService $pageContentService,
    ) {}

    public function index(): Response
    {
        $this->coursesService->warmWithMaterials();

        $materials = $this->platformMaterialsService->getSectionPayload();

        if (is_array($materials)) {
            $materials['categories'] = [];
        }

        return Inertia::render('academy/page', [
            ...$this->academyService->getPageData(),
            'pageContent' => $this->pageContentService->academyPage(),
            'trainingsSectionData' => $this->coursesService->getTrainingsSectionPayload(),
            'platformMaterialsSectionData' => $materials,
            'platformMaterialCategories' => Inertia::defer(
                fn (): array => $this->platformMaterialsService->getSectionPayload()['categories'] ?? [],
            ),
        ]);
    }

    public function storeMaterialLead(StoreAcademyMaterialLeadRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $material = $this->academyService->findMaterialBySlug($validated['material_slug']);

        if ($material === null) {
            return response()->json([
                'message' => 'Material não encontrado.',
            ], 404);
        }

        if ($this->materialLeadService->isConfigured()) {
            SubmitAcademyMaterialLeadJob::dispatch(
                $validated['name'],
                $validated['email'],
                $validated['phone'],
                (string) $material['slug'],
                (string) $material['title'],
            );
        }

        return response()->json([
            'message' => 'Cadastro recebido! Seu download iniciará em instantes.',
            'downloadUrl' => (string) $material['downloadUrl'],
        ]);
    }
}
