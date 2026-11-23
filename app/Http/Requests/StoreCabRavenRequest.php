<?php

namespace App\Http\Requests;

use App\Support\DocumentoBrasileiro;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class StoreCabRavenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tipo_documento' => ['required', 'in:cpf,cnpj'],
            'nome' => ['required', 'string', 'min:3', 'max:180'],
            'documento' => [
                'required',
                'string',
                'max:18',
                function (string $attribute, mixed $value, Closure $fail): void {
                    $tipo = (string) $this->input('tipo_documento');

                    if (! in_array($tipo, ['cpf', 'cnpj'], true)) {
                        return;
                    }

                    if (! DocumentoBrasileiro::valido($tipo, (string) $value)) {
                        $fail($tipo === 'cpf' ? 'Informe um CPF válido.' : 'Informe um CNPJ válido.');
                    }
                },
            ],
            'whatsapp' => ['required', 'string', 'max:20', 'regex:/^(\D*\d){10,13}\D*$/'],
            'email' => ['required', 'email', 'max:190'],
            'consentimento' => ['accepted'],
            'site_empresa' => ['nullable', 'max:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tipo_documento.required' => 'Escolha se o cadastro será com CPF ou CNPJ.',
            'tipo_documento.in' => 'Escolha se o cadastro será com CPF ou CNPJ.',
            'nome.required' => 'Informe seu nome completo ou a razão social.',
            'nome.min' => 'O nome deve ter pelo menos 3 caracteres.',
            'documento.required' => 'Informe seu CPF ou CNPJ.',
            'whatsapp.required' => 'Informe seu WhatsApp com DDD.',
            'whatsapp.regex' => 'Informe um WhatsApp válido com DDD.',
            'email.required' => 'Informe seu e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'consentimento.accepted' => 'É necessário autorizar o uso dos dados para continuar.',
            'site_empresa.max' => 'Não foi possível registrar sua solicitação.',
        ];
    }
}
