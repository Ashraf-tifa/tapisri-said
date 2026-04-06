FROM php:8.3-apache

# Override PHP image entrypoint (Railway can't find docker-php-entrypoint)
ENTRYPOINT []

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libxml2-dev libzip-dev libonig-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml zip gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite headers

# Configure Apache to listen on port 8080
RUN sed -i 's/Listen 80$/Listen 8080/' /etc/apache2/ports.conf \
    && sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf

# Set document root to Laravel's public folder
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /app/public|' /etc/apache2/sites-available/000-default.conf

# Allow .htaccess and set directory options
RUN printf '<Directory /app/public>\n    AllowOverride All\n    Require all granted\n</Directory>\n' \
    >> /etc/apache2/sites-available/000-default.conf

# Add CORS headers globally via Apache (most reliable approach)
RUN printf 'Header always set Access-Control-Allow-Origin "*"\nHeader always set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"\nHeader always set Access-Control-Allow-Headers "Content-Type, Authorization, Accept, X-Requested-With"\nHeader always set Access-Control-Max-Age "86400"\n' \
    > /etc/apache2/conf-available/cors.conf \
    && a2enconf cors

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application files
COPY . .

# Set permissions
RUN mkdir -p storage/framework/views storage/framework/cache \
        storage/framework/sessions storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data /app

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
