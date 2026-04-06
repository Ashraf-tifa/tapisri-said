#!/bin/sh
set -e

echo "==> Clearing any stale config cache..."
rm -f /app/bootstrap/cache/config.php
rm -f /app/bootstrap/cache/routes-v7.php

echo "==> Running migrations..."
/usr/local/bin/php artisan migrate --force

echo "==> Starting server..."
exec /usr/local/bin/php artisan serve --host=0.0.0.0 --port=8080
