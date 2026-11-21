<?php

namespace App\Services\Site;

use Illuminate\Support\Facades\File;

class PageContentService
{
    /**
     * @return array{pageContent: array<string, mixed>, contactInfo: array<int, array<string, string>>}
     */
    public function support(): array
    {
        /** @var array{pageContent: array<string, mixed>, contactInfo: array<int, array<string, string>>} $content */
        $content = config('site.support');

        return $content;
    }

    /**
     * @return array<string, mixed>
     */
    public function aboutUs(): array
    {
        return $this->loadStatic('about-us');
    }

    /**
     * @return array<string, mixed>
     */
    public function academyPage(): array
    {
        return $this->loadStatic('academy-page');
    }

    /**
     * @return array<string, mixed>
     */
    public function findPartner(): array
    {
        return $this->loadStatic('find-partner');
    }

    /**
     * @return array<string, mixed>
     */
    public function findMember(): array
    {
        return $this->loadStatic('find-member');
    }

    /**
     * @return array<string, mixed>
     */
    public function plans(): array
    {
        return $this->applyPlansSignupUrl($this->loadStatic('plans'));
    }

    /**
     * @return array<string, mixed>
     */
    public function ecosystem(): array
    {
        return $this->loadStatic('ecosystem');
    }

    /**
     * @return array<string, mixed>
     */
    private function applyPlansSignupUrl(array $content): array
    {
        $signupUrl = (string) config('cab.plans_signup_url', '');

        if ($signupUrl === '') {
            return $content;
        }

        if (isset($content['plans']) && is_array($content['plans'])) {
            $content['plans'] = array_map(
                fn (array $plan): array => [...$plan, 'href' => $signupUrl],
                $content['plans'],
            );
        }

        if (isset($content['finalCta']) && is_array($content['finalCta'])) {
            $content['finalCta']['link'] = $signupUrl;
        }

        return $content;
    }

    /**
     * @return array<string, mixed>
     */
    private function loadStatic(string $page): array
    {
        $path = database_path("data/static/{$page}.json");

        if (! File::exists($path)) {
            return [];
        }

        $decoded = json_decode(File::get($path), true);

        return is_array($decoded) ? $decoded : [];
    }
}
