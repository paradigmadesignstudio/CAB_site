import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Nunito', {
                    weights: [300, 400, 500, 600, 700],
                    subsets: ['latin'],
                }),
            ],
        }),
        react(),
    ],
    server: {
        // Chromium ignora host IPv6 ([::1]) na CSP. 127.0.0.1 entra em script-src no ambiente local.
        host: '127.0.0.1',
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('maplibre-gl')) {
                        return 'maplibre';
                    }
                    if (id.includes('framer-motion')) {
                        return 'motion';
                    }
                },
            },
        },
    },
});
