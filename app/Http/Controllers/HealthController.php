<?php

namespace App\Http\Controllers;

use App\Services\Cab\CabHealthService;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function __construct(
        private CabHealthService $cabHealthService,
    ) {}

    public function show(): JsonResponse
    {
        $report = $this->cabHealthService->report();

        $statusCode = $report['status'] === 'degraded' ? 503 : 200;

        return response()->json($report, $statusCode);
    }
}
