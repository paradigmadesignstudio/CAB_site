<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PlansPageSignupUrlTest extends TestCase
{
    private const SIGNUP_URL = 'https://crm.example.com/cadastro';

    #[Test]
    public function static_plans_fallback_uses_signup_url_from_config_on_all_plan_buttons(): void
    {
        config([
            'cab.enabled' => false,
            'cab.plans_signup_url' => self::SIGNUP_URL,
        ]);

        $this->get('/planos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('plans/page')
                ->where('staticContent.plans.0.href', self::SIGNUP_URL)
                ->where('staticContent.plans.1.href', self::SIGNUP_URL)
                ->where('staticContent.plans.2.href', self::SIGNUP_URL)
                ->where('staticContent.finalCta.link', self::SIGNUP_URL)
            );
    }

    #[Test]
    public function api_plans_use_signup_url_from_config_on_all_plan_buttons(): void
    {
        config([
            'cab.enabled' => true,
            'cab.plans_signup_url' => self::SIGNUP_URL,
            'cab.endpoints.plans' => 'https://api.example.test/plans',
        ]);

        Http::fake([
            'https://api.example.test/plans' => Http::response([
                [
                    'id' => 2,
                    'titulo' => 'Associação 1.4',
                    'valor_recorrente' => 169.9,
                    'valor_anual' => 1733,
                    'duracao_meses' => 12,
                    'beneficios' => [],
                ],
                [
                    'id' => 3,
                    'titulo' => 'Associação 2.0',
                    'valor_recorrente' => 259.9,
                    'valor_anual' => 2650.98,
                    'duracao_meses' => 12,
                    'beneficios' => [],
                ],
                [
                    'id' => 4,
                    'titulo' => 'Associação 3.0',
                    'valor_recorrente' => 297.99,
                    'valor_anual' => 3039.3,
                    'duracao_meses' => 12,
                    'beneficios' => [],
                ],
            ], 200),
        ]);

        $this->get('/planos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('plans/page')
                ->has('plans', 3)
                ->where('plans.0.href', self::SIGNUP_URL)
                ->where('plans.1.href', self::SIGNUP_URL)
                ->where('plans.2.href', self::SIGNUP_URL)
            );
    }
}
