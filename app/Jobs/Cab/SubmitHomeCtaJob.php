<?php

namespace App\Jobs\Cab;

use App\Jobs\Cab\Concerns\LogsCabJobFailures;
use App\Services\Cab\Home\CtaLeadService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use RuntimeException;

class SubmitHomeCtaJob implements ShouldQueue
{
    use LogsCabJobFailures;
    use Queueable;

    public int $tries = 5;

    /** @var list<int> */
    public array $backoff = [30, 60, 120, 300];

    public function __construct(
        public string $name,
        public string $phone,
        public string $email,
    ) {}

    public function handle(CtaLeadService $ctaLeadService): void
    {
        if (! $ctaLeadService->submit($this->name, $this->phone, $this->email)) {
            throw new RuntimeException('Falha ao enviar lead CTA para o CRM.');
        }
    }
}
