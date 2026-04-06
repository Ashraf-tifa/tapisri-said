#!/bin/sh
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

PORT="${PORT:-8080}"
echo "==> PORT is $PORT"

# Inject port into nginx config
sed -i "s/NGINX_PORT/$PORT/g" /etc/nginx/nginx.conf

# Artisan setup
echo "==> Clearing config cache..."
php /app/artisan config:clear || true

echo "==> Caching config..."
php /app/artisan config:cache || true

echo "==> Running migrations..."
php /app/artisan migrate --force || true

# Start PHP-FPM as background daemon
echo "==> Starting PHP-FPM..."
php-fpm -D

# Start Nginx in foreground (keeps container alive)
echo "==> Starting Nginx on port $PORT..."
exec nginx -g "daemon off;"
