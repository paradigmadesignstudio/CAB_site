<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCabRavenRequest;
use App\Services\Cab\CabRaven\CabRavenService;
use App\Support\DocumentoBrasileiro;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

/**
 * Landing da parceria CAB + Raven (clone de gestaoemrota.com.br/cabraven/cab.php).
 * Página fora do menu.
 *
 * Fluxo do pré-cadastro (um POST só ao CRM, que decide):
 *  - assinante CAB ativo     → abre o WhatsApp da equipe com os dados;
 *  - não é assinante ativo   → o CRM já cria o lead e a página mostra o sucesso;
 *  - CRM fora do ar, com erro
 *    ou não configurado      → WhatsApp, para nenhum cadastro se perder.
 */
class CabRavenController extends Controller
{
    public function __construct(
        private CabRavenService $service,
    ) {}

    public function index(): View
    {
        return view('cabraven');
    }

    /**
     * Preenchimento automático da razão social a partir do CNPJ (dados da Receita Federal).
     */
    public function cnpj(string $cnpj): JsonResponse
    {
        if (! DocumentoBrasileiro::cnpjValido($cnpj)) {
            return response()->json(['message' => 'CNPJ inválido.'], 422);
        }

        $resultado = $this->service->lookupCnpj($cnpj);

        if ($resultado === null) {
            return response()->json(['message' => 'Consulta à Receita Federal indisponível no momento.'], 503);
        }

        if ($resultado['status'] === 'not_found') {
            return response()->json(['message' => 'CNPJ não encontrado na Receita Federal.'], 404);
        }

        return response()->json([
            'razao_social' => $resultado['razao_social'],
            'nome_fantasia' => $resultado['nome_fantasia'],
            'situacao' => $resultado['situacao'],
        ]);
    }

    public function store(StoreCabRavenRequest $request): RedirectResponse
    {
        /** @var array{tipo_documento: string, nome: string, documento: string, whatsapp: string, email: string} $dados */
        $dados = $request->safe()->only(['tipo_documento', 'nome', 'documento', 'whatsapp', 'email']);

        $resultado = $this->service->submit($dados);

        // Sem dados pessoais no log: só o tipo de documento e o resultado.
        Log::channel('cab')->info('cabraven_pre_cadastro', [
            'tipo_documento' => $dados['tipo_documento'],
            'resultado' => $resultado ?? 'indefinido',
        ]);

        $redirect = redirect()->to(route('cabraven').'#cadastro');

        if ($resultado === 'lead') {
            return $redirect->with('cabraven_sucesso', true);
        }

        return $redirect->with('cabraven_whatsapp', $this->service->whatsappUrl($dados, $resultado === 'cliente'));
    }
}
