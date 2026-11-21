<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Logos de parceiros
    |--------------------------------------------------------------------------
    |
    | Caminhos relativos da API → {base}/{prefix}/patrocinadores/... no CRM.
    |
    */
    'sponsors_media_base_url' => rtrim(
        (string) env('CAB_API_SPONSORS_MEDIA_BASE_URL', 'https://crm.cambioautomaticodobrasil.com.br'),
        '/',
    ),

    'sponsors_media_path_prefix' => env('CAB_API_SPONSORS_MEDIA_PATH_PREFIX', 'storage'),

    /*
    |--------------------------------------------------------------------------
    | Parceiros em destaque (ordem de exibição)
    |--------------------------------------------------------------------------
    |
    | IDs da API e/ou slugs (do nome). A posição na lista define a ordem.
    |
    */
    'featured_sponsor_order' => [],

    'featured_sponsor_slugs' => [],

];
