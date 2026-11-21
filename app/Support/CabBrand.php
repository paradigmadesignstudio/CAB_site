<?php

namespace App\Support;

class CabBrand
{
    /**
     * Impede que tradutores automáticos tratem "CAB" como a palavra inglesa "cab" (táxi).
     */
    public static function shield(string $text): string
    {
        $joiner = "\u{2060}";

        return str_replace(
            ['C.A.B.', 'CAB'],
            ["C{$joiner}.{$joiner}A{$joiner}.{$joiner}B{$joiner}.", "C{$joiner}A{$joiner}B"],
            $text,
        );
    }
}
