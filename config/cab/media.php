<?php

/*
|--------------------------------------------------------------------------
| Proxy de mídia (/media/{token})
|--------------------------------------------------------------------------
|
| Serve imagens do CRM pela própria origem do site (cache + derivados).
| Hosts de base_url, blog_media_base_url e sponsors_media_base_url são
| liberados automaticamente; acrescente outros em CAB_MEDIA_PROXY_ALLOWED_HOSTS.
|
*/

return [

    'media_proxy_enabled' => filter_var(env('CAB_MEDIA_PROXY_ENABLED', true), FILTER_VALIDATE_BOOL),

    'media_proxy_allowed_hosts' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env(
            'CAB_MEDIA_PROXY_ALLOWED_HOSTS',
            'crm.cambioautomaticodobrasil.com.br,hml.cambioautomaticodobrasil.com.br',
        )),
    ))),

    'media_proxy_timeout' => (int) env('CAB_MEDIA_PROXY_TIMEOUT', 15),

    'media_proxy_cache_seconds' => (int) env('CAB_MEDIA_PROXY_CACHE_SECONDS', 86400),

    // Largura do derivado servido na home (?w=); 0 desliga derivados.
    'media_proxy_home_width' => (int) env('CAB_MEDIA_PROXY_HOME_WIDTH', 1600),

];
