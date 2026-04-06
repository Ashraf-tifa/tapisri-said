#!/bin/sh
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

echo "==> Starting PHP-FPM..."
php-fpm -D
echo "PHP-FPM started, PID: $(cat /var/run/php-fpm.pid 2>/dev/null || echo 'unknown')"

echo "==> Artisan setup..."
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
echo "==> Testing nginx config..."
nginx -t 2>&1

echo "==> Starting Nginx on port 8080..."
exec nginx -g "daemon off;"
