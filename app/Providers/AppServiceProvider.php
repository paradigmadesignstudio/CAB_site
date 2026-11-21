<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // SQLite não lida bem com cache de rate limiter na mesma base (database is locked).
        if (config('database.default') === 'sqlite' && config('cache.default') === 'database') {
            config(['cache.default' => 'file']);
        }
    }
}
