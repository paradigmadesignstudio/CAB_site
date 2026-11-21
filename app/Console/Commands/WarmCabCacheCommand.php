<?php

namespace App\Console\Commands;

use App\Services\Cab\CabCacheWarmer;
use Illuminate\Console\Command;

class WarmCabCacheCommand extends Command
{
    protected $signature = 'cab:warm-cache';

    protected $description = 'Pré-carrega o cache das consultas GET ao CRM da CAB';

    public function handle(CabCacheWarmer $warmer): int
    {
        if (! config('cab.enabled')) {
            $this->warn('CAB API desabilitada (CAB_API_ENABLED=false). Nada a aquecer.');

            return self::SUCCESS;
        }

        $this->info('Aquecendo cache do CRM...');

        $startedAt = microtime(true);
        $sections = $warmer->warm();
        $elapsed = round(microtime(true) - $startedAt, 2);

        $this->info("Cache aquecido ({$sections} seções) em {$elapsed}s.");

        return self::SUCCESS;
    }
}
