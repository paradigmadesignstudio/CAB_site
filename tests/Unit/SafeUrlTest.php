<?php

namespace Tests\Unit;

use App\Support\SafeUrl;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SafeUrlTest extends TestCase
{
    #[Test]
    public function it_accepts_http_and_https_urls(): void
    {
        $this->assertSame('https://www.example.com/', SafeUrl::httpHttpsOnly('https://www.example.com/'));
        $this->assertSame('http://example.com/path', SafeUrl::httpHttpsOnly('http://example.com/path'));
    }

    #[Test]
    public function it_rejects_unsafe_schemes_and_invalid_urls(): void
    {
        $this->assertSame('', SafeUrl::httpHttpsOnly('javascript:alert(1)'));
        $this->assertSame('', SafeUrl::httpHttpsOnly('data:text/html,test'));
        $this->assertSame('', SafeUrl::httpHttpsOnly('not-a-url'));
        $this->assertSame('', SafeUrl::httpHttpsOnly(''));
        $this->assertSame('', SafeUrl::httpHttpsOnly(null));
    }
}
