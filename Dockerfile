FROM php:8.3-cli-bookworm

COPY --from=node:22-bookworm /usr/local/bin/node /usr/local/bin/node
COPY --from=node:22-bookworm /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        procps \
        sqlite3 \
        libsqlite3-dev \
        libzip-dev \
        libxml2-dev \
        libonig-dev \
    && docker-php-ext-install pdo_sqlite bcmath zip pcntl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

RUN git config --global --add safe.directory /var/www/html

WORKDIR /var/www/html

EXPOSE 8000 5173

CMD ["bash", "docker/dev.sh"]
