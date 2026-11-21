<?php

namespace App\Jobs\Cab\Concerns;

use Illuminate\Support\Facades\Log;
use Throwable;

trait LogsCabJobFailures
{
    public function failed(?Throwable $exception): void
    {
        Log::channel('cab')->error('form_submission_failed', [
            'job' => static::class,
            'message' => $exception?->getMessage(),
        ]);
    }
}
