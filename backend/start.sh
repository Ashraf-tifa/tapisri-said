#!/bin/sh
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

PORT="${PORT:-8080}"
echo "==> PORT is $PORT"

# Configure Apache to listen on the correct port (Railway sets PORT env var)
echo "Listen $PORT" > /etc/apache2/ports.conf
sed -i "s/APACHE_PORT/$PORT/g" /etc/apache2/sites-available/000-default.conf

# Create required runtime directories
mkdir -p /var/run/apache2 /var/lock/apache2 /var/log/apache2

echo "==> Checking Apache config..."
apache2 -t 2>&1 || true

echo "==> Clearing config cache..."
/usr/local/bin/php /app/artisan config:clear || true

echo "==> Caching config..."
/usr/local/bin/php /app/artisan config:cache || true

echo "==> Running migrations..."
/usr/local/bin/php /app/artisan migrate --force || true

echo "==> Starting Apache on port $PORT..."
exec /usr/local/bin/apache2-foreground
