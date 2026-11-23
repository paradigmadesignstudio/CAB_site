<?php

namespace App\Support;

/**
 * Validação e formatação de CPF/CNPJ.
 */
final class DocumentoBrasileiro
{
    public static function digitos(string $valor): string
    {
        return preg_replace('/\D/', '', $valor) ?? '';
    }

    public static function valido(string $tipo, string $valor): bool
    {
        return match ($tipo) {
            'cpf' => self::cpfValido($valor),
            'cnpj' => self::cnpjValido($valor),
            default => false,
        };
    }

    public static function cpfValido(string $valor): bool
    {
        $cpf = self::digitos($valor);

        if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        for ($posicao = 9; $posicao < 11; $posicao++) {
            $soma = 0;
            for ($i = 0; $i < $posicao; $i++) {
                $soma += (int) $cpf[$i] * (($posicao + 1) - $i);
            }
            $digito = ((10 * $soma) % 11) % 10;
            if ((int) $cpf[$posicao] !== $digito) {
                return false;
            }
        }

        return true;
    }

    public static function cnpjValido(string $valor): bool
    {
        $cnpj = self::digitos($valor);

        if (strlen($cnpj) !== 14 || preg_match('/^(\d)\1{13}$/', $cnpj)) {
            return false;
        }

        foreach ([12, 13] as $posicao) {
            $pesos = $posicao === 12
                ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
                : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            $soma = 0;
            for ($i = 0; $i < $posicao; $i++) {
                $soma += (int) $cnpj[$i] * $pesos[$i];
            }
            $resto = $soma % 11;
            $digito = $resto < 2 ? 0 : 11 - $resto;
            if ((int) $cnpj[$posicao] !== $digito) {
                return false;
            }
        }

        return true;
    }

    public static function formatar(string $tipo, string $valor): string
    {
        $d = self::digitos($valor);

        if ($tipo === 'cpf' && strlen($d) === 11) {
            return preg_replace('/^(\d{3})(\d{3})(\d{3})(\d{2})$/', '$1.$2.$3-$4', $d);
        }

        if ($tipo === 'cnpj' && strlen($d) === 14) {
            return preg_replace('/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/', '$1.$2.$3/$4-$5', $d);
        }

        return $valor;
    }
}
