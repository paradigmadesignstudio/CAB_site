<?php

namespace Tests\Unit;

use App\Services\Site\PageContentService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PageContentServicePlansTest extends TestCase
{
    #[Test]
    public function plans_static_content_injects_signup_url_from_config(): void
    {
        config([
            'cab.plans_signup_url' => 'https://crm.example.com/cadastro',
        ]);

        $content = app(PageContentService::class)->plans();

        $this->assertCount(3, $content['plans']);

        foreach ($content['plans'] as $plan) {
            $this->assertSame('https://crm.example.com/cadastro', $plan['href']);
        }

        $this->assertSame('https://crm.example.com/cadastro', $content['finalCta']['link']);
    }
}
