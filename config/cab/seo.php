<?php

return [

    'default_og_image' => env('CAB_DEFAULT_OG_IMAGE', '/images/carousel/cab_carousel_1.webp'),

    /*
    |--------------------------------------------------------------------------
    | robots.txt
    |--------------------------------------------------------------------------
    */
    'robots_disallow_paths' => [
        '/health',
        '/blog/posts/load-more',
        '/blog/search-index',
        '/planos/treinamentos',
    ],

    /*
    |--------------------------------------------------------------------------
    | Páginas estáticas do sitemap.xml
    |--------------------------------------------------------------------------
    |
    | Posts, eventos, parceiros e oficinas entram dinamicamente pela API.
    | '/oficinas' é omitida quando OFICINAS_ENABLED=false.
    |
    */
    'sitemap_static_pages' => [
        ['path' => '/', 'changefreq' => 'daily', 'priority' => '1.0'],
        ['path' => '/planos', 'changefreq' => 'weekly', 'priority' => '0.9'],
        ['path' => '/planos/ecossistema-integrado', 'changefreq' => 'monthly', 'priority' => '0.7'],
        ['path' => '/academia-cab', 'changefreq' => 'weekly', 'priority' => '0.8'],
        ['path' => '/blog', 'changefreq' => 'daily', 'priority' => '0.8'],
        ['path' => '/blog/eventos', 'changefreq' => 'weekly', 'priority' => '0.7'],
        ['path' => '/blog/artigos-tecnicos', 'changefreq' => 'weekly', 'priority' => '0.6'],
        ['path' => '/blog/hibridos-e-eletricos', 'changefreq' => 'weekly', 'priority' => '0.6'],
        ['path' => '/blog/dicas', 'changefreq' => 'weekly', 'priority' => '0.6'],
        ['path' => '/blog/mercado-do-automatico', 'changefreq' => 'weekly', 'priority' => '0.6'],
        ['path' => '/blog/marketing-para-oficinas', 'changefreq' => 'weekly', 'priority' => '0.6'],
        ['path' => '/parceiros', 'changefreq' => 'monthly', 'priority' => '0.7'],
        ['path' => '/oficinas', 'changefreq' => 'weekly', 'priority' => '0.7'],
        ['path' => '/sobre-nos', 'changefreq' => 'monthly', 'priority' => '0.6'],
        ['path' => '/suporte', 'changefreq' => 'monthly', 'priority' => '0.6'],
        ['path' => '/politica-de-privacidade', 'changefreq' => 'yearly', 'priority' => '0.2'],
        ['path' => '/termos-de-servico', 'changefreq' => 'yearly', 'priority' => '0.2'],
        ['path' => '/politica-de-cookies', 'changefreq' => 'yearly', 'priority' => '0.2'],
    ],

];
