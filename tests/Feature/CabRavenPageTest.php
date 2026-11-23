<?php

namespace Tests\Feature;

use App\Support\DocumentoBrasileiro;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CabRavenPageTest extends TestCase
{
    private const URL = 'https://crm.test/api/v1/site/cabraven';

    /**
     * @return array<string, string>
     */
    private function payload(array $override = []): array
    {
        return array_merge([
            'tipo_documento' => 'cpf',
            'nome' => 'João da Silva',
            'documento' => '529.982.247-25',
            'whatsapp' => '(19) 99999-9999',
            'email' => 'joao@oficina.com.br',
            'consentimento' => '1',
            'site_empresa' => '',
        ], $override);
    }

    private function configureApi(): void
    {
        config([
            'cab.enabled' => true,
            'cab.endpoints.cabraven' => self::URL,
            'cab.site_token' => 't',
        ]);
    }

    #[Test]
    public function page_renders_cpf_cnpj_radio_instead_of_profile_select(): void
    {
        $this->get('/cabraven')
            ->assertOk()
            ->assertSee('<title>CAB + Raven | Seu próximo passo começa aqui</title>', false)
            ->assertSee('name="tipo_documento" value="cpf"', false)
            ->assertSee('name="tipo_documento" value="cnpj"', false)
            ->assertDontSee('name="cliente_cab"', false)
            ->assertDontSee('Selecione seu perfil');
    }

    #[Test]
    public function cab_client_is_sent_to_whatsapp_with_data(): void
    {
        $this->configureApi();
        Http::fake([self::URL => Http::response(['cliente' => true])]);

        $this->post('/cabraven', $this->payload())
            ->assertRedirect(route('cabraven').'#cadastro')
            ->assertSessionHas('cabraven_whatsapp', fn (string $url) => str_starts_with($url, 'https://wa.me/5519971659055?text=')
                && str_contains(rawurldecode($url), 'Sou assinante CAB')
                && str_contains(rawurldecode($url), 'CPF: 529.982.247-25')
                && str_contains(rawurldecode($url), 'Nome: João da Silva'))
            ->assertSessionMissing('cabraven_sucesso');
    }

    #[Test]
    public function non_client_becomes_a_crm_lead_in_a_single_authenticated_post(): void
    {
        $this->configureApi();
        Http::fake([self::URL => Http::response(['cliente' => false, 'lead' => 'criado'])]);

        $this->post('/cabraven', $this->payload(['tipo_documento' => 'cnpj', 'documento' => '11.222.333/0001-81', 'nome' => 'Oficina Teste Ltda']))
            ->assertRedirect(route('cabraven').'#cadastro')
            ->assertSessionHas('cabraven_sucesso', true)
            ->assertSessionMissing('cabraven_whatsapp');

        Http::assertSentCount(1);
        Http::assertSent(fn (Request $request) => $request->method() === 'POST'
            && $request->url() === self::URL
            && $request->hasHeader('Authorization', 'Bearer t')
            && ! str_contains($request->url(), '11222333000181')
            && $request['documento'] === '11222333000181'
            && $request['tipo_documento'] === 'cnpj'
            && $request['nome'] === 'Oficina Teste Ltda'
            && $request['email'] === 'joao@oficina.com.br'
            && $request['whatsapp'] === '(19) 99999-9999');
    }

    #[Test]
    public function existing_lead_is_also_success(): void
    {
        $this->configureApi();
        Http::fake([self::URL => Http::response(['cliente' => false, 'lead' => 'existente'])]);

        $this->post('/cabraven', $this->payload())
            ->assertSessionHas('cabraven_sucesso', true)
            ->assertSessionMissing('cabraven_whatsapp');
    }

    #[Test]
    public function crm_error_falls_back_to_whatsapp(): void
    {
        $this->configureApi();
        Http::fake([self::URL => Http::response('erro', 500)]);

        // Sem resposta do CRM não dá para afirmar que é assinante: texto neutro.
        $this->post('/cabraven', $this->payload())
            ->assertSessionHas('cabraven_whatsapp', fn (string $url) => ! str_contains(rawurldecode($url), 'Sou assinante CAB')
                && str_contains(rawurldecode($url), 'parceria CAB + Raven')
                && str_contains(rawurldecode($url), 'CPF: 529.982.247-25'))
            ->assertSessionMissing('cabraven_sucesso');
    }

    #[Test]
    public function crm_offline_falls_back_to_whatsapp(): void
    {
        $this->configureApi();
        Http::fake(fn () => throw new ConnectionException('timeout'));

        $this->post('/cabraven', $this->payload())->assertSessionHas('cabraven_whatsapp');
    }

    #[Test]
    public function unknown_response_falls_back_to_whatsapp(): void
    {
        $this->configureApi();
        Http::fake([self::URL => Http::response(['ok' => true])]);

        $this->post('/cabraven', $this->payload())->assertSessionHas('cabraven_whatsapp');
    }

    #[Test]
    public function falls_back_to_whatsapp_without_calling_crm_when_not_configured(): void
    {
        Http::fake();

        $this->configureApi();
        config(['cab.site_token' => '']);
        $this->post('/cabraven', $this->payload())->assertSessionHas('cabraven_whatsapp');

        $this->configureApi();
        config(['cab.endpoints.cabraven' => '']);
        $this->post('/cabraven', $this->payload())->assertSessionHas('cabraven_whatsapp');

        Http::assertNothingSent();
    }

    #[Test]
    public function invalid_document_is_rejected(): void
    {
        $this->from('/cabraven')
            ->post('/cabraven', $this->payload(['documento' => '123.456.789-00']))
            ->assertRedirect('/cabraven')
            ->assertSessionHasErrors(['documento' => 'Informe um CPF válido.']);

        $this->from('/cabraven')
            ->post('/cabraven', $this->payload(['tipo_documento' => 'cnpj', 'documento' => '529.982.247-25']))
            ->assertSessionHasErrors(['documento' => 'Informe um CNPJ válido.']);

        $this->from('/cabraven')
            ->post('/cabraven', $this->payload(['tipo_documento' => '']))
            ->assertSessionHasErrors(['tipo_documento']);
    }

    #[Test]
    public function page_keeps_selected_type_after_failed_submission(): void
    {
        $this->withSession(['_old_input' => ['tipo_documento' => 'cnpj', 'nome' => 'Oficina X']])
            ->get('/cabraven')
            ->assertSee('value="cnpj" required checked', false)
            ->assertSee('>Razão social</label>', false)
            ->assertSee('placeholder="00.000.000/0000-00"', false)
            ->assertSee('value="Oficina X"', false);

        $this->withViewErrors(['documento' => 'Informe um CNPJ válido.'])
            ->view('cabraven')
            ->assertSee('<div class="alert" role="alert">', false)
            ->assertSee('Informe um CNPJ válido.');
    }

    #[Test]
    public function document_field_comes_before_name_field(): void
    {
        $html = $this->get('/cabraven')->getContent();

        $this->assertLessThan(strpos($html, 'id="nome"'), strpos($html, 'id="documento"'));
    }

    #[Test]
    public function cnpj_lookup_returns_company_name_from_brasilapi(): void
    {
        Http::fake(['brasilapi.com.br/*' => Http::response([
            'razao_social' => 'OFICINA TESTE LTDA',
            'nome_fantasia' => 'OFICINA TESTE',
            'descricao_situacao_cadastral' => 'ATIVA',
        ])]);

        $this->getJson('/cabraven/cnpj/11222333000181')
            ->assertOk()
            ->assertExactJson(['razao_social' => 'OFICINA TESTE LTDA', 'nome_fantasia' => 'OFICINA TESTE', 'situacao' => 'ATIVA']);

        // Segunda consulta vem do cache.
        $this->getJson('/cabraven/cnpj/11222333000181')->assertOk();
        Http::assertSentCount(1);
    }

    #[Test]
    public function cnpj_lookup_falls_back_to_receitaws(): void
    {
        Http::fake([
            'brasilapi.com.br/*' => Http::response('erro', 500),
            'receitaws.com.br/*' => Http::response(['status' => 'OK', 'nome' => 'OFICINA RESERVA LTDA', 'fantasia' => '', 'situacao' => 'ATIVA']),
        ]);

        $this->getJson('/cabraven/cnpj/11222333000181')
            ->assertOk()
            ->assertJsonPath('razao_social', 'OFICINA RESERVA LTDA');
    }

    #[Test]
    public function cnpj_lookup_handles_invalid_not_found_and_unavailable(): void
    {
        $this->getJson('/cabraven/cnpj/11222333000180')->assertStatus(422);

        Http::fake([
            'brasilapi.com.br/*' => Http::response(['message' => 'CNPJ não encontrado'], 404),
            'receitaws.com.br/*' => Http::response(['status' => 'ERROR', 'message' => 'CNPJ inválido']),
        ]);
        $this->getJson('/cabraven/cnpj/11222333000181')->assertNotFound()
            ->assertJsonPath('message', 'CNPJ não encontrado na Receita Federal.');
    }

    #[Test]
    public function cnpj_lookup_returns_503_when_services_are_down(): void
    {
        Http::fake(['*' => Http::response('erro', 500)]);

        $this->getJson('/cabraven/cnpj/11444777000161')->assertStatus(503);
    }

    #[Test]
    public function document_helper_validates_and_formats(): void
    {
        $this->assertTrue(DocumentoBrasileiro::cpfValido('52998224725'));
        $this->assertFalse(DocumentoBrasileiro::cpfValido('111.111.111-11'));
        $this->assertTrue(DocumentoBrasileiro::cnpjValido('11.222.333/0001-81'));
        $this->assertFalse(DocumentoBrasileiro::cnpjValido('11.222.333/0001-80'));
        $this->assertSame('529.982.247-25', DocumentoBrasileiro::formatar('cpf', '52998224725'));
        $this->assertSame('11.222.333/0001-81', DocumentoBrasileiro::formatar('cnpj', '11222333000181'));
    }

    #[Test]
    public function cabraven_is_not_linked_in_site_menu(): void
    {
        $this->get('/')->assertDontSee('/cabraven', false);
    }
}
