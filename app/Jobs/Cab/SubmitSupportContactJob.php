<?php

namespace App\Jobs\Cab;

use App\Jobs\Cab\Concerns\LogsCabJobFailures;
use App\Services\Cab\Support\SupportContactService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use RuntimeException;

class SubmitSupportContactJob implements ShouldQueue
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
        public string $subject,
        public string $message,
    ) {}

    public function handle(SupportContactService $supportContactService): void
    {
        if (! $supportContactService->submit(
            $this->name,
            $this->email,
            $this->phone,
            $this->subject,
            $this->message,
        )) {
            throw new RuntimeException('Falha ao enviar contato de suporte para o CRM.');
        }
    }
}
