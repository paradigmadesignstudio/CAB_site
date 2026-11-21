<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Necessário atrás de Nginx/Cloudflare/ALB para HTTPS real e HSTS.
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            \App\Http\Middleware\AddSecurityHeaders::class,
            HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'preview' => \App\Http\Middleware\EnsurePreviewRoutesEnabled::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Página não encontrada.',
                ], 404);
            }

            return Inertia::render('errors/not-found/page', [
                'title' => 'Página não encontrada',
                'backHref' => '/',
                'backLabel' => 'Voltar para a home',
            ])->toResponse($request)->setStatusCode(404);
        });
    })->create();
