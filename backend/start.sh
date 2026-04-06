#!/bin/sh
set -e

echo "==> Clearing config cache..."
php artisan config:clear

echo "==> Caching config..."
php artisan config:cache

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Starting server..."
exec php artisan serve --host=0.0.0.0 --port=8080
