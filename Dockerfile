FROM php:8.3-fpm

RUN apt update && apt install -y \
    nano \
    libpq-dev zip unzip git curl nodejs npm \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www

# Composer
COPY composer.json composer.lock ./
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ❗ отключаем scripts
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Frontend
COPY package.json package-lock.json ./
RUN npm install && npm run build

# Код
COPY . .

# Теперь scripts можно запускать
RUN php artisan package:discover --ansi || true

RUN chown -R www-data:www-data /var/www
USER www-data
