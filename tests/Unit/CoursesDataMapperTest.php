<?php

namespace Tests\Unit;

use App\Services\Cab\Plans\CoursesDataMapper;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CoursesDataMapperTest extends TestCase
{
    #[Test]
    public function it_maps_courses_with_platform_thresholds(): void
    {
        config([
            'cab.plans_course_thresholds.platform_14' => 2,
            'cab.plans_course_thresholds.platform_20' => 3,
        ]);

        $mapper = new CoursesDataMapper();

        $result = $mapper->mapTrainingsTable([
            ['id' => 3, 'nome' => 'Curso C', 'capa' => 'https://cdn.example.com/c.jpg', 'quantidade_aulas' => 12, 'idiomas' => ['Inglês']],
            ['id' => 1, 'nome' => 'Curso A', 'quantidade_aulas' => 8],
            ['id' => 2, 'nome' => 'Curso B', 'capa' => 'https://cdn.example.com/b.jpg', 'quantidade_aulas' => 5, 'idiomas' => []],
            ['id' => 4, 'nome' => 'Curso D', 'quantidade_aulas' => 3],
        ]);

        $rows = $result['groups'][0]['rows'];

        $this->assertSame(1, $rows[0]['id']);
        $this->assertSame('01', $rows[0]['n']);
        $this->assertSame('Curso A', $rows[0]['label']);
        $this->assertSame('bg-gradient-to-br from-primary to-[#0E55B0]', $rows[0]['image']);
        $this->assertSame(8, $rows[0]['lessonCount']);
        $this->assertSame(['Português'], $rows[0]['languages']);
        $this->assertTrue($rows[0]['p1']);
        $this->assertTrue($rows[0]['p2']);
        $this->assertTrue($rows[0]['p3']);

        $this->assertSame('02', $rows[1]['n']);
        $this->assertSame('https://cdn.example.com/b.jpg', $rows[1]['image']);
        $this->assertSame(5, $rows[1]['lessonCount']);
        $this->assertSame(['Português'], $rows[1]['languages']);
        $this->assertTrue($rows[1]['p1']);
        $this->assertTrue($rows[1]['p2']);

        $this->assertSame('03', $rows[2]['n']);
        $this->assertSame('https://cdn.example.com/c.jpg', $rows[2]['image']);
        $this->assertSame(12, $rows[2]['lessonCount']);
        $this->assertSame(['Inglês'], $rows[2]['languages']);
        $this->assertFalse($rows[2]['p1']);
        $this->assertTrue($rows[2]['p2']);

        $this->assertSame('04', $rows[3]['n']);
        $this->assertFalse($rows[3]['p1']);
        $this->assertFalse($rows[3]['p2']);
        $this->assertTrue($rows[3]['p3']);

        $this->assertSame(2, $result['planSummary'][0]['count']);
        $this->assertSame(3, $result['planSummary'][1]['count']);
        $this->assertSame(4, $result['planSummary'][2]['count']);
        $this->assertSame('+4 Treinamentos Online Incluídos', $result['title']);
    }
}
