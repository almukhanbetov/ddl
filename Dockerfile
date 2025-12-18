FROM php:8.3-fpm

RUN apt update && apt install -y \
    libpq-dev zip unzip git \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www

# 👇 ВАЖНО
RUN chown -R www-data:www-data /var/www
USER www-data