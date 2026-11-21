<?php

namespace App\Http\Controllers;

use App\Services\Site\LegalContentService;
use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function __construct(
        private LegalContentService $legalContentService,
    ) {}

    public function privacy(): Response
    {
        return Inertia::render('legal/page', [
            'document' => $this->legalContentService->privacy(),
        ]);
    }

    public function terms(): Response
    {
        return Inertia::render('legal/page', [
            'document' => $this->legalContentService->terms(),
        ]);
    }

    public function cookies(): Response
    {
        return Inertia::render('legal/page', [
            'document' => $this->legalContentService->cookies(),
        ]);
    }
}
