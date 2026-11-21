import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-stone-950 text-white">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 lg:px-10">
                <div className="grid w-full gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                    <section className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Front-end React conectado ao Laravel
                        </div>

                        <div className="space-y-5">
                            <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80">
                                CAB Site Novo
                            </p>
                            <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-balance md:text-7xl">
                                Seu front em React agora carrega dentro do Laravel.
                            </h1>
                            <p className="max-w-xl text-lg leading-8 text-slate-300">
                                Esta tela é a base funcional. A partir daqui você pode trocar o conteúdo por
                                componentes React reais, manter o Vite ativo e evoluir a interface sem depender
                                do template padrão do Laravel.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://react.dev"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                            >
                                Abrir documentação React
                            </a>
                            <a
                                href="https://laravel.com/docs/vite"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                            >
                                Ver integração Vite
                            </a>
                        </div>
                    </section>

                    <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_35%)]" />
                        <div className="relative space-y-6">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Estado do app</p>
                                <h2 className="mt-3 text-2xl font-semibold">Bundle carregado com sucesso</h2>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-sm text-slate-400">Entry point</p>
                                    <p className="mt-2 font-medium">resources/js/app.jsx</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-sm text-slate-400">Build tool</p>
                                    <p className="mt-2 font-medium">Vite + React</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-sm text-slate-400">Backend</p>
                                    <p className="mt-2 font-medium">Laravel 13</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-sm text-slate-400">Próximo passo</p>
                                    <p className="mt-2 font-medium">Trocar esta tela por seus componentes</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);