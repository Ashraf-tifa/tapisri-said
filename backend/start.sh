#!/bin/sh
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

PORT="${PORT:-8080}"
echo "==> PORT=$PORT"

echo "==> Clearing all caches..."
php /app/artisan config:clear || true
php /app/artisan route:clear || true
php /app/artisan cache:clear || true

echo "==> Caching config..."
php /app/artisan config:cache || true

echo "==> Running migrations..."
php /app/artisan migrate --force || true

echo "==> Seeding admin user..."
php /app/artisan db:seed --class=AdminSeeder --force || true

echo "==> Creating storage symlink..."
php /app/artisan storage:link --force || true

echo "==> Starting server on 0.0.0.0:$PORT ..."
exec php /app/artisan serve --host=0.0.0.0 --port=$PORT
