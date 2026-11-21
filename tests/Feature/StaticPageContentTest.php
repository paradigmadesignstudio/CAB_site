<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class StaticPageContentTest extends TestCase
{
    #[Test]
    public function support_page_receives_static_content_from_server(): void
    {
        $this->get('/suporte')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('support/page')
                ->has('pageContent.meta')
                ->has('contactInfo', 4)
            );
    }

    #[Test]
    public function about_us_page_receives_static_content_from_server(): void
    {
        $this->get('/sobre-nos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('about-us/page')
                ->has('pageContent.hero')
                ->has('timeline', 4)
                ->has('pillars', 4)
                ->has('team', 11)
                ->has('events', 1)
            );
    }

    #[Test]
    public function plans_page_receives_static_content_from_server(): void
    {
        config(['cab.enabled' => false]);

        $this->get('/planos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('plans/page')
                ->has('staticContent.plans', 3)
                ->has('staticContent.faqSection')
            );
    }

    #[Test]
    public function ecosystem_page_receives_static_content_from_server(): void
    {
        $this->get('/planos/ecossistema-integrado')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('plans/ecosystem/page')
                ->has('pageContent.raiox.features', 3)
            );
    }

    #[Test]
    public function academy_page_receives_static_page_content(): void
    {
        $this->get('/academia-cab')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('academy/page')
                ->has('pageContent.hero')
                ->has('pageContent.platformMaterialsSection')
                ->has('pageContent.trainingsSection')
                ->has('pageContent.trainingsSection.catalog')
                ->has('pageContent.faq.items')
                ->has('materials.0.slug')
                ->missing('materials.0.downloadUrl')
            );
    }
}
