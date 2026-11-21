<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class GoogleTagManagerTest extends TestCase
{
    #[Test]
    public function home_page_includes_google_tag_manager_when_configured(): void
    {
        config(['site.analytics.gtm_container_id' => 'GTM-N3W9TK6']);

        $this->get('/')
            ->assertOk()
            ->assertSee('GTM-N3W9TK6', false)
            ->assertSee('googletagmanager.com/gtm.js', false)
            ->assertSee('googletagmanager.com/ns.html?id=GTM-N3W9TK6', false);
    }

    #[Test]
    public function home_page_omits_google_tag_manager_when_not_configured(): void
    {
        config(['site.analytics.gtm_container_id' => '']);

        $this->get('/')
            ->assertOk()
            ->assertDontSee('googletagmanager.com/gtm.js', false);
    }
}
