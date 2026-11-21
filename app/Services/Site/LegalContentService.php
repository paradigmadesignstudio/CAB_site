<?php

namespace App\Services\Site;

class LegalContentService
{
    /**
     * @return array<string, mixed>
     */
    public function privacy(): array
    {
        return $this->load('privacy');
    }

    /**
     * @return array<string, mixed>
     */
    public function terms(): array
    {
        return $this->load('terms');
    }

    /**
     * @return array<string, mixed>
     */
    public function cookies(): array
    {
        return $this->load('cookies');
    }

    /**
     * @return array<string, mixed>
     */
    private function load(string $document): array
    {
        $path = config_path("site/legal/{$document}.php");

        if (! is_file($path)) {
            return [];
        }

        /** @var array<string, mixed> $content */
        $content = require $path;

        return [
            ...$content,
            'company' => config('site.company'),
            'relatedLinks' => $this->relatedLinks($document),
        ];
    }

    /**
     * @return list<array{label: string, href: string}>
     */
    private function relatedLinks(string $current): array
    {
        $links = [
            ['label' => 'Política de Privacidade', 'href' => '/politica-de-privacidade', 'key' => 'privacy'],
            ['label' => 'Termos de Serviço', 'href' => '/termos-de-servico', 'key' => 'terms'],
            ['label' => 'Política de Cookies', 'href' => '/politica-de-cookies', 'key' => 'cookies'],
        ];

        return array_values(array_map(
            fn (array $link): array => ['label' => $link['label'], 'href' => $link['href']],
            array_filter($links, fn (array $link): bool => $link['key'] !== $current),
        ));
    }
}
