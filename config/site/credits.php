<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Créditos do site (assinatura no rodapé)
    |--------------------------------------------------------------------------
    |
    | Links exibidos à direita do footer ("by PDS and t4v").
    | Deixe href vazio para exibir o nome sem link até a URL ser definida.
    |
    */

    'prefix' => 'by',
    'conjunction' => 'and',

    'partners' => [
        [
            'label' => 'Paradigma Design Studio',
            'href' => env('SITE_CREDIT_PDS_URL', ''),
            'logo' => '/images/footer/pds-logo.png',
        ],
        [
            'label' => 'T4V',
            'href' => env('SITE_CREDIT_T4V_URL', ''),
            'logo' => '/images/footer/t4v-logo.png',
            'highlighted' => true,
        ],
    ],

];
