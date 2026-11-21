<?php

namespace App\Jobs\Cab;

use App\Jobs\Cab\Concerns\LogsCabJobFailures;
use App\Services\Cab\Academy\AcademyMaterialLeadService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use RuntimeException;

class SubmitAcademyMaterialLeadJob implements ShouldQueue
{
    use LogsCabJobFailures;
    use Queueable;

    public int $tries = 5;

    /** @var list<int> */
    public array $backoff = [30, 60, 120, 300];

    public function __construct(
        public string $name,
        public string $email,
        public string $phone,
        public string $materialSlug,
        public string $materialTitle,
    ) {}

    public function handle(AcademyMaterialLeadService $materialLeadService): void
    {
        if (! $materialLeadService->submit(
            $this->name,
            $this->email,
            $this->phone,
            $this->materialSlug,
            $this->materialTitle,
        )) {
            throw new RuntimeException('Falha ao enviar lead de material gratuito para o CRM.');
        }
    }
}
