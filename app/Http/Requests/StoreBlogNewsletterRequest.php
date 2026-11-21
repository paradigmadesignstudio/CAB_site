<?php

namespace App\Http\Requests;

use App\Services\Cab\Newsletter\NewsletterSubscriptionService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBlogNewsletterRequest extends FormRequest
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
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'min:8', 'max:24'],
            'tipo' => ['required', 'string', Rule::in(NewsletterSubscriptionService::ALLOWED_TIPOS)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Informe seu nome.',
            'name.min' => 'O nome deve ter pelo menos 2 caracteres.',
            'email.required' => 'Informe seu e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'phone.min' => 'Informe um telefone válido.',
            'tipo.required' => 'Tipo de inscrição inválido.',
        ];
    }
}
