#!/bin/sh

echo "Waiting for PostgreSQL to start..."
# Wait for PostgreSQL to start
/app/wait-for-it.sh db:5432 -t 60

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed the database if needed
echo "Seeding the database..."
npx prisma db seed

# Start the application
echo "Starting the application..."
npm run start