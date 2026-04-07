FROM php:8.3-cli-alpine

# Clear default entrypoint (Railway cannot find docker-php-entrypoint)
ENTRYPOINT []

# Install PHP extensions
RUN apk add --no-cache \
    git curl zip unzip \
    libpng-dev libxml2-dev libzip-dev oniguruma-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml zip gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application source
COPY . .

# Discover packages (needed because --no-scripts skips auto-discovery)
RUN php artisan package:discover --ansi || true

# Set storage permissions
RUN mkdir -p storage/framework/views storage/framework/cache \
        storage/framework/sessions storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
