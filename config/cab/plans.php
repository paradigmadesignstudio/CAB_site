<?php

return [

    /*
    |--------------------------------------------------------------------------
    | URL de cadastro (CTA dos cards de planos)
    |--------------------------------------------------------------------------
    */
    'plans_signup_url' => env('CAB_PLANS_SIGNUP_URL', ''),

    /*
    |--------------------------------------------------------------------------
    | Conteúdo estático sobreposto aos planos da API
    |--------------------------------------------------------------------------
    |
    | Chave = plataforma resolvida pelo título do plano na API
    | ('14' → 1.4, '20' → 2.0, '30' → 3.0 / 2.0T). Preços e benefícios
    | vêm da API; nome, descrição, destaques e CTA vêm daqui.
    |
    */
    'plans_overlays' => [
        '14' => [
            'column_label' => '1.4',
            'name' => 'Plataforma 1.4',
            'description' => 'Preventiva, Diálise de fluido, Diagnóstico preliminar',
            'features' => [
                'Treinamentos 01 ao 20',
                'APP Guia de Transmissões Completo',
                'Suporte Técnico via WhatsApp',
                '10% de Desconto em Cursos',
            ],
            'ecosystem_features' => [
                'Sistema de Gestão de Caixa',
                'Marketing Digital para Oficina',
            ],
            'popular' => false,
            'cta_text' => 'Detalhes do 1.4',
        ],
        '20' => [
            'column_label' => '2.0',
            'name' => 'Plataforma 2.0',
            'description' => 'Reforma e reparos profundos, Manuais e diagramas',
            'features' => [
                'Treinamentos 01 ao 38',
                'Diagramas Hidráulicos Avançados',
                'Suporte para diagnóstico, desmontagem e montagem das transmissões',
                '20% de Desconto em Cursos',
            ],
            'ecosystem_features' => [
                'Gestão Completa com ERP',
                'Módulo de Diagnóstico Raio-X',
                'Automação de Marketing',
            ],
            'popular' => false,
            'cta_text' => 'Conhecer o 2.0',
        ],
        '30' => [
            'column_label' => '3.0',
            'name' => 'Plataforma 3.0',
            'description' => 'Reforma e reparos profundos, Manuais e diagramas, Usinagem Sonnax',
            'features' => [
                'Mais de 80 Cursos de Câmbios',
                'Usinagem Avançada (Sonnax)',
                'Suporte para diagnóstico, desmontagem e montagem das transmissões',
                '50% de Desconto em Eventos',
            ],
            'ecosystem_features' => [
                'Gestão de Múltiplas Unidades',
                'Auditoria de Processos CAB',
                'Mestria em Vendas e Conversão',
            ],
            'popular' => true,
            'cta_text' => 'Explorar o 3.0',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Regras provisórias de plataforma por posição na lista de cursos (API)
    |--------------------------------------------------------------------------
    |
    | Primeiros N cursos → Plataforma 1.4; primeiros M → 2.0; todos → 3.0.
    | Ajuste quando a API passar a informar plataformas por curso.
    |
    */
    'plans_course_thresholds' => [
        'platform_14' => 20,
        'platform_20' => 38,
    ],

    /*
    |--------------------------------------------------------------------------
    | Materiais da plataforma (Academia CAB)
    |--------------------------------------------------------------------------
    */
    'academy_platform_materials_featured_count' => (int) env('CAB_ACADEMY_PLATFORM_MATERIALS_FEATURED_COUNT', 6),

    'academy_platform_materials_plans_link' => env(
        'CAB_ACADEMY_PLATFORM_MATERIALS_PLANS_LINK',
        'https://crm.cambioautomaticodobrasil.com.br/login-associado',
    ),

];
