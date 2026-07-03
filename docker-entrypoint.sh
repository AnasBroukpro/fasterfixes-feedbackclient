#!/bin/sh
set -e

echo "Running database migrations..."

# Prisma v7 needs the config file for the datasource URL
cd /app/packages/database
./node_modules/.bin/prisma migrate deploy --config=prisma.config.ts

echo "Starting app..."
cd /app
exec "$@"
