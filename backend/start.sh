#!/bin/sh
set -e

echo "==> Clearing config cache..."
/usr/local/bin/php /app/artisan config:clear

echo "==> Caching fresh config..."
/usr/local/bin/php /app/artisan config:cache

echo "==> Running migrations..."
/usr/local/bin/php /app/artisan migrate --force

echo "==> Starting Apache on port 8080..."
exec apache2-foreground
