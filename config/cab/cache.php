<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cache de respostas GET da API (segundos; 0 = desligado)
    |--------------------------------------------------------------------------
    */
    'cache_ttl' => (int) env('CAB_API_CACHE_TTL', 600),

    /*
    |--------------------------------------------------------------------------
    | Cache de mocks locais (até integração API dedicada)
    |--------------------------------------------------------------------------
    */
    'academy_mock_cache_ttl' => (int) env('CAB_ACADEMY_MOCK_CACHE_TTL', 3600),

    /*
    |--------------------------------------------------------------------------
    | Cache do sitemap.xml (segundos; 0 = desligado)
    |--------------------------------------------------------------------------
    */
    'sitemap_cache_ttl' => (int) env('CAB_SITEMAP_CACHE_TTL', 3600),

];
