<?php

namespace App\Http\Controllers;

use App\Services\Cab\Partners\SponsorsService;
use App\Services\Site\PageContentService;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class PartnersController extends Controller
{
    public function __construct(
        private SponsorsService $sponsorsService,
        private PageContentService $pageContentService,
    ) {}

    public function index(): Response
    {
        $content = $this->pageContentService->findPartner();
        $partners = $this->sponsorsService->list();

        return Inertia::render('partners/find-partner/page', [
            'pageContent' => Arr::except($content, ['categories']),
            'categories' => $content['categories'] ?? [],
            'partners' => $partners !== [] ? $partners : null,
        ]);
    }

    public function show(string $slug): Response
    {
        $partner = $this->sponsorsService->findBySlug($slug);

        if ($partner === null) {
            abort(404);
        }

        return Inertia::render('partners/partner-home/page', [
            'slug' => $slug,
            'partner' => $partner,
        ]);
    }
}
