<?php

namespace App\Services\Cab\Plans;

class PlansDataMapper
{
    /**
     * @param  array<int, array<string, mixed>>  $apiPlans
     * @return array<int, array<string, mixed>>
     */
    public function mapList(array $apiPlans): array
    {
        $overlays = config('cab.plans_overlays', []);

        usort($apiPlans, fn (array $a, array $b) => ($a['id'] ?? 0) <=> ($b['id'] ?? 0));

        $mapped = [];

        foreach ($apiPlans as $apiPlan) {
            $key = $this->resolvePlanKey((string) ($apiPlan['titulo'] ?? ''));

            if ($key === null) {
                continue;
            }

            $overlay = is_array($overlays[$key] ?? null) ? $overlays[$key] : [];
            $recorrente = (float) ($apiPlan['valor_recorrente'] ?? 0);
            $duracaoMeses = max(1, (int) ($apiPlan['duracao_meses'] ?? 12));

            $mapped[] = [
                'id' => (int) ($apiPlan['id'] ?? 0),
                'key' => $key,
                'columnLabel' => (string) ($overlay['column_label'] ?? $key),
                'name' => (string) ($overlay['name'] ?? ($apiPlan['titulo'] ?? 'Plano')),
                'apiTitle' => (string) ($apiPlan['titulo'] ?? ''),
                'description' => (string) ($overlay['description'] ?? ''),
                'basePriceWithFidelity' => $recorrente,
                'basePriceWithoutFidelity' => $this->resolvePriceWithoutFidelity($apiPlan, $recorrente, $duracaoMeses),
                'features' => $this->mergeFeatures($overlay, $apiPlan),
                'ecosystemFeatures' => is_array($overlay['ecosystem_features'] ?? null)
                    ? $overlay['ecosystem_features']
                    : [],
                'href' => (string) config('cab.plans_signup_url', ''),
                'popular' => (bool) ($overlay['popular'] ?? false),
                'ctaText' => (string) ($overlay['cta_text'] ?? 'Saiba mais'),
                'parcelas' => (int) ($apiPlan['parcelas'] ?? 0),
                'duracaoMeses' => $duracaoMeses,
                'parcelamento' => is_array($apiPlan['parcelamento'] ?? null) ? $apiPlan['parcelamento'] : null,
                'descontoCursos' => $apiPlan['desconto_cursos'] ?? null,
                'maxTreinamentosGratuitos' => $apiPlan['max_treinamentos_gratuitos'] ?? null,
            ];
        }

        return $mapped;
    }

    private function resolvePlanKey(string $titulo): ?string
    {
        $normalized = mb_strtolower(trim($titulo));

        if ($normalized === '') {
            return null;
        }

        if (str_contains($normalized, '2.0t') || str_contains($normalized, '2.0 t')) {
            return '30';
        }

        if (preg_match('/3\.0\b/u', $normalized) === 1) {
            return '30';
        }

        if (str_contains($normalized, '1.4')) {
            return '14';
        }

        if (preg_match('/2\.0\b/u', $normalized) === 1) {
            return '20';
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $apiPlan
     */
    private function resolvePriceWithoutFidelity(array $apiPlan, float $recorrente, int $duracaoMeses): float
    {
        $anual = (float) ($apiPlan['valor_anual'] ?? 0);

        if ($anual > 0 && $duracaoMeses > 0) {
            $monthlyFromAnnual = round($anual / $duracaoMeses, 2);

            if ($monthlyFromAnnual > $recorrente) {
                return $monthlyFromAnnual;
            }
        }

        return $recorrente > 0 ? round($recorrente * 2, 2) : 0.0;
    }

    /**
     * @param  array<string, mixed>  $overlay
     * @param  array<string, mixed>  $apiPlan
     * @return array<int, string>
     */
    private function mergeFeatures(array $overlay, array $apiPlan): array
    {
        $features = is_array($overlay['features'] ?? null) ? $overlay['features'] : [];

        $beneficios = is_array($apiPlan['beneficios'] ?? null) ? $apiPlan['beneficios'] : [];
        $apiFeatureLabels = [
            'acesso_app' => 'APP Guia de Transmissões CAB',
            'orientacao_juridica' => 'Orientação jurídica CAB',
            'apoio_tecnico' => 'Apoio técnico exclusivo',
            'kit_cab' => 'Kit CAB de boas-vindas',
            'acesso_imersao' => 'Acesso à Imersão CAB',
            'acesso_congresso' => 'Acesso ao Congresso CAB',
            'desconto_laudos' => 'Desconto em perícias e laudos técnicos',
        ];

        foreach ($apiFeatureLabels as $field => $label) {
            if (($beneficios[$field] ?? false) === true && ! in_array($label, $features, true)) {
                $features[] = $label;
            }
        }

        if (! empty($apiPlan['desconto_cursos']) && is_numeric($apiPlan['desconto_cursos'])) {
            $discountLabel = ((int) $apiPlan['desconto_cursos']).'% de desconto em cursos';
            if (! in_array($discountLabel, $features, true)) {
                $features[] = $discountLabel;
            }
        }

        if (! empty($apiPlan['max_treinamentos_gratuitos'])) {
            $trainingLabel = $apiPlan['max_treinamentos_gratuitos'].' treinamentos online inclusos';
            if (! in_array($trainingLabel, $features, true)) {
                $features[] = $trainingLabel;
            }
        }

        return array_values($features);
    }
}
