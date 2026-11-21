<?php

namespace App\Support;

/**
 * Variante leve das imagens do CRM para a home.
 * Só a largura configurada é processada; o restante segue o arquivo original.
 */
class CabMediaDerivative
{
    public static function acceptedWidth(?string $query): ?int
    {
        $allowed = (int) config('cab.media_proxy_home_width', 1600);

        if ($allowed < 1 || $query === null || $query === '' || ! ctype_digit($query)) {
            return null;
        }

        return (int) $query === $allowed ? $allowed : null;
    }

    public static function cachedBody(string $upstream, int $width): ?string
    {
        $path = self::cachePath($upstream, $width);

        if (! is_file($path)) {
            return null;
        }

        $body = file_get_contents($path);

        return is_string($body) && $body !== '' ? $body : null;
    }

    public static function store(string $upstream, string $bytes, int $width): ?string
    {
        $encoded = self::encode($bytes, $width);

        if ($encoded === null) {
            return null;
        }

        $path = self::cachePath($upstream, $width);
        $directory = dirname($path);

        if (! is_dir($directory) && ! mkdir($directory, 0755, true) && ! is_dir($directory)) {
            return $encoded;
        }

        file_put_contents($path, $encoded);

        return $encoded;
    }

    public static function cachePath(string $upstream, int $width): string
    {
        $name = hash('sha256', $upstream.'|'.$width);

        return storage_path('framework/cache/media-derivatives/'.$name.'.webp');
    }

    private static function encode(string $bytes, int $width): ?string
    {
        if (! function_exists('imagecreatefromstring') || ! function_exists('imagewebp')) {
            return null;
        }

        $source = @imagecreatefromstring($bytes);

        if ($source === false) {
            return null;
        }

        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);

        if ($sourceWidth < 1 || $sourceHeight < 1 || ($sourceWidth * $sourceHeight) > 40_000_000) {
            imagedestroy($source);

            return null;
        }

        $targetWidth = min($width, $sourceWidth);
        $targetHeight = max(1, (int) round($sourceHeight * ($targetWidth / $sourceWidth)));
        $target = imagecreatetruecolor($targetWidth, $targetHeight);

        if ($target === false) {
            imagedestroy($source);

            return null;
        }

        imagealphablending($target, false);
        imagesavealpha($target, true);
        $transparent = imagecolorallocatealpha($target, 0, 0, 0, 127);
        imagefilledrectangle($target, 0, 0, $targetWidth, $targetHeight, $transparent);
        imagecopyresampled(
            $target,
            $source,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $sourceWidth,
            $sourceHeight,
        );
        imagedestroy($source);

        $temporary = tempnam(sys_get_temp_dir(), 'cab-media-');

        if ($temporary === false) {
            imagedestroy($target);

            return null;
        }

        $written = imagewebp($target, $temporary, 75);
        imagedestroy($target);

        if ($written !== true || ! is_file($temporary)) {
            @unlink($temporary);

            return null;
        }

        $body = file_get_contents($temporary);
        @unlink($temporary);

        return is_string($body) && $body !== '' ? $body : null;
    }
}
