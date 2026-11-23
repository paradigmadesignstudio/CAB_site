<?php

/*
|--------------------------------------------------------------------------
| Integração com a API do portal CAB (CRM)
|--------------------------------------------------------------------------
*/

return [

    'enabled' => filter_var(env('CAB_API_ENABLED', false), FILTER_VALIDATE_BOOL),

    'base_url' => rtrim((string) env('CAB_API_BASE_URL', ''), '/'),

    'version' => env('CAB_API_VERSION', 'v1'),

    'timeout' => (int) env('CAB_API_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Endpoints
    |--------------------------------------------------------------------------
    |
    | Caminhos relativos são resolvidos a partir de base_url; URLs absolutas
    | são usadas como estão.
    |
    */
    'endpoints' => [
        'blog' => [
            'posts' => env('CAB_API_BLOG_POSTS', 'blog/materias'),
            'categories' => env('CAB_API_BLOG_CATEGORIES', 'blog/categorias'),
            'columnists' => env('CAB_API_BLOG_COLUMNISTS', 'blog/colunistas'),
            'category_filter' => env('CAB_API_BLOG_CATEGORY_FILTER', 'blog/materias?category_id={category_id}'),
            'columnist_filter' => env('CAB_API_BLOG_COLUMNIST_FILTER', 'blog/materias?columnist_id={columnist_id}'),
        ],
        'courses' => env('CAB_API_COURSES', 'courses'),
        'plans' => env('CAB_API_PLANS', 'plans'),
        'events' => env('CAB_API_EVENTS', 'eventos'),
        'hotsites' => env('CAB_API_HOTSITES', 'hotsites'),
        'platform_materials' => env('CAB_API_PLATFORM_MATERIALS', 'materiais'),
        'sponsors' => env(
            'CAB_API_SPONSORS',
            'https://crm.cambioautomaticodobrasil.com.br/api/app/patrocinadores',
        ),
        'newsletter' => env('CAB_API_NEWSLETTER', ''),
        'home_cta' => env('CAB_API_HOME_CTA', ''),
        'support_contact' => env('CAB_API_SUPPORT_CONTACT', ''),

        // Parceria CAB + Raven (/cabraven). Um POST só: o CRM responde se é
        // assinante ativo ou cria o lead. Vazio = todos vão para o WhatsApp.
        'cabraven' => env('CAB_API_CABRAVEN', ''),
    ],

    // Token das chamadas autenticadas ao CRM (Authorization: Bearer).
    // Mesma variável e mesmo valor no .env do CRM.
    'site_token' => (string) env('CAB_API_SITE_TOKEN', ''),

];
