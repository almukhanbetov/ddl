FROM php:8.3-fpm

# Системные зависимости
RUN apt update && apt install -y \
    nano \
    libpq-dev zip unzip git curl nodejs npm \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www

# Composer
COPY composer.json composer.lock ./
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Frontend
COPY package.json package-lock.json ./
RUN npm install && npm run build

# Код
COPY . .

# Права
RUN chown -R www-data:www-data /var/www
USER www-data
