<?php

/*
|--------------------------------------------------------------------------
| Campos enviados nos POSTs de formulários para a API
|--------------------------------------------------------------------------
|
| Ajuste os nomes conforme o contrato da API externa.
|
*/

return [

    // Newsletter e CTA da home (POST nome, email, telefone?, tipo).
    'newsletter_payload_keys' => [
        'name' => env('CAB_API_NEWSLETTER_FIELD_NAME', 'nome'),
        'email' => env('CAB_API_NEWSLETTER_FIELD_EMAIL', 'email'),
        'phone' => env('CAB_API_NEWSLETTER_FIELD_PHONE', 'telefone'),
        'type' => env('CAB_API_NEWSLETTER_FIELD_TYPE', 'tipo'),
    ],

    // Campos extras do lead de materiais da Academia (somados aos da newsletter).
    'academy_material_payload_keys' => [
        'material' => env('CAB_API_ACADEMY_MATERIAL_FIELD_MATERIAL', 'material'),
        'material_slug' => env('CAB_API_ACADEMY_MATERIAL_FIELD_SLUG', 'material_slug'),
    ],

    // Formulário de contato (suporte).
    'support_contact_payload_keys' => [
        'name' => env('CAB_API_SUPPORT_CONTACT_FIELD_NAME', 'nome'),
        'email' => env('CAB_API_SUPPORT_CONTACT_FIELD_EMAIL', 'email'),
        'phone' => env('CAB_API_SUPPORT_CONTACT_FIELD_PHONE', 'telefone'),
        'subject' => env('CAB_API_SUPPORT_CONTACT_FIELD_SUBJECT', 'assunto'),
        'message' => env('CAB_API_SUPPORT_CONTACT_FIELD_MESSAGE', 'mensagem'),
    ],

    // Parceria CAB + Raven (/cabraven).
    'cabraven' => [
        // WhatsApp (DDI + DDD + número, só dígitos) que recebe o cadastro de quem já é cliente CAB.
        'whatsapp' => env('CAB_RAVEN_WHATSAPP', '5519971659055'),

        // Consulta de CNPJ (dados da Receita Federal), em ordem de tentativa. Placeholder {cnpj} = só dígitos.
        'cnpj_lookup_urls' => array_values(array_filter([
            env('CAB_RAVEN_CNPJ_LOOKUP_URL', 'https://brasilapi.com.br/api/cnpj/v1/{cnpj}'),
            env('CAB_RAVEN_CNPJ_LOOKUP_FALLBACK_URL', 'https://receitaws.com.br/v1/cnpj/{cnpj}'),
        ])),
    ],

];
