<?php

/*
|--------------------------------------------------------------------------
| Cabeçalhos de segurança (middleware AddSecurityHeaders)
|--------------------------------------------------------------------------
|
| Hosts da API/CRM (base_url, mídia, endpoints) entram automaticamente em
| connect-src. O servidor do Vite (public/hot) só é liberado em local.
|
*/

return [

    'x_frame_options' => env('CAB_X_FRAME_OPTIONS', 'DENY'),

    'referrer_policy' => env('CAB_REFERRER_POLICY', 'strict-origin-when-cross-origin'),

    'permissions_policy' => env('CAB_PERMISSIONS_POLICY', 'camera=(), microphone=(), geolocation=()'),

    'cross_origin_opener_policy' => env('CAB_CROSS_ORIGIN_OPENER_POLICY', 'same-origin-allow-popups'),

    'cross_origin_resource_policy' => env('CAB_CROSS_ORIGIN_RESOURCE_POLICY', 'cross-origin'),

    'x_permitted_cross_domain_policies' => env('CAB_X_PERMITTED_CROSS_DOMAIN_POLICIES', 'none'),

    'csp_enabled' => filter_var(env('CAB_CSP_ENABLED', true), FILTER_VALIDATE_BOOL),

    // Arquivo "hot" do Vite (vazio = public/hot).
    'vite_hot_file' => env('CAB_VITE_HOT_FILE', ''),

    'csp_directives' => [
        'default-src' => ["'self'"],
        'base-uri' => ["'self'"],
        'object-src' => ["'none'"],
        'frame-ancestors' => ["'none'"],
        'form-action' => ["'self'", 'https://www.facebook.com'],
        'script-src' => [
            "'self'",
            "'unsafe-inline'",
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
            'https://www.google.com',
            'https://www.gstatic.com',
            'https://googleads.g.doubleclick.net',
            'https://connect.facebook.net',
            'https://d335luupugsy2.cloudfront.net',
            'https://d1sag09wwfbul8.cloudfront.net',
            'https://popups.rdstation.com.br',
            // Selo Reclame Aqui (raichu-beta/ra-verified/bundle.js).
            'https://s3.amazonaws.com',
        ],
        'style-src' => [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
            'https://d335luupugsy2.cloudfront.net',
            'https://popups.rdstation.com.br',
            'https://s3.amazonaws.com',
        ],
        'font-src' => [
            "'self'",
            'data:',
            'https://fonts.gstatic.com',
        ],
        'img-src' => [
            "'self'",
            'data:',
            'blob:',
            'https:',
        ],
        'connect-src' => [
            "'self'",
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
            'https://*.google-analytics.com',
            'https://analytics.google.com',
            'https://*.analytics.google.com',
            'https://www.google.com',
            'https://googleads.g.doubleclick.net',
            'https://ad.doubleclick.net',
            'https://stats.g.doubleclick.net',
            'https://www.facebook.com',
            'https://connect.facebook.net',
            'https://d335luupugsy2.cloudfront.net',
            'https://d1sag09wwfbul8.cloudfront.net',
            'https://popups.rdstation.com.br',
            'https://pageview-notify.rdstation.com.br',
            'https://mpc-prod-23-s6uit34pua-ue.a.run.app',
            'https://5z-2b6b7616f94640c2840d1841e1ac24c3.ecs.us-east-1.on.aws',
            'https://s3.amazonaws.com',
            'https://api.reclameaqui.com.br',
            'https://tiles.openfreemap.org',
            'https://basemaps.cartocdn.com',
            'https://nominatim.openstreetmap.org',
        ],
        'frame-src' => [
            "'self'",
            'https://www.googletagmanager.com',
            'https://www.google.com',
            'https://www.youtube.com',
            'https://www.youtube-nocookie.com',
            'https://player.vimeo.com',
            'https://www.facebook.com',
            'https://td.doubleclick.net',
            'https://popups.rdstation.com.br',
            'https://*.reclameaqui.com.br',
        ],
        'worker-src' => ["'self'", 'blob:'],
        'media-src' => ["'self'", 'https:'],
    ],

];
