<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class BlogJsonEndpointsTest extends TestCase
{
    #[Test]
    public function search_index_returns_empty_items_when_api_is_disabled(): void
    {
        config(['cab.enabled' => false]);

        $this->getJson('/blog/search-index?context=index')
            ->assertOk()
            ->assertJson(['items' => []]);
    }

    #[Test]
    public function load_more_accepts_first_page_when_archive_starts_empty(): void
    {
        config(['cab.enabled' => false]);

        $this->getJson('/blog/posts/load-more?context=index&page=1')
            ->assertOk()
            ->assertJsonPath('posts', [])
            ->assertJsonPath('pagination.page', 1);
    }

    #[Test]
    public function load_more_returns_empty_payload_when_api_is_disabled(): void
    {
        config(['cab.enabled' => false]);

        $this->getJson('/blog/posts/load-more?context=index&page=2')
            ->assertOk()
            ->assertJsonPath('posts', [])
            ->assertJsonPath('pagination.hasMore', false);
    }

    #[Test]
    public function trainings_table_endpoint_returns_empty_groups_when_api_is_disabled(): void
    {
        config(['cab.enabled' => false]);

        $this->getJson('/planos/treinamentos')
            ->assertOk()
            ->assertJson(['groups' => []]);
    }
}
