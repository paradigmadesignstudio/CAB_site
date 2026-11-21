<?php

namespace Tests\Unit;

use App\Support\CabBrand;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CabBrandTest extends TestCase
{
    #[Test]
    public function it_inserts_word_joiners_around_cab_acronym(): void
    {
        $joiner = "\u{2060}";

        $this->assertSame(
            "Benefícios Exclusivos C{$joiner}.{$joiner}A{$joiner}.{$joiner}B{$joiner}.",
            CabBrand::shield('Benefícios Exclusivos C.A.B.'),
        );

        $this->assertSame(
            "Oficinas C{$joiner}A{$joiner}B assinante",
            CabBrand::shield('Oficinas CAB assinante'),
        );
    }
}
