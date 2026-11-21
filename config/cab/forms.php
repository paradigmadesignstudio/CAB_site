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

];
