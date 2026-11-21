<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlogNewsletterRequest;
use App\Jobs\Cab\SubmitNewsletterSubscriptionJob;
use App\Services\Cab\Blog\BlogService;
use App\Services\Cab\Newsletter\NewsletterSubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(
        private BlogService $blogService,
        private NewsletterSubscriptionService $newsletterService,
    ) {}

    public function index(): Response
    {
        $pageContent = $this->blogService->getIndexPageContent();

        return Inertia::render('blog/page', [
            'pageContent' => $pageContent,
            'indexShell' => $this->blogService->getIndexShellData($pageContent),
        ]);
    }

    public function post(string $slug): Response
    {
        $post = $this->blogService->getPostBySlug($slug);

        if ($post === null) {
            abort(404);
        }

        return Inertia::render('blog/blog-post/page', [
            'post' => $post,
        ]);
    }

    public function events(): Response
    {
        return $this->renderCategoryPage('blog.events');
    }

    public function technicalArticles(): Response
    {
        return $this->renderCategoryPage('blog.technical-articles');
    }

    public function eletricHybrid(): Response
    {
        return $this->renderCategoryPage('blog.eletric-hybrid');
    }

    public function tips(): Response
    {
        return $this->renderCategoryPage('blog.tips');
    }

    public function automaticMarket(): Response
    {
        return $this->renderCategoryPage('blog.automatic-market');
    }

    public function marketingWorkshops(): Response
    {
        return $this->renderCategoryPage('blog.marketing-workshops');
    }

    public function loadMorePosts(Request $request): JsonResponse
    {
        if (! $this->blogService->isEnabled()) {
            return response()->json([
                'posts' => [],
                'pagination' => [
                    'page' => 1,
                    'perPage' => 6,
                    'total' => 0,
                    'hasMore' => false,
                ],
            ]);
        }

        $validated = $request->validate([
            'context' => ['required', 'in:index,category'],
            'page' => ['required', 'integer', 'min:1'],
            'category' => ['required_if:context,category', 'string', 'max:120'],
        ]);

        if ($validated['context'] === 'index') {
            return response()->json(
                $this->blogService->getMoreIndexPosts((int) $validated['page']),
            );
        }

        return response()->json(
            $this->blogService->getMoreCategoryPosts(
                (string) $validated['category'],
                (int) $validated['page'],
            ),
        );
    }

    public function searchIndex(Request $request): JsonResponse
    {
        if (! $this->blogService->isEnabled()) {
            return response()->json(['items' => []]);
        }

        $validated = $request->validate([
            'context' => ['required', 'in:index,category'],
            'category' => ['required_if:context,category', 'string', 'max:120'],
        ]);

        $items = $this->blogService->getSearchIndexForContext(
            (string) $validated['context'],
            $validated['category'] ?? null,
        );

        return response()->json(['items' => $items]);
    }

    public function storeNewsletter(StoreBlogNewsletterRequest $request): JsonResponse
    {
        if (! $this->newsletterService->isConfigured()) {
            return response()->json([
                'message' => 'Formulário temporariamente indisponível.',
            ], 503);
        }

        $validated = $request->validated();

        SubmitNewsletterSubscriptionJob::dispatch(
            $validated['name'],
            $validated['email'],
            $validated['phone'] ?? null,
            $validated['tipo'],
        );

        return response()->json([
            'message' => 'Inscrição recebida com sucesso!',
        ]);
    }

    private function renderCategoryPage(string $routeName): Response
    {
        $isEventsCategory = $routeName === 'blog.events';
        $categoryData = $this->blogService->getCategoryPageData($routeName);

        return Inertia::render('blog/category/page', [
            'categoryData' => $categoryData,
            'categoryRoute' => $routeName,
            'categoryShell' => $isEventsCategory ? 'events' : 'default',
            'categorySidecar' => $this->categorySidecar($routeName, $categoryData, $isEventsCategory),
        ]);
    }

    /**
     * @param  array<string, mixed>  $categoryData
     * @return array<string, mixed>
     */
    private function categorySidecar(string $routeName, array $categoryData, bool $isEventsCategory): array
    {
        if ($isEventsCategory) {
            return [
                'categoryHighlights' => $this->blogService->getCategoryPortalHighlights($routeName),
            ];
        }

        return [
            ...$this->blogService->getCategoryShellData($routeName, $categoryData),
            'categoryHighlights' => $this->blogService->getCategoryPortalHighlights($routeName),
            'upcomingEvents' => $this->blogService->getUpcomingEventsPreview(3),
        ];
    }
}
