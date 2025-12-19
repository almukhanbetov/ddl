FROM php:8.3-fpm

RUN apt update && apt install -y \
    nano \
    libpq-dev zip unzip git curl \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www

COPY composer.json composer.lock ./
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN composer install --no-dev --optimize-autoloader

COPY . .

RUN php artisan package:discover --ansi || true
RUN chown -R www-data:www-data /var/www

USER www-data
