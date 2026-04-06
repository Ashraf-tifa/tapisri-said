#!/bin/sh

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

echo "==> Clearing config cache..."
php /app/artisan config:clear || true

echo "==> Caching fresh config..."
php /app/artisan config:cache || true

echo "==> Running migrations..."
php /app/artisan migrate --force || true

echo "==> Starting Apache on port 8080..."
exec apache2-foreground
