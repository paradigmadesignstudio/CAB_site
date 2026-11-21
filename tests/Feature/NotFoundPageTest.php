<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NotFoundPageTest extends TestCase
{
    #[Test]
    public function unknown_route_renders_not_found_page_with_404_status(): void
    {
        $this->get('/rota-inexistente-para-teste')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page
                ->component('errors/not-found/page')
                ->where('title', 'Página não encontrada')
                ->where('backHref', '/')
                ->where('backLabel', 'Voltar para a home')
            );
    }

    #[Test]
    public function json_request_to_unknown_route_returns_json_404(): void
    {
        $this->getJson('/rota-inexistente-para-teste')
            ->assertNotFound()
            ->assertJson([
                'message' => 'Página não encontrada.',
            ]);
    }
}
