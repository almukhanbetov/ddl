FROM php:8.3-fpm

RUN apt update && apt install -y \
    nano \
    libpq-dev zip unzip git curl \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www

# composer
COPY composer.json composer.lock ./
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 🔒 БЕЗ scripts (artisan не нужен)
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-scripts

# копируем Laravel
COPY . .

# вручную package:discover (artisan уже есть)
RUN php artisan package:discover --ansi || true

RUN chown -R www-data:www-data /var/www
USER www-data
