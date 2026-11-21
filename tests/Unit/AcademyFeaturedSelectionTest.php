<?php

namespace Tests\Unit;

use App\Support\AcademyFeaturedSelection;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AcademyFeaturedSelectionTest extends TestCase
{
    #[Test]
    public function it_returns_up_to_the_requested_limit(): void
    {
        $items = [
            ['id' => 1],
            ['id' => 2],
            ['id' => 3],
            ['id' => 4],
        ];

        $picked = AcademyFeaturedSelection::pickRandom($items, 2);

        $this->assertCount(2, $picked);
    }

    #[Test]
    public function it_returns_empty_when_limit_is_zero(): void
    {
        $this->assertSame([], AcademyFeaturedSelection::pickRandom([['id' => 1]], 0));
    }
}
