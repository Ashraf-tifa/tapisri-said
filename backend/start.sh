#!/bin/sh

echo "==> Working directory: $(pwd)"
echo "==> PHP: $(/usr/local/bin/php -v | head -1)"

echo "==> Clearing config cache..."
/usr/local/bin/php /app/artisan config:clear || true

echo "==> Caching fresh config..."
/usr/local/bin/php /app/artisan config:cache || true

echo "==> Running migrations..."
/usr/local/bin/php /app/artisan migrate --force || true

echo "==> Starting Apache..."
exec /usr/local/bin/apache2-foreground
