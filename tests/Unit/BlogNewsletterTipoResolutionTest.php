<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Espelha a lógica de resolveNewsletterTipo (blogEditorialContext.ts) para garantir
 * que os tipos enviados ao CRM seguem a tabela de origem do formulário.
 */
class BlogNewsletterTipoResolutionTest extends TestCase
{
    /**
     * @return array<string, array{0: string, 1: ?string, 2: string}>
     */
    public static function newsletterTipoProvider(): array
    {
        return [
            'listagem do blog' => ['portal', null, 'BLOG'],
            'página de dicas' => ['dicas', null, 'DICAS'],
            'categoria eventos' => ['eventos', null, 'Eventos'],
            'categoria artigos técnicos' => ['artigos-tecnicos', null, 'Artigos Técnicos'],
            'categoria por nome explícito' => ['marketing-para-oficinas', 'Marketing para Oficinas', 'Marketing para Oficinas'],
            'dicas pelo nome da categoria' => ['artigos-tecnicos', 'Dicas', 'DICAS'],
        ];
    }

    #[Test]
    #[DataProvider('newsletterTipoProvider')]
    public function it_resolves_newsletter_tipo_for_blog_contexts(
        string $context,
        ?string $categoryName,
        string $expectedTipo,
    ): void {
        $this->assertSame($expectedTipo, $this->resolveNewsletterTipo($context, $categoryName));
    }

    private function resolveNewsletterTipo(string $context, ?string $categoryName): string
    {
        $contextToCategoryName = [
            'eventos' => 'Eventos',
            'artigos-tecnicos' => 'Artigos Técnicos',
            'marketing-para-oficinas' => 'Marketing para Oficinas',
            'hibridos-e-eletricos' => 'Híbridos e Elétricos',
            'mercado-do-automatico' => 'Mercado do Automático',
        ];

        $categoryToContext = array_flip($contextToCategoryName);
        $categoryToContext['Dicas'] = 'dicas';

        if ($context === 'portal') {
            return 'BLOG';
        }

        if ($context === 'dicas' || $categoryName === 'Dicas') {
            return 'DICAS';
        }

        $mappedName = $categoryName ?? ($contextToCategoryName[$context] ?? null);

        if ($mappedName !== null && isset($categoryToContext[$mappedName])) {
            return $mappedName;
        }

        return 'BLOG';
    }
}
