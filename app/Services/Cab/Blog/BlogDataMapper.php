<?php

namespace App\Services\Cab\Blog;

use App\Support\CabMediaUrl;

class BlogDataMapper
{
    private const DEFAULT_IMAGE = 'bg-gradient-to-br from-primary to-[#0E55B0]';

    private const MONTHS = [
        1 => 'Janeiro',
        2 => 'Fevereiro',
        3 => 'Março',
        4 => 'Abril',
        5 => 'Maio',
        6 => 'Junho',
        7 => 'Julho',
        8 => 'Agosto',
        9 => 'Setembro',
        10 => 'Outubro',
        11 => 'Novembro',
        12 => 'Dezembro',
    ];

    /**
     * Mais recentes primeiro. Publicações sem data ficam no fim; empate usa o id maior.
     *
     * @param  array<int, array<string, mixed>>  $posts
     * @return array<int, array<string, mixed>>
     */
    public function sortByPublishedAtDesc(array $posts): array
    {
        usort($posts, function (array $left, array $right): int {
            $byDate = $this->publishedAtTimestamp($right) <=> $this->publishedAtTimestamp($left);

            if ($byDate !== 0) {
                return $byDate;
            }

            return ((int) ($right['id'] ?? 0)) <=> ((int) ($left['id'] ?? 0));
        });

        return array_values($posts);
    }

