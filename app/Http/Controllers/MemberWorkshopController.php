<?php

namespace App\Http\Controllers;

use App\Services\Cab\MemberWorkshops\WorkshopService;
use App\Services\Site\PageContentService;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class MemberWorkshopController extends Controller
{
    public function __construct(
        private WorkshopService $workshopService,
        private PageContentService $pageContentService,
    ) {}

    public function index(): Response
    {
        $this->ensureEnabled();

        $content = $this->pageContentService->findMember();

        return Inertia::render('member-workshops/find-member/page', [
            'pageContent' => Arr::except($content, ['brazilStates']),
            'brazilStates' => $content['brazilStates'] ?? [],
            'workshops' => $this->workshopService->list(),
        ]);
    }

    public function show(string $slug): Response
    {
        $this->ensureEnabled();

        $workshop = $this->workshopService->findBySlug($slug);

        if ($workshop === null) {
            abort(404);
        }

        return $this->renderShowPage($slug, $workshop);
    }

    /**
     * @param  array<string, mixed>  $workshop
     * @param  array{href: string, label: string}|null  $backLink
     */
    private function renderShowPage(string $slug, array $workshop, ?array $backLink = null): Response
    {
        $content = $this->pageContentService->findMember();

        $galleryImages = array_values($workshop['galleryImages'] ?? []);
        unset($workshop['galleryImages']);
        $workshop['galleryImageCount'] = count($galleryImages);

        return Inertia::render('member-workshops/workshop-home/page', [
            'slug' => $slug,
            'workshop' => $workshop,
            'galleryImages' => Inertia::defer(
                fn (): array => $galleryImages,
                'workshop-gallery',
            ),
            'backLink' => $backLink ?? ($content['backLink'] ?? [
                'href' => '/oficinas',
                'label' => 'Voltar para lista de oficinas',
            ]),
        ]);
    }

    private function ensureEnabled(): void
    {
        if (! config('cab.features.oficinas_enabled')) {
            abort(404);
        }
    }
}
