FROM php:8.3-fpm-alpine

# Install nginx + PHP extensions
RUN apk add --no-cache \
    nginx git curl zip unzip \
    libpng-dev libxml2-dev libzip-dev oniguruma-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml zip gd \
    && rm -rf /var/cache/apk/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application source
COPY . .

# Set storage permissions
RUN mkdir -p storage/framework/views storage/framework/cache \
        storage/framework/sessions storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data /app

# Copy config files
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
