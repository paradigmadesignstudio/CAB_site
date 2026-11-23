<?php

/**
 * Deploy site — landing CAB + Raven (/cabraven).
 *
 * Sem migration e sem build de assets (a página é Blade puro).
 * No servidor, depois de extrair:
 *   1. .env:
 *        CAB_API_CABRAVEN=https://crm.cambioautomaticodobrasil.com.br/api/v1/site/cabraven
 *        CAB_API_SITE_TOKEN=<mesmo valor do .env do CRM>
 *   2. php artisan config:cache && php artisan route:cache && php artisan view:clear
 *
 * O .env não vai no pacote.
 */

$arquivos = [
    'app/Http/Controllers/CabRavenController.php',
    'app/Http/Requests/StoreCabRavenRequest.php',
    'app/Services/Cab/CabRaven/CabRavenService.php',
    'app/Support/DocumentoBrasileiro.php',
    'config/cab/api.php',
    'config/cab/forms.php',
    'routes/web.php',
    'resources/views/cabraven.blade.php',
    'public/images/cabraven/parceria.png',
];

$destino = __DIR__ . '/deploy';
if (!is_dir($destino)) {
    mkdir($destino, 0775, true);
}

$zipPath = $destino . '/deploy_cabraven_' . date('Ymd_His') . '.zip';

$zip = new ZipArchive();
if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    fwrite(STDERR, "Não foi possível criar {$zipPath}\n");
    exit(1);
}

foreach ($arquivos as $relativo) {
    if (preg_match('#(^|/)\.env#', $relativo)) {
        fwrite(STDERR, "Recusado: {$relativo} (.env não entra no pacote)\n");
        exit(1);
    }

    $absoluto = __DIR__ . '/' . $relativo;
    if (!is_file($absoluto)) {
        fwrite(STDERR, "Arquivo não encontrado: {$relativo}\n");
        $zip->close();
        @unlink($zipPath);
        exit(1);
    }

    $zip->addFile($absoluto, $relativo);
    echo "  + {$relativo}\n";
}

$zip->close();

echo "\nZip gerado: {$zipPath}\n";
