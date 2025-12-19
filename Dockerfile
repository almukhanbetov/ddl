# =========================
# 1️⃣ Frontend build (Node)
# =========================
FROM node:22-alpine AS frontend
WORKDIR /app
# Устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm ci

# Копируем только то, что нужно для Vite
COPY resources ./resources
COPY public ./public
COPY vite.config.js tailwind.config.js postcss.config.js ./
# Сборка фронта
RUN npm run build
# =========================
# 2️⃣ Backend (PHP + Laravel)
# =========================
FROM php:8.3-fpm
RUN apt update && apt install -y \
    nano \
    libpq-dev \
    zip unzip git curl \
    && docker-php-ext-install pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

# Composer
COPY composer.json composer.lock ./
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Устанавливаем PHP-зависимости БЕЗ scripts
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-scripts

# Копируем весь Laravel
COPY . .

# Копируем собранный фронт
COPY --from=frontend /app/public /var/www/public

# Laravel post scripts
RUN php artisan package:discover --ansi || true

# Права
RUN chown -R www-data:www-data /var/www

USER www-data

