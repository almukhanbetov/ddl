# -------------------------------
# 1️⃣ Frontend build
# -------------------------------
# =========================
# 1️⃣ Frontend build (Vite)
# =========================
FROM node:22-alpine AS node-builder

WORKDIR /app

# Только то, что нужно для build
COPY package.json package-lock.json ./
RUN npm ci

COPY resources ./resources
COPY vite.config.js tailwind.config.js postcss.config.js ./
RUN npm run build
# =========================
# 2️⃣ PHP / Laravel runtime
# =========================
FROM php:8.3-fpm-alpine

# ---- System deps (минимум!) ----
RUN apk add --no-cache \
    git unzip libzip-dev oniguruma-dev postgresql-dev \
 && docker-php-ext-install pdo pdo_pgsql zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# ---- Копируем Laravel проект (БЕЗ node_modules, .git, tests) ----
COPY . .

# ---- Composer prod install ----
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# ---- Storage (КРИТИЧНО) ----
RUN mkdir -p storage/framework/cache/data \
             storage/framework/views \
             storage/framework/sessions \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

# ---- Storage symlink (без падения) ----
RUN php artisan storage:link || true

# ---- Laravel optimize (без env-зависимостей) ----
RUN php artisan optimize || true

# ---- Frontend artifacts ----
COPY --from=node-builder /app/public/build ./public/build

# ---- Безопасность ----
USER www-data

EXPOSE 9000
CMD ["php-fpm"]

