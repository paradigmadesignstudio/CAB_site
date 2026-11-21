<?php

return [

    /*
    |--------------------------------------------------------------------------
    | URL de inscrição/ingresso dos eventos
    |--------------------------------------------------------------------------
    |
    | Placeholders aceitos: {lp_slug}, {slug}, {id}. Vazio = usa o link
    | informado pela própria API.
    |
    */
    'events_ticket_url' => env('CAB_EVENTS_TICKET_URL', ''),

    /*
    |--------------------------------------------------------------------------
    | Slug da landing page por evento (quando difere do slug da API)
    |--------------------------------------------------------------------------
    |
    | Formato: 'slug-do-evento-na-api' => 'slug-da-lp'.
    |
    */
    'events_ticket_slug_overrides' => [
        '7o-congresso-da-cambio-automatico-do-brasil' => '7-congresso-cab',
    ],

];
