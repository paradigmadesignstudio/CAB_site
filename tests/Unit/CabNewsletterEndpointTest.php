<?php

namespace Tests\Unit;

use App\Support\CabNewsletterEndpoint;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CabNewsletterEndpointTest extends TestCase
{
    #[Test]
    public function it_uses_default_crm_url_when_endpoint_is_empty(): void
    {
        $this->assertSame(
            CabNewsletterEndpoint::DEFAULT_URL,
            CabNewsletterEndpoint::resolve(''),
        );
    }

    #[Test]
    public function it_uses_default_crm_url_when_endpoint_is_legacy_leads(): void
    {
        $this->assertSame(
            CabNewsletterEndpoint::DEFAULT_URL,
            CabNewsletterEndpoint::resolve('leads'),
        );
    }

    #[Test]
    public function it_keeps_absolute_urls_configured(): void
    {
        $customUrl = 'https://crm.example.com/api/newsletter';

        $this->assertSame($customUrl, CabNewsletterEndpoint::resolve($customUrl));
    }

    #[Test]
    public function it_falls_back_for_relative_paths(): void
    {
        $this->assertSame(
            CabNewsletterEndpoint::DEFAULT_URL,
            CabNewsletterEndpoint::resolve('site/leads'),
        );
    }
}
