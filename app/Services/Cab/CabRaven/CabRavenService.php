<?php

namespace App\Services\Cab\CabRaven;

use App\Services\Cab\CabApiClient;
use App\Support\DocumentoBrasileiro;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Parceria CAB + Raven: pergunta ao CRM se o documento é de assinante ativo
 * (ou já cria o lead) e monta o link do WhatsApp.
 */
class CabRavenService
{
    public function __construct(
        private CabApiClient $api,
    ) {}

    public function configured(): bool
    {
        return (bool) config('cab.enabled')
            && trim((string) config('cab.endpoints.cabraven')) !== ''
            && trim((string) config('cab.site_token')) !== '';
    }

    /**
     * Um POST só ao CRM: ele responde se o documento é de assinante ativo ou cria o lead.
     *
     * @param  array{tipo_documento: string, nome: string, documento: string, whatsapp: string, email: string}  $dados
     * @return 'cliente'|'lead'|null null = não foi possível saber (não configurado, fora do ar,
     *                               erro ou resposta em formato desconhecido)
     */
    public function submit(array $dados): ?string
    {
        if (! $this->configured()) {
            return null;
        }

        try {
            $response = Http::timeout(min(10, (int) config('cab.timeout', 30)))
                ->withToken((string) config('cab.site_token'))
                ->acceptJson()
                ->asJson()
                ->post($this->api->buildUrl((string) config('cab.endpoints.cabraven')), [
                    'tipo_documento' => $dados['tipo_documento'],
                    'documento' => DocumentoBrasileiro::digitos($dados['documento']),
                    'nome' => $dados['nome'],
                    'email' => $dados['email'],
                    'whatsapp' => $dados['whatsapp'],
                ]);
        } catch (\Throwable $exception) {
            Log::channel('cab')->error('cabraven_crm_error', ['message' => $exception->getMessage()]);

            return null;
        }

        // Sem corpo nem URL no log: a resposta de validação pode ecoar dados pessoais.
        if (! $response->successful()) {
            Log::channel('cab')->warning('cabraven_crm_failed', ['http_status' => $response->status()]);

            return null;
        }

        if ($response->json('cliente') === true) {
            return 'cliente';
        }

        if ($response->json('cliente') === false && in_array($response->json('lead'), ['criado', 'existente'], true)) {
            return 'lead';
        }

        Log::channel('cab')->warning('cabraven_crm_unknown_format', ['http_status' => $response->status()]);

        return null;
    }

    /**
     * Consulta dados públicos do CNPJ (Receita Federal) via BrasilAPI / ReceitaWS.
     *
     * @return array{status: 'ok', razao_social: string, nome_fantasia: string, situacao: string}|array{status: 'not_found'}|null
     *         null = nenhum serviço respondeu (tentar de novo depois)
     */
    public function lookupCnpj(string $cnpj): ?array
    {
        $digitos = DocumentoBrasileiro::digitos($cnpj);
        $cacheKey = 'cabraven.cnpj:'.$digitos;

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $resultado = $this->fetchCnpj($digitos);

        if ($resultado !== null) {
            Cache::put($cacheKey, $resultado, $resultado['status'] === 'ok' ? now()->addDay() : now()->addHour());
        }

        return $resultado;
    }

    /**
     * @return array{status: 'ok', razao_social: string, nome_fantasia: string, situacao: string}|array{status: 'not_found'}|null
     */
    private function fetchCnpj(string $digitos): ?array
    {
        $naoEncontrado = false;

        foreach ((array) config('cab.cabraven.cnpj_lookup_urls') as $template) {
            $url = str_replace('{cnpj}', $digitos, trim((string) $template));

            if ($url === '') {
                continue;
            }

            try {
                $response = Http::timeout(8)->acceptJson()->get($url);
            } catch (\Throwable $exception) {
                Log::channel('cab')->warning('cabraven_cnpj_lookup_error', [
                    'host' => parse_url($url, PHP_URL_HOST),
                    'message' => $exception->getMessage(),
                ]);

                continue;
            }

            $json = $response->json();

            if ($response->status() === 404) {
                $naoEncontrado = true;

                continue;
            }

            if (! $response->successful() || ! is_array($json)) {
                Log::channel('cab')->warning('cabraven_cnpj_lookup_failed', [
                    'host' => parse_url($url, PHP_URL_HOST),
                    'http_status' => $response->status(),
                ]);

                continue;
            }

            // ReceitaWS responde 200 com status ERROR quando o CNPJ não existe.
            if (($json['status'] ?? null) === 'ERROR') {
                $naoEncontrado = true;

                continue;
            }

            $razaoSocial = trim((string) ($json['razao_social'] ?? $json['nome'] ?? ''));

            if ($razaoSocial === '') {
                continue;
            }

            return [
                'status' => 'ok',
                'razao_social' => $razaoSocial,
                'nome_fantasia' => trim((string) ($json['nome_fantasia'] ?? $json['fantasia'] ?? '')),
                'situacao' => strtoupper(trim((string) ($json['descricao_situacao_cadastral'] ?? $json['situacao'] ?? ''))),
            ];
        }

        return $naoEncontrado ? ['status' => 'not_found'] : null;
    }

    /**
     * @param  array{tipo_documento: string, nome: string, documento: string, whatsapp: string, email: string}  $dados
     * @param  bool  $assinanteConfirmado  true só quando o CRM confirmou assinatura ativa;
     *                                     sem confirmação (CRM fora do ar, erro) o texto fica neutro.
     */
    public function whatsappUrl(array $dados, bool $assinanteConfirmado = false): string
    {
        $tipo = $dados['tipo_documento'];

        $mensagem = implode("\n", [
            $assinanteConfirmado
                ? 'Olá! Sou assinante CAB e quero ver minha condição na parceria CAB + Raven.'
                : 'Olá! Quero saber mais sobre a parceria CAB + Raven.',
            '',
            ($tipo === 'cnpj' ? 'Razão social: ' : 'Nome: ').$dados['nome'],
            strtoupper($tipo).': '.DocumentoBrasileiro::formatar($tipo, $dados['documento']),
            'WhatsApp: '.$dados['whatsapp'],
            'E-mail: '.$dados['email'],
        ]);

        $numero = DocumentoBrasileiro::digitos((string) config('cab.cabraven.whatsapp'));

        return 'https://wa.me/'.$numero.'?text='.rawurlencode($mensagem);
    }
}
