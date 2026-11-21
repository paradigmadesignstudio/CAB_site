<?php

namespace App\Services\Cab\Home;

use App\Services\Cab\Newsletter\NewsletterSubscriptionService;
use App\Support\CabNewsletterEndpoint;

class CtaLeadService
{
    public function __construct(
        private NewsletterSubscriptionService $newsletterService,
    ) {}

    public function isConfigured(): bool
    {
        return (bool) config('cab.enabled')
            && CabNewsletterEndpoint::resolve(config('cab.endpoints.home_cta')) !== '';
    }

    public function submit(string $name, string $phone, string $email): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        return $this->newsletterService->submit(
            $name,
            $email,
            $phone,
            NewsletterSubscriptionService::TIPO_GERAL,
            (string) config('cab.endpoints.home_cta'),
        );
    }
}
