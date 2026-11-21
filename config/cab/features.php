<?php

/*
|--------------------------------------------------------------------------
| Funcionalidades do site (liga/desliga seções)
|--------------------------------------------------------------------------
|
| Carregado em config('cab.features').
|
*/

return [

    'oficinas_enabled' => filter_var(env('OFICINAS_ENABLED', false), FILTER_VALIDATE_BOOL),

    'preview_routes_enabled' => filter_var(env('PREVIEW_ROUTES_ENABLED', false), FILTER_VALIDATE_BOOL),

    'blog_columnists_enabled' => filter_var(env('BLOG_COLUMNISTS_ENABLED', false), FILTER_VALIDATE_BOOL),

];
