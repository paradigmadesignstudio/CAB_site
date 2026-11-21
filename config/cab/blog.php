<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Mapeamento de rotas do blog para slugs de categorias na API
    |--------------------------------------------------------------------------
    |
    | Quando o valor for null, a página usa metadados locais (nome/descrição)
    | e exibe estado vazio até a categoria existir na API.
    |
    */
    'blog_category_slugs' => [
        'blog.technical-articles' => 'artigos-tecnicos',
        'blog.eletric-hybrid' => 'hibridos-e-eletricos',
        'blog.tips' => 'dicas',
        'blog.automatic-market' => 'mercado-do-automatico',
        'blog.marketing-workshops' => 'marketing-para-oficinas',
        'blog.events' => 'eventos',
    ],

    /*
    |--------------------------------------------------------------------------
    | Metadados de categorias (nome/descrição locais)
    |--------------------------------------------------------------------------
    */
    'blog_category_meta' => [
        'blog.events' => [
            'name' => 'Eventos',
            'description' => 'Fique por dentro de todos os treinamentos presenciais, palestras e congressos da CAB. Acompanhe as datas e garanta sua vaga na elite do setor.',
        ],
        'blog.technical-articles' => [
            'name' => 'Artigos Técnicos',
            'description' => 'Aprofunde seu conhecimento com guias detalhados, boletins de falhas e procedimentos passo a passo desenvolvidos pelos mestres da transmissão automática.',
        ],
        'blog.eletric-hybrid' => [
            'name' => 'Híbridos e Elétricos',
            'description' => 'O futuro já está na sua rampa. Prepare sua oficina para diagnosticar, reparar e faturar com a nova geração de veículos eletrificados com total segurança.',
        ],
        'blog.tips' => [
            'name' => 'Dicas',
            'description' => 'Pequenas sacadas, grandes resultados. Truques de bancada, diagnósticos rápidos e conselhos práticos para o dia a dia da manutenção de transmissões.',
        ],
        'blog.automatic-market' => [
            'name' => 'Mercado do Automático',
            'description' => 'Análises de tendências, escassez de peças, comportamento das montadoras e oportunidades de negócios para oficinas de transmissões.',
        ],
        'blog.marketing-workshops' => [
            'name' => 'Marketing para Oficinas',
            'description' => 'Aprenda a atrair os clientes certos, precificar seus serviços com lucro real e transformar sua oficina em uma referência comercial na sua região.',
        ],
    ],

    'blog_pagination' => [
        'index_header_count' => 5,
        'index_recent_per_page' => 6,
        'category_grid_per_page' => 6,
    ],

    /*
    |--------------------------------------------------------------------------
    | Base pública das capas do blog
    |--------------------------------------------------------------------------
    |
    | A API pode retornar featured_image_url apontando para o HML; algumas
    | mídias (ex.: eventos em .webp) só existem no CRM.
    |
    */
    'blog_media_base_url' => rtrim(
        (string) env('CAB_API_BLOG_MEDIA_BASE_URL', 'https://crm.cambioautomaticodobrasil.com.br'),
        '/',
    ),

];
