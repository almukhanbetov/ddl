FROM php:8.3-fpm

# 1️⃣ Системные зависимости
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install \
    pdo_pgsql \
    zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2️⃣ Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 3️⃣ Рабочая директория
WORKDIR /var/www

# 4️⃣ Копируем код проекта
COPY . .

# 5️⃣ Устанавливаем зависимости Laravel
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# 6️⃣ Права на storage и cache
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 7️⃣ OPcache (prod)
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini

# 8️⃣ Запуск PHP-FPM
CMD ["php-fpm"]

