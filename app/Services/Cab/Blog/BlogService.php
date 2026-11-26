<?php

namespace App\Services\Cab\Blog;

use App\Services\Cab\CabApiClient;
use App\Services\Cab\Events\EventsService;

class BlogService
{
    /** @var array<int, array<string, mixed>>|null */
    private ?array $postsCache = null;

    /** @var array<int, array<string, mixed>>|null */
    private ?array $categoriesCache = null;

    /** @var array<int, array<string, mixed>>|null */
    private ?array $columnistsCache = null;

    /** @var array<int, array<int, array<string, mixed>>> */
    private array $categoryPostsCache = [];

    /** @var array<int, array<int, array<string, mixed>>> */
    private array $columnistPostsCache = [];

    public function __construct(
        private CabApiClient $client,
        private BlogDataMapper $mapper,
        private EventsService $eventsService,
    ) {}

    public function isEnabled(): bool
    {
        return (bool) config('cab.enabled');
    }

    /**
     * @return array<string, mixed>
     */
    public function getIndexPageContent(): array
    {
        if (! $this->isEnabled()) {
            return $this->mapper->mapEmptyIndexPageContent();
        }

        $this->client->warm([
            (string) config('cab.endpoints.blog.posts'),
            (string) config('cab.endpoints.events'),
        ]);

        $columnists = config('cab.features.blog_columnists_enabled')
            ? $this->getColumnists()
            : [];

        $content = $this->mapper->mapIndexPageContent(
            $this->orderedIndexPosts(),
            $columnists,
        );

        $content['upcomingEvents'] = $this->getUpcomingEventsPreview(3);

        return $content;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getUpcomingEventsPreview(int $limit = 3): array
    {
        if (! $this->eventsService->isConfigured()) {
            return [];
        }

        return $this->eventsService->listUpcoming($limit);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getPostBySlug(string $slug): ?array
    {
        if (! $this->isEnabled()) {
            return null;
        }

        foreach ($this->getPosts() as $post) {
            if (($post['slug'] ?? null) === $slug) {
                return $this->mapper->mapPost($post, $this->getPosts());
            }
        }

        return null;
    }

    /**
     * @return array<int, array{path: string, lastmod: string|null}>
     */
    public function listPostsForSitemap(): array
    {
        if (! $this->isEnabled()) {
            return [];
        }

        $entries = [];

        foreach ($this->getPosts() as $post) {
            $slug = trim((string) ($post['slug'] ?? ''));

            if ($slug === '') {
                continue;
            }

            $categorySlug = '';

            if (is_array($post['category'] ?? null)) {
                $categorySlug = trim((string) ($post['category']['slug'] ?? ''));
            }

            if ($categorySlug === 'eventos') {
                continue;
            }

            $lastmod = trim((string) ($post['updated_at'] ?? $post['published_at'] ?? ''));

            $entries[] = [
                'path' => '/blog/'.$slug,
                'lastmod' => $lastmod !== '' ? $lastmod : null,
            ];
        }

        return $entries;
    }

    /**
     * @return array<string, mixed>
     */
    public function getCategoryPageData(string $routeName): array
    {
        if ($routeName === 'blog.events') {
            $category = null;

            if ($this->isEnabled()) {
                $categorySlugs = config('cab.blog_category_slugs', []);
                $categorySlug = $categorySlugs['blog.events'] ?? 'eventos';
                $category = $this->findCategoryBySlug($categorySlug);
            }

            return $this->buildEventsCategoryPageFromApi($category);
        }

        if (! $this->isEnabled()) {
            return $this->emptyCategoryForRoute($routeName);
        }

        $categorySlugs = config('cab.blog_category_slugs', []);
        $categorySlug = $categorySlugs[$routeName] ?? null;

        if ($categorySlug === null) {
            return $this->emptyCategoryForRoute($routeName);
        }

        $category = $this->findCategoryBySlug($categorySlug);

        if ($category === null) {
            return $this->emptyCategoryForRoute($routeName, $categorySlug);
        }

        $posts = $this->orderedCategoryPosts($category);

        $mapped = $this->mapper->mapCategoryPage($category, $posts);

        return $this->enrichCategorySeo($routeName, $mapped);
    }

    /**
     * Completa nome/descrição SEO com metadados locais quando a API não envia texto útil.
     *
     * @param  array<string, mixed>  $mapped
     * @return array<string, mixed>
     */
    private function enrichCategorySeo(string $routeName, array $mapped): array
    {
        $categoryMeta = config('cab.blog_category_meta', []);
        $meta = is_array($categoryMeta) ? ($categoryMeta[$routeName] ?? null) : null;

        if (! is_array($meta)) {
            return $mapped;
        }

        if (trim((string) ($mapped['description'] ?? '')) === '' && isset($meta['description'])) {
            $mapped['description'] = (string) $meta['description'];
        }

        if (trim((string) ($mapped['name'] ?? '')) === '' && isset($meta['name'])) {
            $mapped['name'] = (string) $meta['name'];
        }

        return $mapped;
    }

    /**
     * @param  array<string, mixed>|null  $category
     * @return array<string, mixed>
     */
    private function buildEventsCategoryPageFromApi(?array $category): array
    {
        $perPage = (int) config('cab.blog_pagination.category_grid_per_page', 6);
        $categoryMeta = config('cab.blog_category_meta', []);
        $eventsMeta = is_array($categoryMeta) ? ($categoryMeta['blog.events'] ?? null) : null;
        $name = (string) ($category['name'] ?? (is_array($eventsMeta) ? ($eventsMeta['name'] ?? 'Eventos') : 'Eventos'));
        $description = (string) ($category['description'] ?? '');

        if ($description === '' && is_array($eventsMeta)) {
            $description = (string) ($eventsMeta['description'] ?? '');
        }

        $upcomingEvents = $this->eventsService->isConfigured()
            ? $this->eventsService->listUpcoming()
            : [];
        $pastEvents = $this->eventsService->isConfigured()
            ? $this->eventsService->listEnded()
            : [];
        $featuredEvent = $upcomingEvents[0] ?? $pastEvents[0] ?? null;

        return [
            'name' => $name,
            'description' => $description,
            'allCategoriesList' => $this->mapper->navigationCategories(),
            'featuredPost' => is_array($featuredEvent)
                ? $this->mapAgendaEventToFeaturedCard($featuredEvent)
                : null,
            'upcomingEvents' => $upcomingEvents,
            'pastEvents' => $pastEvents,
            'posts' => [],
            'postsPagination' => array_merge(
                $this->buildPaginationResponse(count($pastEvents), $perPage, 1),
                ['categorySlug' => 'eventos'],
            ),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getColumnistsPageData(): array
    {
        if (! $this->isEnabled()) {
            return [];
        }

        return $this->mapper->mapColumnistsPage(
            $this->getColumnists(),
            fn (int $columnistId) => $this->getColumnistPosts($columnistId),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getMoreIndexPosts(int $page): array
    {
        $headerCount = (int) config('cab.blog_pagination.index_header_count', 5);
        $perPage = (int) config('cab.blog_pagination.index_recent_per_page', 6);
        $recentSource = array_slice($this->orderedIndexPosts(), $headerCount);
        $offset = ($page - 1) * $perPage;
        $slice = array_slice($recentSource, $offset, $perPage);

        return [
            'posts' => $this->mapper->mapRecentCards($slice),
            'pagination' => $this->buildPaginationResponse(count($recentSource), $perPage, $page),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function getMoreCategoryPosts(string $categorySlug, int $page): array
    {
        $category = $this->findCategoryBySlug($categorySlug);

        if ($category === null) {
            return [
                'posts' => [],
                'pagination' => $this->buildPaginationResponse(0, 6, $page),
            ];
        }

        $perPage = (int) config('cab.blog_pagination.category_grid_per_page', 6);
        $posts = $this->orderedCategoryPosts($category);

        if ($categorySlug === 'eventos') {
            return [
                'posts' => [],
                'pagination' => $this->buildPaginationResponse(0, $perPage, $page),
            ];
        }

        $gridSource = array_slice($posts, 1);
        $offset = ($page - 1) * $perPage;
        $slice = array_slice($gridSource, $offset, $perPage);

        return [
            'posts' => $this->mapper->mapGridPosts($slice),
            'pagination' => $this->buildPaginationResponse(count($gridSource), $perPage, $page),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getSearchIndex(): array
    {
        if (! $this->isEnabled()) {
            return [];
        }

        return $this->mapper->mapSearchItems($this->getPosts());
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getCategorySearchIndex(string $routeName): array
    {
        if (! $this->isEnabled()) {
            return [];
        }

        $categorySlugs = config('cab.blog_category_slugs', []);
        $categorySlug = $categorySlugs[$routeName] ?? null;

        if ($categorySlug === null) {
            return [];
        }

        $category = $this->findCategoryBySlug($categorySlug);

        if ($category === null) {
            return [];
        }

        return $this->mapper->mapSearchItems(
            $this->orderedCategoryPosts($category),
        );
    }

    /**
     * Destaques por editoria para páginas de categoria (evita enviar o índice completo do portal).
     *
     * @return array<int, array<string, mixed>>
     */
    public function getCategoryPortalHighlights(string $routeName): array
    {
        if (! $this->isEnabled()) {
            return [];
        }

        return $this->mapper->buildCategoryHighlights(
            $this->mapper->navigationCategories(),
            $this->buildPortalHighlightSearchPool(),
            $this->computeCategoryHighlightedPostIds($routeName),
            3,
            $this->resolveHighlightSkipLinks($routeName),
        );
    }

    /**
     * Dados derivados do shell denso do índice (trending, feed inicial, destaques).
     *
     * @param  array<string, mixed>  $pageContent
     * @return array{trendingPosts: array<int, array<string, mixed>>, feedPreviewPosts: array<int, array<string, mixed>>, categoryHighlights: array<int, array<string, mixed>>}
     */
    public function getIndexShellData(array $pageContent): array
    {
        if (! $this->isEnabled()) {
            return [
                'trendingPosts' => [],
                'feedPreviewPosts' => [],
                'categoryHighlights' => [],
            ];
        }

        $searchIndex = $this->getSearchIndex();
        $mosaicIds = $this->computeIndexMosaicPostIds($pageContent);
        $trendingPosts = $this->mapper->buildTrendingPosts($searchIndex, $mosaicIds);
        $highlightedIds = array_values(array_unique([
            ...$mosaicIds,
            ...array_map(fn (array $post): int => (int) ($post['id'] ?? 0), $trendingPosts),
        ]));
        $feedPreviewPosts = $this->mapper->buildFeedPreviewPosts($searchIndex, $highlightedIds);
        $categoryHighlights = $this->mapper->buildCategoryHighlights(
            $pageContent['categories'] ?? [],
            $searchIndex,
            $highlightedIds,
        );

        return compact('trendingPosts', 'feedPreviewPosts', 'categoryHighlights');
    }

    /**
     * Dados derivados do shell denso de categoria (trending e feed inicial).
     *
     * @param  array<string, mixed>  $categoryData
     * @return array{trendingPosts: array<int, array<string, mixed>>, feedPreviewPosts: array<int, array<string, mixed>>}
     */
    public function getCategoryShellData(string $routeName, array $categoryData): array
    {
        if (! $this->isEnabled()) {
            return [
                'trendingPosts' => [],
                'feedPreviewPosts' => [],
            ];
        }

        $searchIndex = $this->getCategorySearchIndex($routeName);
        $mosaicIds = [];

        $featuredId = (int) ($categoryData['featuredPost']['id'] ?? 0);

        if ($featuredId > 0) {
            $mosaicIds[] = $featuredId;
        }

        $trendingPosts = $this->mapper->buildTrendingPosts($searchIndex, $mosaicIds);
        $highlightedIds = array_values(array_unique([
            ...$mosaicIds,
            ...array_map(fn (array $post): int => (int) ($post['id'] ?? 0), $trendingPosts),
        ]));
        $feedPreviewPosts = $this->mapper->buildFeedPreviewPosts($searchIndex, $highlightedIds);

        return compact('trendingPosts', 'feedPreviewPosts');
    }

    /**
     * Índice de busca sob demanda (não embutido no HTML inicial).
     *
     * @return array<int, array<string, mixed>>
     */
    public function getSearchIndexForContext(string $context, ?string $categoryRoute = null): array
    {
        if (! $this->isEnabled()) {
            return [];
        }

        if ($context === 'category' && $categoryRoute !== null) {
            return $this->getCategorySearchIndex($categoryRoute);
        }

        return $this->getSearchIndex();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function buildPortalHighlightSearchPool(): array
    {
        $pool = [];

        foreach ($this->mapper->navigationCategories() as $category) {
            $link = (string) ($category['link'] ?? '');

            if ($link === '') {
                continue;
            }

            $slug = trim(str_replace('/blog/', '', $link), '/');
            $categoryRecord = $this->findCategoryBySlug($slug);

            if ($categoryRecord === null) {
                continue;
            }

            $pool = array_merge(
                $pool,
                $this->mapper->mapSearchItems($this->getCategoryPosts((int) $categoryRecord['id'])),
            );
        }

        return $pool;
    }

    /**
     * @param  array<string, mixed>  $pageContent
     * @return array<int, int>
     */
    private function computeIndexMosaicPostIds(array $pageContent): array
    {
        $ids = [];

        $featuredId = (int) ($pageContent['featuredPost']['id'] ?? 0);

        if ($featuredId > 0) {
            $ids[] = $featuredId;
        }

        foreach (array_slice($pageContent['subFeaturedPosts'] ?? [], 0, 3) as $post) {
            $id = (int) ($post['id'] ?? 0);

            if ($id > 0) {
                $ids[] = $id;
            }
        }

        return array_values(array_unique($ids));
    }

    /**
     * @return array<int, int>
     */
    private function computeCategoryHighlightedPostIds(string $routeName): array
    {
        if ($routeName === 'blog.events') {
            return [];
        }

        $categorySearchIndex = $this->getCategorySearchIndex($routeName);

        if ($categorySearchIndex === []) {
            return [];
        }

        $excludedIds = [];
        $usedIds = [];
        $featuredId = (int) ($categorySearchIndex[0]['id'] ?? 0);

        if ($featuredId > 0) {
            $excludedIds[] = $featuredId;
            $usedIds[$featuredId] = true;
        }

        $radarCount = 0;

        foreach ($categorySearchIndex as $item) {
            $id = (int) ($item['id'] ?? 0);

            if ($id <= 0 || isset($usedIds[$id])) {
                continue;
            }

            if ($radarCount >= 4) {
                break;
            }

            $excludedIds[] = $id;
            $usedIds[$id] = true;
            $radarCount++;
        }

        $gridCount = 0;

        foreach ($categorySearchIndex as $item) {
            if ($gridCount >= 4) {
                break;
            }

            $id = (int) ($item['id'] ?? 0);

            if ($id <= 0 || isset($usedIds[$id])) {
                continue;
            }

            $excludedIds[] = $id;
            $usedIds[$id] = true;
            $gridCount++;
        }

        return array_values(array_unique($excludedIds));
    }

    /**
     * @return array<int, string>
     */
    private function resolveHighlightSkipLinks(string $routeName): array
    {
        if ($routeName === 'blog.events') {
            return ['/blog/eventos'];
        }

        $skipLinks = ['/blog', '/blog/eventos'];
        $activeLink = $this->resolveCategoryLinkForRoute($routeName);

        if ($activeLink !== null) {
            $skipLinks[] = $activeLink;
        }

        return $skipLinks;
    }

    private function resolveCategoryLinkForRoute(string $routeName): ?string
    {
        $categorySlugs = config('cab.blog_category_slugs', []);
        $categorySlug = $categorySlugs[$routeName] ?? null;

        if ($categorySlug === null) {
            return null;
        }

        $suffix = '/'.$categorySlug;

        foreach ($this->mapper->navigationCategories() as $category) {
            $link = (string) ($category['link'] ?? '');

            if ($link === $suffix || str_ends_with($link, $suffix)) {
                return $link;
            }
        }

        return '/blog/'.$categorySlug;
    }

    /**
     * Índice do portal: o destaque é a publicação mais recente do blog.
     *
     * @return array<int, array<string, mixed>>
     */
    private function orderedIndexPosts(): array
    {
        return $this->mapper->sortByPublishedAtDesc($this->getPosts());
    }

    /**
     * @param  array<string, mixed>  $category
     * @return array<int, array<string, mixed>>
     */
    private function orderedCategoryPosts(array $category): array
    {
        return $this->mapper->sortByPublishedAtDesc(
            $this->getCategoryPosts((int) ($category['id'] ?? 0)),
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getCategoryPosts(int $categoryId): array
    {
        if (! array_key_exists($categoryId, $this->categoryPostsCache)) {
            $this->categoryPostsCache[$categoryId] = $this->client->get(
                config('cab.endpoints.blog.category_filter'),
                ['category_id' => $categoryId],
            );
        }

        return $this->categoryPostsCache[$categoryId];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getColumnistPosts(int $columnistId): array
    {
        if (! array_key_exists($columnistId, $this->columnistPostsCache)) {
            $this->columnistPostsCache[$columnistId] = $this->client->get(
                config('cab.endpoints.blog.columnist_filter'),
                ['columnist_id' => $columnistId],
            );
        }

        return $this->columnistPostsCache[$columnistId];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getPosts(): array
    {
        if ($this->postsCache === null) {
            $this->postsCache = $this->client->get(config('cab.endpoints.blog.posts'));
        }

        return $this->postsCache;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getCategories(): array
    {
        if ($this->categoriesCache === null) {
            $this->categoriesCache = $this->client->get(config('cab.endpoints.blog.categories'));
        }

        return $this->categoriesCache;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getColumnists(): array
    {
        if ($this->columnistsCache === null) {
            $this->columnistsCache = $this->client->get(config('cab.endpoints.blog.columnists'));
        }

        return $this->columnistsCache;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function findCategoryBySlug(string $slug): ?array
    {
        foreach ($this->getCategories() as $category) {
            if (($category['slug'] ?? null) === $slug) {
                return $category;
            }
        }

        return null;
    }

    /**
     * @return array<string, mixed>
     */
    private function emptyCategoryForRoute(string $routeName, ?string $categorySlug = null): array
    {
        $categoryMeta = config('cab.blog_category_meta', []);
        $meta = is_array($categoryMeta) ? ($categoryMeta[$routeName] ?? null) : null;

        if (is_array($meta)) {
            return $this->mapper->mapEmptyCategoryPage(
                (string) ($meta['name'] ?? 'Blog'),
                (string) ($meta['description'] ?? ''),
                $categorySlug,
            );
        }

        $name = $categorySlug
            ? ucfirst(str_replace('-', ' ', $categorySlug))
            : 'Blog';

        return $this->mapper->mapEmptyCategoryPage($name, '', $categorySlug);
    }

    /**
     * @return array{page: int, perPage: int, total: int, hasMore: bool}
     */
    private function buildPaginationResponse(int $total, int $perPage, int $page): array
    {
        $loaded = $page * $perPage;

        return [
            'page' => $page,
            'perPage' => $perPage,
            'total' => $total,
            'hasMore' => $loaded < $total,
        ];
    }

    /**
     * @param  array<string, mixed>  $event
     * @return array<string, mixed>
     */
    private function mapAgendaEventToFeaturedCard(array $event): array
    {
        return [
            'id' => (int) ($event['id'] ?? 0),
            'title' => (string) ($event['title'] ?? ''),
            'excerpt' => (string) ($event['excerpt'] ?? ''),
            'category' => 'Eventos',
            'author' => 'CAB',
            'authorInitials' => 'CAB',
            'date' => (string) ($event['date'] ?? ''),
            'readTime' => '',
            'image' => (string) ($event['image'] ?? ''),
            'link' => (string) ($event['link'] ?? '/blog/eventos'),
        ];
    }
}