    /**
     * @param  array<int, array<string, mixed>>  $posts
     * @param  array<int, array<string, mixed>>  $columnists
     * @return array<string, mixed>
     */
    public function mapIndexPageContent(array $posts, array $columnists): array
    {
        $headerCount = (int) config('cab.blog_pagination.index_header_count', 5);
        $perPage = (int) config('cab.blog_pagination.index_recent_per_page', 6);

        $featuredPost = isset($posts[0]) ? $this->mapFeaturedCard($posts[0]) : null;
        $subFeaturedPosts = array_values(array_map(
            fn (array $post) => $this->mapSubFeaturedCard($post),
            array_slice($posts, 1, 4),
        ));

        $recentSource = array_slice($posts, $headerCount);
        $recentPosts = array_values(array_map(
            fn (array $post) => $this->mapRecentCard($post),
            array_slice($recentSource, 0, $perPage),
        ));

        return [
            'meta' => [
                'title' => 'Blog CAB | Transmissão automática, dicas e mercado',
                'description' => 'Artigos técnicos, dicas de bancada, eventos e tendências do mercado de transmissão automática para oficinas e mecânicos especializados.',
            ],
            'defaultCategory' => 'Geral',
            'categories' => $this->navigationCategories(),
            'featuredPost' => $featuredPost,
            'subFeaturedPosts' => $subFeaturedPosts,
            'recentPosts' => $recentPosts,
            'recentPagination' => $this->buildPagination(count($recentSource), $perPage),
            'columnists' => array_values(array_map(
                fn (array $columnist) => [
                    'name' => (string) ($columnist['name'] ?? ''),
                    'role' => (string) ($columnist['headline'] ?? 'Colunista CAB'),
                    'initials' => $this->initials((string) ($columnist['name'] ?? '')),
                ],
                array_slice($columnists, 0, 6),
            )),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function mapEmptyIndexPageContent(): array
    {
        $perPage = (int) config('cab.blog_pagination.index_recent_per_page', 6);

        return [
            'meta' => [
                'title' => 'Blog CAB | Transmissão automática, dicas e mercado',
                'description' => 'Artigos técnicos, dicas de bancada, eventos e tendências do mercado de transmissão automática para oficinas e mecânicos especializados.',
            ],
            'defaultCategory' => 'Geral',
            'categories' => $this->navigationCategories(),
            'featuredPost' => null,
            'subFeaturedPosts' => [],
            'recentPosts' => [],
            'recentPagination' => $this->buildPagination(0, $perPage),
            'columnists' => [],
            'upcomingEvents' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function mapEmptyCategoryPage(string $name, string $description, ?string $categorySlug = null): array
    {
        $perPage = (int) config('cab.blog_pagination.category_grid_per_page', 6);

        return [
            'name' => $name,
            'description' => $description,
            'allCategoriesList' => $this->navigationCategories(),
            'featuredPost' => null,
            'posts' => [],
            'postsPagination' => array_merge(
                $this->buildPagination(0, $perPage),
                ['categorySlug' => $categorySlug ?? ''],
            ),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function mapRecentCards(array $posts): array
    {
        return array_values(array_map(
            fn (array $post) => $this->mapRecentCard($post),
            $posts,
        ));
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function mapGridPosts(array $posts): array
    {
        return array_values(array_map(
            fn (array $post) => $this->mapGridPost($post),
            $posts,
        ));
    }

    /**
     * @param  array<string, mixed>  $post
     * @param  array<int, array<string, mixed>>  $allPosts
     * @return array<string, mixed>
     */
    public function mapPost(array $post, array $allPosts): array
    {
        $authorName = $this->authorName($post);
        $categoryName = $this->categoryName($post);

        return [
            'id' => (int) ($post['id'] ?? 0),
            'slug' => (string) ($post['slug'] ?? ''),
            'title' => (string) ($post['title'] ?? ''),
            'excerpt' => (string) ($post['excerpt'] ?? ''),
            'content' => (string) ($post['content'] ?? ''),
            'image' => $this->imageValue($post),
            'imageMobile' => $this->mobileImageValue($post),
            'category' => $categoryName,
            'author' => [
                'name' => $authorName,
                'avatar' => $this->authorAvatar($post),
                'bio' => $this->authorBio($post),
                'initials' => $this->initials($authorName),
            ],
            'date' => $this->formatDate((string) ($post['published_at'] ?? '')),
            'readTime' => $this->estimateReadTime((string) ($post['content'] ?? '')),
            'tags' => [],
            'relatedPosts' => $this->mapRelatedPosts($post, $allPosts),
        ];
    }

    /**
     * @param  array<string, mixed>  $category
     * @param  array<int, array<string, mixed>>  $posts
     * @return array<string, mixed>
     */
    public function mapCategoryPage(array $category, array $posts): array
    {
        $perPage = (int) config('cab.blog_pagination.category_grid_per_page', 6);
        $categoryName = (string) ($category['name'] ?? 'Categoria');
        $featuredSource = $posts[0] ?? null;
        $gridSource = array_slice($posts, $featuredSource ? 1 : 0);
        $gridPosts = array_slice($gridSource, 0, $perPage);

        return [
            'name' => $categoryName,
            'description' => (string) ($category['description'] ?? ''),
            'allCategoriesList' => $this->navigationCategories(),
            'featuredPost' => $featuredSource
                ? $this->mapFeaturedCard($featuredSource, $categoryName)
                : null,
            'posts' => array_values(array_map(
                fn (array $post) => $this->mapGridPost($post),
                $gridPosts,
            )),
            'postsPagination' => array_merge(
                $this->buildPagination(count($gridSource), $perPage),
                ['categorySlug' => (string) ($category['slug'] ?? '')],
            ),
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $columnists
     * @param  callable(int): array<int, array<string, mixed>>  $postsForColumnist
     * @return array<int, array<string, mixed>>
     */
    public function mapColumnistsPage(array $columnists, callable $postsForColumnist): array
    {
        return array_values(array_map(function (array $columnist) use ($postsForColumnist) {
            $columnistId = (int) ($columnist['id'] ?? 0);
            $posts = $postsForColumnist($columnistId);

            return [
                'id' => $columnistId,
                'name' => (string) ($columnist['name'] ?? ''),
                'role' => (string) ($columnist['headline'] ?? 'Colunista CAB'),
                'bio' => (string) ($columnist['bio'] ?? ''),
                'avatar' => $this->columnistAvatar($columnist),
                'slug' => (string) ($columnist['slug'] ?? ''),
                'articles' => array_values(array_map(
                    fn (array $post) => $this->mapColumnistArticle($post),
                    $posts,
                )),
            ];
        }, $columnists));
    }

    /**
     * @param  array<int, array<string, mixed>>  $posts
     * @return array<int, array<string, mixed>>
     */
    public function mapSearchItems(array $posts): array
    {
        return array_values(array_map(
            fn (array $post) => $this->mapSearchItem($post),
            $posts,
        ));
    }

    /**
     * Destaques por editoria (um post por categoria de navegação).
     *
     * @param  array<int, array<string, string>>  $categories
     * @param  array<int, array<string, mixed>>  $searchIndex
     * @param  array<int, int>  $excludedPostIds
     * @param  array<int, string>  $skipCategoryLinks
     * @return array<int, array<string, mixed>>
     */
    public function buildCategoryHighlights(
        array $categories,
        array $searchIndex,
        array $excludedPostIds,
        int $limit = 3,
        array $skipCategoryLinks = [],
    ): array {
        $excluded = array_fill_keys($excludedPostIds, true);
        $skipLinks = array_fill_keys($skipCategoryLinks, true);
        $skipLinks['/blog'] = true;
        $skipLinks['/blog/eventos'] = true;
        $highlights = [];

        foreach ($categories as $category) {
            if (count($highlights) >= $limit) {
                break;
            }

            $link = (string) ($category['link'] ?? '');

            if ($link === '' || isset($skipLinks[$link])) {
                continue;
            }

            $match = null;

            foreach ($searchIndex as $item) {
                $id = (int) ($item['id'] ?? 0);

                if ($id <= 0 || isset($excluded[$id])) {
                    continue;
                }

                if ($this->searchItemMatchesCategory($item, $category)) {
                    $match = $item;
                    break;
                }
            }

            if ($match === null) {
                continue;
            }

            $highlights[] = [
                'category' => [
                    'name' => (string) ($category['name'] ?? ''),
                    'link' => $link,
                ],
                'post' => $this->mapSearchItemToRecentCard($match),
            ];
        }

        return $highlights;
    }

    /**
     * Posts em alta a partir do índice de busca (espelha buildTrendingPosts no frontend).
     *
     * @param  array<int, array<string, mixed>>  $searchIndex
     * @param  array<int, int>  $excludedPostIds
     * @return array<int, array<string, mixed>>
     */
    public function buildTrendingPosts(array $searchIndex, array $excludedPostIds, int $limit = 4): array
    {
        $excluded = array_fill_keys($excludedPostIds, true);
        $posts = [];

        foreach ($searchIndex as $item) {
            if (count($posts) >= $limit) {
                break;
            }

            $id = (int) ($item['id'] ?? 0);

            if ($id <= 0 || isset($excluded[$id])) {
                continue;
            }

            $posts[] = $this->mapSearchItemToRecentCard($item);
        }

        return $posts;
    }

    /**
     * Prévia do feed a partir do índice de busca (espelha buildFeedPreviewPosts no frontend).
     *
     * @param  array<int, array<string, mixed>>  $searchIndex
     * @param  array<int, int>  $excludedPostIds
     * @return array<int, array<string, mixed>>
     */
    public function buildFeedPreviewPosts(array $searchIndex, array $excludedPostIds, int $limit = 6): array
    {
        $excluded = array_fill_keys($excludedPostIds, true);
        $posts = [];

        foreach ($searchIndex as $item) {
            if (count($posts) >= $limit) {
                break;
            }

            $id = (int) ($item['id'] ?? 0);

            if ($id <= 0 || isset($excluded[$id])) {
                continue;
            }

            $posts[] = $this->mapSearchItemToRecentCard($item);
        }

        return $posts;
    }

    /**
     * @param  array<string, mixed>  $post
     * @return array<string, mixed>
     */
    public function mapSearchItem(array $post): array
    {
        $authorName = $this->authorName($post);

        return [
            'id' => (int) ($post['id'] ?? 0),
            'title' => (string) ($post['title'] ?? ''),
            'excerpt' => (string) ($post['excerpt'] ?? ''),
            'category' => $this->categoryName($post),
            'author' => $authorName,
            'authorInitials' => $this->initials($authorName),
            'date' => $this->formatDate((string) ($post['published_at'] ?? '')),
            'readTime' => $this->estimateReadTimeForListing($post),
            'link' => $this->postLink($post),
            'image' => $this->imageValue($post),
            'imageMobile' => $this->mobileImageValue($post),
        ];
    }

    /**
     * @return array<int, array<string, string>>
     */
    public function navigationCategories(): array
    {
        return [
            ['name' => 'Geral', 'link' => '/blog'],
            ['name' => 'Eventos', 'link' => '/blog/eventos'],
            ['name' => 'Artigos Técnicos', 'link' => '/blog/artigos-tecnicos'],
            ['name' => 'Marketing para Oficinas', 'link' => '/blog/marketing-para-oficinas'],
            ['name' => 'Dicas', 'link' => '/blog/dicas'],
            ['name' => 'Híbridos e Elétricos', 'link' => '/blog/hibridos-e-eletricos'],
            ['name' => 'Mercado do Automático', 'link' => '/blog/mercado-do-automatico'],
        ];
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function mapFeaturedCard(array $post, ?string $categoryOverride = null): array
    {
        $authorName = $this->authorName($post);

        return [
            'id' => (int) ($post['id'] ?? 0),
            'title' => (string) ($post['title'] ?? ''),
            'excerpt' => (string) ($post['excerpt'] ?? ''),
            'category' => $categoryOverride ?? $this->categoryName($post),
            'author' => $authorName,
            'authorInitials' => $this->initials($authorName),
            'date' => $this->formatDate((string) ($post['published_at'] ?? '')),
            'readTime' => $this->estimateReadTime((string) ($post['content'] ?? '')),
            'image' => $this->imageValue($post),
            'imageMobile' => $this->mobileImageValue($post),
            'link' => $this->postLink($post),
        ];
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function mapSubFeaturedCard(array $post): array
    {
        $authorName = $this->authorName($post);

        return [
            'id' => (int) ($post['id'] ?? 0),
            'title' => (string) ($post['title'] ?? ''),
            'category' => $this->categoryName($post),
            'date' => $this->formatDate((string) ($post['published_at'] ?? '')),
            'author' => $authorName,
            'authorInitials' => $this->initials($authorName),
            'link' => $this->postLink($post),
            'image' => $this->imageValue($post),
            'imageMobile' => $this->mobileImageValue($post),
        ];
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function mapRecentCard(array $post): array
    {
        $authorName = $this->authorName($post);

        return [
            'id' => (int) ($post['id'] ?? 0),
            'title' => (string) ($post['title'] ?? ''),
            'category' => $this->categoryName($post),
            'date' => $this->formatDate((string) ($post['published_at'] ?? '')),
            'readTime' => $this->estimateReadTime((string) ($post['content'] ?? '')),
            'author' => $authorName,
            'authorInitials' => $this->initials($authorName),
            'link' => $this->postLink($post),
            'image' => $this->imageValue($post),
            'imageMobile' => $this->mobileImageValue($post),
        ];
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function mapGridPost(array $post): array
    {
        $authorName = $this->authorName($post);

        return [
            'id' => (int) ($post['id'] ?? 0),
            'title' => (string) ($post['title'] ?? ''),
            'excerpt' => (string) ($post['excerpt'] ?? ''),
            'date' => $this->formatDate((string) ($post['published_at'] ?? '')),
            'readTime' => $this->estimateReadTime((string) ($post['content'] ?? '')),
            'author' => $authorName,
            'authorInitials' => $this->initials($authorName),
            'link' => $this->postLink($post),
            'image' => $this->imageValue($post),
            'imageMobile' => $this->mobileImageValue($post),
        ];
    }

    /**
     * @return array{page: int, perPage: int, total: int, hasMore: bool}
     */
    private function buildPagination(int $total, int $perPage): array
    {
        return [
            'page' => 1,
            'perPage' => $perPage,
            'total' => $total,
            'hasMore' => $total > $perPage,
        ];
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function mapColumnistArticle(array $post): array
    {
        return [
            'id' => (int) ($post['id'] ?? 0),
            'title' => (string) ($post['title'] ?? ''),
            'excerpt' => (string) ($post['excerpt'] ?? ''),
            'image' => $this->imageValue($post),
            'imageMobile' => $this->mobileImageValue($post),
            'date' => $this->formatShortDate((string) ($post['published_at'] ?? '')),
            'slug' => (string) ($post['slug'] ?? ''),
            'category' => $this->categoryName($post),
        ];
    }

    /**
     * @param  array<string, mixed>  $post
     * @param  array<int, array<string, mixed>>  $allPosts
     * @return array<int, array<string, string>>
     */
    private function mapRelatedPosts(array $post, array $allPosts): array
    {
        $currentSlug = (string) ($post['slug'] ?? '');
        $currentCategory = $this->categoryName($post);

        $candidates = array_values(array_filter(
            $allPosts,
            fn (array $candidate) => (string) ($candidate['slug'] ?? '') !== $currentSlug,
        ));

        usort($candidates, function (array $left, array $right) use ($currentCategory) {
            $leftScore = $this->categoryName($left) === $currentCategory ? 0 : 1;
            $rightScore = $this->categoryName($right) === $currentCategory ? 0 : 1;

            return $leftScore <=> $rightScore;
        });

        return array_values(array_map(
            fn (array $relatedPost) => [
                'slug' => (string) ($relatedPost['slug'] ?? ''),
                'title' => (string) ($relatedPost['title'] ?? ''),
                'image' => $this->imageValue($relatedPost),
                'imageMobile' => $this->mobileImageValue($relatedPost),
                'date' => $this->formatDate((string) ($relatedPost['published_at'] ?? '')),
            ],
            array_slice($candidates, 0, 3),
        ));
    }

    private function emptyFeaturedPost(string $categoryName): array
    {
        return [
            'title' => 'Em breve',
            'excerpt' => 'Ainda não temos publicações nesta categoria. Volte em breve!',
            'category' => $categoryName,
            'author' => 'Equipe CAB',
            'authorInitials' => 'CAB',
            'date' => '',
            'readTime' => '',
            'image' => self::DEFAULT_IMAGE,
            'link' => '/blog',
        ];
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function authorName(array $post): string
    {
        $columnist = $post['columnist'] ?? null;

        if (is_array($columnist) && ! empty($columnist['name'])) {
            return (string) $columnist['name'];
        }

        return 'Equipe CAB';
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function authorBio(array $post): string
    {
        $columnist = $post['columnist'] ?? null;

        if (is_array($columnist) && ! empty($columnist['bio'])) {
            return (string) $columnist['bio'];
        }

        return 'Equipe de especialistas da Câmbio Automático do Brasil.';
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function authorAvatar(array $post): string
    {
        $columnist = $post['columnist'] ?? null;

        if (is_array($columnist) && ! empty($columnist['photo_url'])) {
            return (string) $columnist['photo_url'];
        }

        return '';
    }

    /**
     * @param  array<string, mixed>  $columnist
     */
    private function columnistAvatar(array $columnist): string
    {
        if (! empty($columnist['photo_url'])) {
            return (string) $columnist['photo_url'];
        }

        $name = urlencode((string) ($columnist['name'] ?? 'CAB'));

        return "https://ui-avatars.com/api/?name={$name}&background=003A7B&color=fff";
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function categoryName(array $post): string
    {
        $category = $post['category'] ?? null;

        if (is_array($category) && ! empty($category['name'])) {
            return (string) $category['name'];
        }

        return 'Geral';
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function publishedAtTimestamp(array $post): int
    {
        $raw = trim((string) ($post['published_at'] ?? ''));

        if ($raw === '') {
            return 0;
        }

        $timestamp = strtotime($raw);

        return $timestamp === false ? 0 : $timestamp;
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function imageValue(array $post): string
    {
        foreach ([
            'featured_image_url',
            'capa',
            'capa_url',
            'imagem_capa',
            'cover_image_url',
            'imagem',
            'image',
            'image_url',
        ] as $key) {
            if (! empty($post[$key])) {
                return $this->normalizeBlogImageUrl((string) $post[$key]);
            }
        }

        return self::DEFAULT_IMAGE;
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function mobileImageValue(array $post): ?string
    {
        foreach ([
            'thumbnail_url',
            'thumb_url',
            'featured_image_thumb_url',
            'cover_image_thumb_url',
            'image_thumb_url',
            'url_thumb',
            'miniatura_url',
        ] as $key) {
            if (! empty($post[$key])) {
                return $this->normalizeBlogImageUrl((string) $post[$key]);
            }
        }

        return null;
    }

    private function normalizeBlogImageUrl(string $url): string
    {
        if (! str_starts_with($url, 'http://') && ! str_starts_with($url, 'https://')) {
            return $url;
        }

        if (str_starts_with($url, 'http://')) {
            $url = 'https://'.substr($url, 7);
        }

        $path = parse_url($url, PHP_URL_PATH);

        if (! is_string($path) || ! str_contains($path, '/blog/posts/')) {
            return CabMediaUrl::proxy($url);
        }

        $base = (string) config('cab.blog_media_base_url', 'https://crm.cambioautomaticodobrasil.com.br');

        return CabMediaUrl::proxy(rtrim($base, '/').$path);
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function postLink(array $post): string
    {
        $slug = (string) ($post['slug'] ?? '');

        return $slug !== '' ? '/blog/'.$slug : '/blog';
    }

    private function formatDate(string $publishedAt): string
    {
        if ($publishedAt === '') {
            return '';
        }

        $timestamp = strtotime($publishedAt);

        if ($timestamp === false) {
            return $publishedAt;
        }

        $day = (int) date('j', $timestamp);
        $month = self::MONTHS[(int) date('n', $timestamp)] ?? date('F', $timestamp);
        $year = date('Y', $timestamp);

        return "{$day} de {$month}, {$year}";
    }

    private function formatShortDate(string $publishedAt): string
    {
        if ($publishedAt === '') {
            return '';
        }

        $timestamp = strtotime($publishedAt);

        if ($timestamp === false) {
            return $publishedAt;
        }

        return date('d/m/Y', $timestamp);
    }

    private function estimateReadTime(string $content): string
    {
        $text = trim(strip_tags($content));

        if ($text === '') {
            return '5 min de leitura';
        }

        $words = str_word_count($text);
        $minutes = max(1, (int) ceil($words / 200));

        return "{$minutes} min de leitura";
    }

    /**
     * @param  array<string, mixed>  $post
     */
    private function estimateReadTimeForListing(array $post): string
    {
        $excerpt = trim(strip_tags((string) ($post['excerpt'] ?? '')));

        if ($excerpt !== '') {
            return $this->estimateReadTime($excerpt);
        }

        return $this->estimateReadTime((string) ($post['content'] ?? ''));
    }

    /**
     * @param  array<string, mixed>  $item
     * @param  array<string, string>  $category
     */
    private function searchItemMatchesCategory(array $item, array $category): bool
    {
        $categoryName = (string) ($category['name'] ?? '');
        $categoryLink = (string) ($category['link'] ?? '');
        $itemCategory = (string) ($item['category'] ?? '');
        $itemLink = (string) ($item['link'] ?? '');

        if ($categoryName !== '' && $itemCategory === $categoryName) {
            return true;
        }

        return $categoryLink !== '' && str_starts_with($itemLink, $categoryLink.'/');
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array<string, mixed>
     */
    private function mapSearchItemToRecentCard(array $item): array
    {
        return [
            'id' => (int) ($item['id'] ?? 0),
            'title' => (string) ($item['title'] ?? ''),
            'category' => (string) ($item['category'] ?? ''),
            'date' => (string) ($item['date'] ?? ''),
            'readTime' => (string) ($item['readTime'] ?? '5 min de leitura'),
            'author' => (string) ($item['author'] ?? ''),
            'authorInitials' => (string) ($item['authorInitials'] ?? ''),
            'link' => (string) ($item['link'] ?? ''),
            'image' => (string) ($item['image'] ?? ''),
            'imageMobile' => $item['imageMobile'] ?? null,
        ];
    }

    private function initials(string $name): string
    {
        $parts = array_values(array_filter(explode(' ', trim($name))));

        if (count($parts) >= 2) {
            return strtoupper(substr($parts[0], 0, 1).substr($parts[1], 0, 1));
        }

        if (count($parts) === 1) {
            return strtoupper(substr($parts[0], 0, 3));
        }

        return 'CAB';
    }
}
