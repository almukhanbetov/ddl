FROM php:8.3-fpm

# Системные зависимости
RUN apt update && apt install -y \
    libpq-dev \
    zip unzip git curl \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www

# Копируем только composer-файлы
COPY composer.json composer.lock ./

# Устанавливаем composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Устанавливаем зависимости (БЕЗ dev)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Копируем остальной код
COPY . .

# Права
RUN chown -R www-data:www-data /var/www

USER www-data
