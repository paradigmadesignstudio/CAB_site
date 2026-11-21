<?php

/*
|--------------------------------------------------------------------------
| Observabilidade da integração CAB
|--------------------------------------------------------------------------
|
| Logs estruturados da API: storage/logs/cab-api.log (canal `cab`,
| configurado em config/logging.php via CAB_LOG_LEVEL / CAB_LOG_DAILY_DAYS).
|
*/

return [

    'observability' => [
        // /health faz ping na API quando habilitado.
        'health_ping_enabled' => filter_var(env('CAB_HEALTH_PING_ENABLED', false), FILTER_VALIDATE_BOOL),
        'health_ping_endpoint' => env('CAB_HEALTH_PING_ENDPOINT', 'blog/categorias'),
        'health_ping_timeout' => (int) env('CAB_HEALTH_PING_TIMEOUT', 5),
    ],

];
