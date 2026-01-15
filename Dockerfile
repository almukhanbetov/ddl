# -------------------------------
# 1️⃣ Frontend build
# -------------------------------
FROM node:22-alpine AS node-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY resources ./resources
COPY vite.config.js tailwind.config.js postcss.config.js ./
RUN npm run build

# -------------------------------
# 2️⃣ Laravel PHP
# -------------------------------
FROM php:8.3-fpm

RUN apt update && apt install -y \
    git unzip zip curl libpng-dev libzip-dev libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# 🔑 Сначала копируем ВЕСЬ Laravel проект
COPY . .

# 🔑 Теперь можно запускать composer
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-scripts \
    --no-interaction

# Laravel оптимизация
RUN php artisan storage:link || true \
    && php artisan optimize || true

# Frontend build from node
#COPY --from=node-builder /app/public/build ./public/build
COPY --from=node-builder /app/dist ./public/build
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

USER www-data

EXPOSE 9000
CMD ["php-fpm"]

