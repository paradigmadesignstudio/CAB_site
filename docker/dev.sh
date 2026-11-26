#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

git config --global --add safe.directory /var/www/html || true

if [[ ! -d vendor ]]; then
    composer install
fi

if [[ ! -f .env ]]; then
    cp .env.example .env
    php artisan key:generate
fi

touch database/database.sqlite
php artisan migrate --force

if [[ ! -d node_modules ]]; then
    npm install
fi

exec npx concurrently \
    -c "#93c5fd,#c4b5fd,#fb7185,#fdba74" \
    "php artisan serve --host=0.0.0.0 --port=8000" \
    "php artisan queue:listen --tries=1 --timeout=0" \
    "php artisan pail --timeout=0" \
    "npm run dev" \
    --names=server,queue,logs,vite \
    --kill-others
