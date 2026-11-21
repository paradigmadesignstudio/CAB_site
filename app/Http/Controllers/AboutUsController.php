<?php

namespace App\Http\Controllers;

use App\Services\Site\PageContentService;
use Inertia\Inertia;
use Inertia\Response;

class AboutUsController extends Controller
{
    public function __construct(
        private PageContentService $pageContentService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('about-us/page', $this->pageContentService->aboutUs());
    }
}
