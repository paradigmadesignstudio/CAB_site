<?php

namespace Tests\Feature;

use App\Jobs\Cab\SubmitAcademyMaterialLeadJob;
use App\Jobs\Cab\SubmitHomeCtaJob;
use App\Jobs\Cab\SubmitNewsletterSubscriptionJob;
use App\Jobs\Cab\SubmitSupportContactJob;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FormSubmissionQueueTest extends TestCase
{
    #[Test]
    public function home_cta_dispatches_queue_job_when_configured(): void
    {
        Queue::fake();

        config([
            'cab.enabled' => true,
            'cab.endpoints.home_cta' => 'https://crm.example.com/api/newsletter',
            'cab.endpoints.newsletter' => 'https://crm.example.com/api/newsletter',
        ]);

        $this->postJson('/home/cta', [
            'name' => 'João Silva',
            'phone' => '11999999999',
            'email' => 'joao@example.com',
        ])
            ->assertOk()
            ->assertJson(['message' => 'Cadastro recebido com sucesso!']);

        Queue::assertPushed(SubmitHomeCtaJob::class);
    }

    #[Test]
    public function blog_newsletter_dispatches_queue_job_when_configured(): void
    {
        Queue::fake();

        config([
            'cab.enabled' => true,
            'cab.endpoints.newsletter' => 'https://crm.example.com/api/newsletter',
        ]);

        $this->postJson('/blog/newsletter', [
            'name' => 'Maria Souza',
            'email' => 'maria@example.com',
            'tipo' => 'BLOG',
        ])
            ->assertOk()
            ->assertJson(['message' => 'Inscrição recebida com sucesso!']);

        Queue::assertPushed(SubmitNewsletterSubscriptionJob::class, function (SubmitNewsletterSubscriptionJob $job): bool {
            return $job->name === 'Maria Souza'
                && $job->email === 'maria@example.com'
                && $job->tipo === 'BLOG';
        });
    }

    #[Test]
    public function support_contact_dispatches_queue_job_when_configured(): void
    {
        Queue::fake();

        config([
            'cab.enabled' => true,
            'cab.endpoints.support_contact' => 'https://crm.example.com/api/contato',
        ]);

        $this->postJson('/suporte/contato', [
            'name' => 'Carlos Teste',
            'email' => 'carlos@example.com',
            'subject' => 'Dúvida sobre planos',
            'message' => 'Gostaria de saber mais detalhes sobre os planos disponíveis.',
        ])
            ->assertOk()
            ->assertJson(['message' => 'Mensagem recebida com sucesso! Responderemos em breve.']);

        Queue::assertPushed(SubmitSupportContactJob::class);
    }

    #[Test]
    public function home_cta_returns_service_unavailable_when_not_configured(): void
    {
        config([
            'cab.enabled' => false,
            'cab.endpoints.home_cta' => 'https://crm.example.com/api/newsletter',
        ]);

        $this->postJson('/home/cta', [
            'name' => 'João Silva',
            'phone' => '11999999999',
            'email' => 'joao@example.com',
        ])->assertStatus(503);

        Http::assertNothingSent();
    }

    #[Test]
    public function academy_material_lead_dispatches_queue_job_when_configured(): void
    {
        Queue::fake();

        config([
            'cab.enabled' => true,
            'cab.endpoints.newsletter' => 'https://crm.example.com/api/newsletter',
        ]);

        $this->postJson('/academia-cab/materiais/lead', [
            'name' => 'João Silva',
            'phone' => '11999999999',
            'email' => 'joao@example.com',
            'material_slug' => 'a6gf-detalhes-tecnicos',
        ])
            ->assertOk()
            ->assertJson([
                'message' => 'Cadastro recebido! Seu download iniciará em instantes.',
                'downloadUrl' => '/downloads/a6gf-detalhes-tecnicos.pdf',
            ]);

        Queue::assertPushed(SubmitAcademyMaterialLeadJob::class);
    }

    #[Test]
    public function academy_material_lead_returns_download_without_queue_when_crm_not_configured(): void
    {
        Queue::fake();

        config([
            'cab.enabled' => false,
            'cab.endpoints.newsletter' => '',
        ]);

        $this->postJson('/academia-cab/materiais/lead', [
            'name' => 'João Silva',
            'phone' => '11999999999',
            'email' => 'joao@example.com',
            'material_slug' => 'boletim-7dct300',
        ])
            ->assertOk()
            ->assertJson([
                'downloadUrl' => '/downloads/boletim-7dct300.pdf',
            ]);

        Queue::assertNothingPushed();
    }

    #[Test]
    public function academy_material_lead_returns_not_found_for_unknown_slug(): void
    {
        $this->postJson('/academia-cab/materiais/lead', [
            'name' => 'João Silva',
            'phone' => '11999999999',
            'email' => 'joao@example.com',
            'material_slug' => 'material-inexistente',
        ])->assertNotFound();
    }
}
