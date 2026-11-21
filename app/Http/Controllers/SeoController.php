<?php

namespace App\Http\Controllers;

use App\Services\Site\RobotsService;
use App\Services\Site\SitemapService;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function __construct(
        private SitemapService $sitemapService,
        private RobotsService $robotsService,
    ) {}

    public function sitemap(): Response
    {
        return response($this->sitemapService->xml(), 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }

    public function robots(): Response
    {
        return response($this->robotsService->content(), 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
