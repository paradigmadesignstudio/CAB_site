<?php

namespace App\Jobs\Cab;

use App\Jobs\Cab\Concerns\LogsCabJobFailures;
use App\Services\Cab\Newsletter\NewsletterSubscriptionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use RuntimeException;

class SubmitNewsletterSubscriptionJob implements ShouldQueue
{
    use LogsCabJobFailures;
    use Queueable;

    public int $tries = 5;

    /** @var list<int> */
    public array $backoff = [30, 60, 120, 300];

    public function __construct(
        public string $name,
        public string $email,
        public ?string $phone,
        public string $tipo,
    ) {}

    public function handle(NewsletterSubscriptionService $newsletterService): void
    {
        if (! $newsletterService->submit($this->name, $this->email, $this->phone, $this->tipo)) {
            throw new RuntimeException('Falha ao enviar inscrição de newsletter para o CRM.');
        }
    }
}
