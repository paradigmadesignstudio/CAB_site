<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupportContactRequest;
use App\Jobs\Cab\SubmitSupportContactJob;
use App\Services\Cab\Support\SupportContactService;
use App\Services\Site\PageContentService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class SupportController extends Controller
{
    public function __construct(
        private SupportContactService $supportContactService,
        private PageContentService $pageContentService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('support/page', $this->pageContentService->support());
    }

    public function storeContact(StoreSupportContactRequest $request): JsonResponse
    {
        if (! $this->supportContactService->isConfigured()) {
            return response()->json([
                'message' => 'Formulário temporariamente indisponível.',
            ], 503);
        }

        $validated = $request->validated();

        SubmitSupportContactJob::dispatch(
            $validated['name'],
            $validated['email'],
            $validated['phone'] ?? null,
            $validated['subject'],
            $validated['message'],
        );

        return response()->json([
            'message' => 'Mensagem recebida com sucesso! Responderemos em breve.',
        ]);
    }
}
