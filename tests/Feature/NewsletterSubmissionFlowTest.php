<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NewsletterSubmissionFlowTest extends TestCase
{
    /**
     * @return array<string, mixed>
     */
    private function newsletterConfig(): array
    {
        return [
            'cab.enabled' => true,
            'cab.endpoints.newsletter' => 'https://crm.example.com/api/newsletter',
            'cab.endpoints.home_cta' => 'https://crm.example.com/api/newsletter',
            'cab.newsletter_payload_keys' => [
                'name' => 'nome',
                'email' => 'email',
                'phone' => 'telefone',
                'type' => 'tipo',
            ],
        ];
    }

    #[Test]
    public function home_cta_posts_geral_payload_to_newsletter_api(): void
    {
        config($this->newsletterConfig());

        Http::fake([
            'https://crm.example.com/api/newsletter' => Http::response(['data' => true], 201),
        ]);

        $this->postJson('/home/cta', [
            'name' => 'João Silva',
            'phone' => '11999999999',
            'email' => 'joao@example.com',
        ])
            ->assertOk()
            ->assertJson(['message' => 'Cadastro recebido com sucesso!']);

        Http::assertSent(function ($request) {
            return $request->method() === 'POST'
                && $request->url() === 'https://crm.example.com/api/newsletter'
                && $request['nome'] === 'João Silva'
                && $request['email'] === 'joao@example.com'
                && $request['telefone'] === '11999999999'
                && $request['tipo'] === 'GERAL';
        });
    }

    #[Test]
    public function blog_listing_posts_blog_tipo_to_newsletter_api(): void
    {
        config($this->newsletterConfig());

        Http::fake([
            'https://crm.example.com/api/newsletter' => Http::response(['data' => true], 201),
        ]);

        $this->postJson('/blog/newsletter', [
            'name' => 'Maria Souza',
            'email' => 'maria@example.com',
            'tipo' => 'BLOG',
        ])
            ->assertOk();

        Http::assertSent(function ($request) {
            return $request['tipo'] === 'BLOG'
                && $request['nome'] === 'Maria Souza'
                && ! array_key_exists('telefone', $request->data());
        });
    }

    #[Test]
    public function blog_category_posts_category_name_as_tipo(): void
    {
        config($this->newsletterConfig());

        Http::fake([
            'https://crm.example.com/api/newsletter' => Http::response(['data' => true], 201),
        ]);

        $this->postJson('/blog/newsletter', [
            'name' => 'Carlos Teste',
            'email' => 'carlos@example.com',
            'phone' => '(11) 98888-7777',
            'tipo' => 'Eventos',
        ])
            ->assertOk();

        Http::assertSent(function ($request) {
            return $request['tipo'] === 'Eventos'
                && $request['telefone'] === '(11) 98888-7777';
        });
    }

    #[Test]
    public function blog_dicas_posts_dicas_tipo_to_newsletter_api(): void
    {
        config($this->newsletterConfig());

        Http::fake([
            'https://crm.example.com/api/newsletter' => Http::response(['data' => true], 201),
        ]);

        $this->postJson('/blog/newsletter', [
            'name' => 'Ana Lima',
            'email' => 'ana@example.com',
            'tipo' => 'DICAS',
        ])
            ->assertOk();

        Http::assertSent(fn ($request) => $request['tipo'] === 'DICAS');
    }

    #[Test]
    public function blog_newsletter_returns_service_unavailable_when_cab_is_disabled(): void
    {
        config([
            'cab.enabled' => false,
            'cab.endpoints.newsletter' => 'https://crm.example.com/api/newsletter',
        ]);

        $this->postJson('/blog/newsletter', [
            'name' => 'Maria Souza',
            'email' => 'maria@example.com',
            'tipo' => 'BLOG',
        ])->assertStatus(503);

        Http::assertNothingSent();
    }
}
