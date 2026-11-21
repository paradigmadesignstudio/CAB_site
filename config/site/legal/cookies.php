<?php

return [
    'slug' => 'politica-de-cookies',
    'meta' => [
        'title' => 'Política de Cookies | CAB',
        'description' => 'Entenda como a CAB utiliza cookies e tecnologias similares em seu site institucional.',
    ],
    'heading' => 'Política de Cookies',
    'lastUpdated' => '2026-07-01',
    'summary' => 'Esta Política descreve o que são cookies, quais utilizamos neste site, para quais finalidades e como você pode gerenciá-los.',
    'sections' => [
        [
            'title' => '1. O que são cookies e tecnologias similares',
            'paragraphs' => [
                'Cookies são pequenos arquivos de texto armazenados no seu navegador ou dispositivo quando você visita um site. Eles permitem reconhecer o navegador, memorizar preferências, manter sessões ativas e coletar informações sobre a forma de uso da página.',
                'Tecnologias similares incluem local storage, session storage, pixels, tags e identificadores de dispositivo, que podem desempenhar funções parecidas às dos cookies.',
                'Esta Política deve ser lida em conjunto com a Política de Privacidade da Câmbio Automático do Brasil Ltda. (“CAB”).',
            ],
        ],
        [
            'title' => '2. Quem é responsável',
            'paragraphs' => [
                'A controladora responsável pelo tratamento de dados relacionados a cookies neste site é a Câmbio Automático do Brasil Ltda., CNPJ nº 32.116.961/0001-52, com sede na Avenida Brasília, 1174, Vila Zanetti, São João da Boa Vista/SP, CEP 13870-590.',
            ],
        ],
        [
            'title' => '3. Como utilizamos cookies',
            'paragraphs' => [
                'Utilizamos cookies e tecnologias similares para finalidades estritamente relacionadas ao funcionamento, segurança e melhoria da experiência de navegação neste site institucional.',
                'No momento da publicação desta Política, não utilizamos cookies de marketing ou publicidade comportamental de terceiros (como Meta Pixel ou Google Ads) no site institucional. Caso passemos a utilizá-los, esta Política será atualizada e, quando exigido, solicitaremos o consentimento prévio.',
            ],
        ],
        [
            'title' => '4. Categorias de cookies',
            'subsections' => [
                [
                    'title' => '4.1. Cookies estritamente necessários (essenciais)',
                    'paragraphs' => [
                        'São indispensáveis para o funcionamento do site, segurança e prevenção a fraudes. Sem eles, serviços básicos — como envio seguro de formulários e manutenção de sessão — podem não funcionar corretamente.',
                        'Base legal: legítimo interesse (art. 7º, IX, da LGPD) e, quando aplicável, execução de procedimentos necessários ao serviço solicitado (art. 7º, V). Para cookies essenciais, o consentimento prévio não é exigido, conforme orientações da ANPD para cookies indispensáveis.',
                    ],
                ],
                [
                    'title' => '4.2. Cookies de funcionalidade',
                    'paragraphs' => [
                        'Permitem lembrar preferências e melhorar a experiência de navegação, como estado de componentes da interface.',
                        'Base legal: legítimo interesse ou consentimento, conforme a natureza da funcionalidade.',
                    ],
                ],
                [
                    'title' => '4.3. Cookies de terceiros',
                    'paragraphs' => [
                        'São definidos por serviços externos incorporados ao site. Somente são carregados quando você interage com o recurso correspondente ou quando o componente é exibido.',
                        'Base legal: legítimo interesse e/ou consentimento, conforme o caso e a legislação aplicável.',
                    ],
                ],
            ],
        ],
        [
            'title' => '5. Cookies e tecnologias utilizados neste site',
            'paragraphs' => [
                'A tabela abaixo descreve os principais cookies e tecnologias identificados no site institucional da CAB na data desta Política:',
            ],
            'cookies' => [
                [
                    'name' => 'Cookie de sessão da aplicação (ex.: laravel_session)',
                    'provider' => 'CAB / infraestrutura do site',
                    'type' => 'Estritamente necessário',
                    'purpose' => 'Manter a sessão do usuário, associar requisições e permitir o funcionamento seguro da aplicação.',
                    'duration' => 'Sessão ou conforme configuração do servidor (geralmente até encerrar o navegador ou expirar a sessão).',
                ],
                [
                    'name' => 'XSRF-TOKEN (ou equivalente de proteção CSRF)',
                    'provider' => 'CAB / infraestrutura do site',
                    'type' => 'Estritamente necessário',
                    'purpose' => 'Proteger formulários e requisições contra ataques de falsificação entre sites (CSRF).',
                    'duration' => 'Sessão ou prazo técnico definido pela aplicação.',
                ],
                [
                    'name' => 'Cookies e armazenamentos do selo Reclame Aqui',
                    'provider' => 'Reclame Aqui / Amazon S3 (script ra-embed-verified-seal)',
                    'type' => 'Terceiros / funcionalidade',
                    'purpose' => 'Exibir o selo de verificação da empresa no rodapé do site.',
                    'duration' => 'Conforme política do Reclame Aqui e do navegador.',
                ],
                [
                    'name' => 'Requisições a provedores de mapas (OpenFreeMap / OpenStreetMap)',
                    'provider' => 'OpenFreeMap e provedores de tiles cartográficos',
                    'type' => 'Terceiros / funcionalidade',
                    'purpose' => 'Carregar mapa interativo na página de contato quando você opta por visualizá-lo.',
                    'duration' => 'Conforme política dos provedores; geralmente logs técnicos de acesso.',
                ],
            ],
            'note' => 'Nomes exatos de cookies de sessão podem variar conforme configuração do ambiente (produção, homologação) e atualizações da aplicação.',
        ],
        [
            'title' => '6. Base legal para o uso de cookies',
            'paragraphs' => [
                'O tratamento de dados pessoais associado a cookies observa a LGPD (Lei nº 13.709/2018) e as orientações da Autoridade Nacional de Proteção de Dados (ANPD).',
                'Cookies estritamente necessários são utilizados com fundamento no legítimo interesse e na necessidade técnica de prestação do serviço solicitado.',
                'Cookies não essenciais, quando implementados futuramente, serão utilizados mediante base legal adequada, incluindo consentimento quando exigido.',
            ],
        ],
        [
            'title' => '7. Como gerenciar ou desativar cookies',
            'paragraphs' => [
                'Você pode controlar ou excluir cookies por meio das configurações do seu navegador. A maioria dos navegadores permite:',
            ],
            'list' => [
                'Bloquear todos os cookies.',
                'Bloquear apenas cookies de terceiros.',
                'Excluir cookies já armazenados.',
                'Receber alertas antes do armazenamento de cookies.',
            ],
            'note' => 'A desativação de cookies essenciais pode afetar o funcionamento de formulários, sessões e recursos de segurança do site. Consulte a seção de ajuda do seu navegador (Chrome, Firefox, Safari, Edge, entre outros) para instruções específicas.',
        ],
        [
            'title' => '8. “Do Not Track” e sinais de privacidade',
            'paragraphs' => [
                'Alguns navegadores oferecem mecanismos de sinalização de privacidade, como o “Do Not Track” (DNT). Atualmente, não há consenso legal obrigatório sobre a resposta a esses sinais no Brasil. A CAB monitora evoluções regulatórias e poderá adaptar suas práticas conforme orientações da ANPD.',
            ],
        ],
        [
            'title' => '9. Atualizações desta Política',
            'paragraphs' => [
                'Esta Política de Cookies pode ser alterada para refletir mudanças tecnológicas, legais ou operacionais. A data da última atualização será indicada no topo desta página.',
                'Recomendamos revisitar este documento periodicamente.',
            ],
        ],
        [
            'title' => '10. Contato',
            'paragraphs' => [
                'Para dúvidas sobre cookies ou exercício de direitos relacionados à privacidade:',
            ],
            'list' => [
                'E-mail: contato@cambioautomaticodobrasil.com.br',
                'Encarregado (DPO): contato@cambioautomaticodobrasil.com.br',
                'Endereço: Avenida Brasília, 1174, Vila Zanetti, São João da Boa Vista/SP, CEP 13870-590',
            ],
        ],
    ],
];
