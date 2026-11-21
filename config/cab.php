<?php

return array_merge(
    require __DIR__.'/cab/api.php',
    require __DIR__.'/cab/cache.php',
    ['features' => require __DIR__.'/cab/features.php'],
    require __DIR__.'/cab/forms.php',
    require __DIR__.'/cab/plans.php',
    require __DIR__.'/cab/blog.php',
    require __DIR__.'/cab/events.php',
    require __DIR__.'/cab/media.php',
    require __DIR__.'/cab/partners.php',
    require __DIR__.'/cab/seo.php',
    require __DIR__.'/cab/security.php',
    require __DIR__.'/cab/observability.php',
);
