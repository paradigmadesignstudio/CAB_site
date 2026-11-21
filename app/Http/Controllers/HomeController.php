<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHomeCtaRequest;
use App\Jobs\Cab\SubmitHomeCtaJob;
use App\Services\Cab\Events\EventsService;
use App\Services\Cab\Home\CtaLeadService;
use App\Services\Cab\Partners\SponsorsService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private CtaLeadService $ctaLeadService,
        private SponsorsService $sponsorsService,
        private EventsService $eventsService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('home/page', [
            'agendaEvents' => $this->homeAgendaEvents(),
            'sponsors' => Inertia::defer(function (): ?array {
                $sponsors = $this->sponsorsService->list();

                return $sponsors !== [] ? $sponsors : null;
            }, 'home'),
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>|null
     */
    private function homeAgendaEvents(): ?array
    {
        if (! $this->eventsService->isConfigured()) {
            return null;
        }

        $events = $this->eventsService->listForHome(5);

        return $events !== [] ? $events : null;
    }

    public function storeCta(StoreHomeCtaRequest $request): JsonResponse
    {
        if (! $this->ctaLeadService->isConfigured()) {
            return response()->json([
                'message' => 'Formulário temporariamente indisponível.',
            ], 503);
        }

        $validated = $request->validated();

        SubmitHomeCtaJob::dispatch(
            $validated['name'],
            $validated['phone'],
            $validated['email'],
        );

        return response()->json([
            'message' => 'Cadastro recebido com sucesso!',
        ]);
    }
}
