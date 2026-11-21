<?php

return [

  /*
  |--------------------------------------------------------------------------
  | Dados cadastrais — documentos legais do site
  |--------------------------------------------------------------------------
  |
  | Mantenha estes dados atualizados. O CNPJ e o e-mail do encarregado (DPO)
  | podem ser sobrescritos via variáveis de ambiente em produção.
  |
  */

    'legal_name' => 'Câmbio Automático do Brasil Ltda.',
    'trade_name' => 'CAB — Câmbio Automático do Brasil',
    'cnpj' => env('LEGAL_COMPANY_CNPJ', '32.116.961/0001-52'),

    'address' => [
        'street' => 'Avenida Brasília, 1174',
        'district' => 'Vila Zanetti',
        'city' => 'São João da Boa Vista',
        'state' => 'SP',
        'zip' => '13870-590',
        'country' => 'Brasil',
    ],

    'contact_email' => env('LEGAL_CONTACT_EMAIL', 'contato@cambioautomaticodobrasil.com.br'),
    'dpo_email' => env('LEGAL_DPO_EMAIL', 'contato@cambioautomaticodobrasil.com.br'),
    'phone' => '(19) 3195-1112',
    'website' => env('APP_URL', 'https://novo.cambioautomaticodobrasil.com.br'),

    'crm_url' => 'https://crm.cambioautomaticodobrasil.com.br',

];
