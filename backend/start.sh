#!/bin/sh
set -e

echo "==> Clearing config cache..."
/usr/local/bin/php artisan config:clear

echo "==> Caching fresh config (with CORS wildcard)..."
/usr/local/bin/php artisan config:cache

echo "==> Running migrations..."
/usr/local/bin/php artisan migrate --force

echo "==> Starting server on port 8080..."
exec /usr/local/bin/php artisan serve --host=0.0.0.0 --port=8080
