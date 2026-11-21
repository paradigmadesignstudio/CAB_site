<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title inertia>{{ \App\Support\CabBrand::shield('CAB') }} | Câmbio Automático do Brasil</title>
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    @include('partials.google-tag-manager-head')
    @foreach (\App\Support\CabPreconnectOrigins::hosts() as $host)
      <link rel="preconnect" href="https://{{ $host }}" crossorigin />
      <link rel="dns-prefetch" href="https://{{ $host }}" />
    @endforeach
    @if (request()->routeIs('home'))
      {{-- LCP: imagem do hero — versão mobile leve vs desktop --}}
      <link
        rel="preload"
        as="image"
        href="{{ asset('images/carousel/cab_carousel_1-mobile.webp') }}"
        type="image/webp"
        media="(max-width: 767px)"
        fetchpriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="{{ asset('images/carousel/cab_carousel_1.webp') }}"
        type="image/webp"
        media="(min-width: 768px)"
        fetchpriority="high"
      />
    @endif
    @viteReactRefresh
    @vite('resources/js/app.tsx')
    @inertiaHead
  </head>
  <body class="noise-overlay"> <!-- Sua classe do Tailwind v4 já entra aqui -->
    @include('partials.google-tag-manager-body')
    @inertia
  </body>
</html>