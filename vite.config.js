import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const inDocker = process.env.DOCKER === '1';
const publicHost = process.env.DEV_PUBLIC_HOST || '';
const vitePublicOrigin = publicHost ? `http://${publicHost}:5173` : 'http://localhost:5173';

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
        // No container o processo escuta em 0.0.0.0. DEV_PUBLIC_HOST é o IP que o navegador alcança.
        host: inDocker ? '0.0.0.0' : '127.0.0.1',
        port: 5173,
        strictPort: true,
        origin: inDocker ? vitePublicOrigin : undefined,
        cors: inDocker
            ? { origin: publicHost ? [`http://${publicHost}:8001`, vitePublicOrigin] : true }
            : true,
        hmr: {
            host: inDocker ? (publicHost || 'localhost') : '127.0.0.1',
            clientPort: 5173,
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
            usePolling: inDocker,
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
