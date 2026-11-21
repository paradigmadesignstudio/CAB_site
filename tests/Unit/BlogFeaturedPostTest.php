<?php

namespace Tests\Unit;

use App\Services\Cab\Blog\BlogDataMapper;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class BlogFeaturedPostTest extends TestCase
{
    #[Test]
    public function index_features_the_latest_publication_overall(): void
    {
        $mapper = new BlogDataMapper;

        $ordered = $mapper->sortByPublishedAtDesc([
            $this->blogPost(4, '2026-04-28 12:00:00', 'Matéria do Geral', null),
            $this->blogPost(10, '2026-06-26 10:00:00', 'Matéria mais recente', ['name' => 'Mercado do Automático']),
            $this->blogPost(3, '2026-03-01 08:00:00', 'Matéria anterior', null),
        ]);

        $content = $mapper->mapIndexPageContent($ordered, []);

        $this->assertSame(10, $content['featuredPost']['id']);
        $this->assertSame('Mercado do Automático', $content['featuredPost']['category']);
        $this->assertSame('Matéria mais recente', $content['featuredPost']['title']);
        $this->assertSame(4, $content['subFeaturedPosts'][0]['id']);
        $this->assertNotContains(10, array_column($content['subFeaturedPosts'], 'id'));
    }

    #[Test]
    public function category_features_the_latest_post_of_that_niche(): void
    {
        $mapper = new BlogDataMapper;

        $page = $mapper->mapCategoryPage(
            ['name' => 'Dicas', 'slug' => 'dicas', 'description' => 'Dicas da oficina'],
            $mapper->sortByPublishedAtDesc([
                $this->blogPost(1, '2024-01-01 00:00:00', 'Dica antiga', ['name' => 'Dicas']),
                $this->blogPost(2, '2025-07-17 09:00:00', 'Dica mais recente', ['name' => 'Dicas']),
            ]),
        );

        $this->assertSame(2, $page['featuredPost']['id']);
        $this->assertSame('Dica mais recente', $page['featuredPost']['title']);
        $this->assertSame(1, $page['posts'][0]['id']);
    }

    #[Test]
    public function posts_without_a_date_stay_behind_dated_publications(): void
    {
        $mapper = new BlogDataMapper;

        $sorted = $mapper->sortByPublishedAtDesc([
            $this->blogPost(99, null, 'Sem data', ['name' => 'Dicas']),
            $this->blogPost(2, '2025-01-01 00:00:00', 'Com data', ['name' => 'Dicas']),
        ]);

        $this->assertSame([2, 99], array_column($sorted, 'id'));
    }

    /**
     * @param  array<string, mixed>|null  $category
     * @return array<string, mixed>
     */
    private function blogPost(int $id, ?string $publishedAt, string $title, ?array $category): array
    {
        return [
            'id' => $id,
            'title' => $title,
            'slug' => 'post-'.$id,
            'excerpt' => '',
            'content' => '',
            'published_at' => $publishedAt,
            'category' => $category,
            'columnist' => null,
        ];
    }
}
