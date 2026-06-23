#!/bin/bash
# Build script for Vercel — switches Prisma provider to postgresql, 
# generates client, pushes schema, then builds Next.js

set -e

echo "=== Vercel Build Script ==="

# Switch Prisma provider to postgresql for production
if [ -n "$DATABASE_URL" ] && [[ "$DATABASE_URL" == postgresql://* ]]; then
  echo "PostgreSQL DATABASE_URL detected — switching Prisma provider..."
  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
  echo "Prisma provider set to: $(grep 'provider = ' prisma/schema.prisma | head -1)"
fi

echo "=== Prisma Generate ==="
prisma generate

echo "=== Prisma DB Push ==="
prisma db push --accept-data-loss

echo "=== Next.js Build ==="
next build
