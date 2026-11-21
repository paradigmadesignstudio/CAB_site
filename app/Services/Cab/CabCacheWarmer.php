<?php

namespace App\Services\Cab;

use App\Services\Cab\Blog\BlogService;
use App\Services\Cab\MemberWorkshops\WorkshopService;
use App\Services\Cab\Partners\SponsorsService;
use App\Services\Cab\Plans\CoursesService;
use App\Services\Cab\Plans\PlansService;

class CabCacheWarmer
{
    public function __construct(
        private BlogService $blogService,
        private SponsorsService $sponsorsService,
        private PlansService $plansService,
        private CoursesService $coursesService,
        private WorkshopService $workshopService,
    ) {}

    /**
     * Pré-carrega respostas GET do CRM no cache da aplicação.
     */
    public function warm(): int
    {
        if (! config('cab.enabled')) {
            return 0;
        }

        $warmed = 0;

        $this->blogService->getIndexPageContent();
        $warmed++;

        foreach (array_keys(config('cab.blog_category_slugs', [])) as $routeName) {
            $this->blogService->getCategoryPageData($routeName);
            $warmed++;
        }

        if ($this->sponsorsService->isEnabled()) {
            $this->sponsorsService->list();
            $warmed++;
        }

        if ($this->plansService->isConfigured()) {
            $this->plansService->list();
            $warmed++;
        }

        if ($this->coursesService->isEnabled()) {
            $this->coursesService->getTrainingsTableMeta();
            $warmed++;
        }

        if ((bool) config('cab.features.oficinas_enabled') && $this->workshopService->isConfigured()) {
            $this->workshopService->list();
            $warmed++;
        }

        return $warmed;
    }
}
