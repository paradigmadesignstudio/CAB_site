<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LegalPagesTest extends TestCase
{
    #[Test]
    public function privacy_policy_page_renders_legal_document(): void
    {
        $this->get('/politica-de-privacidade')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('legal/page')
                ->where('document.slug', 'politica-de-privacidade')
                ->has('document.sections', 16)
                ->has('document.company.cnpj')
                ->has('document.relatedLinks', 2)
            );
    }

    #[Test]
    public function terms_of_service_page_renders_legal_document(): void
    {
        $this->get('/termos-de-servico')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('legal/page')
                ->where('document.slug', 'termos-de-servico')
                ->has('document.sections', 16)
            );
    }

    #[Test]
    public function cookie_policy_page_renders_legal_document(): void
    {
        $this->get('/politica-de-cookies')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('legal/page')
                ->where('document.slug', 'politica-de-cookies')
                ->has('document.sections', 10)
            );
    }
}
