# syntax=docker/dockerfile:1
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy prisma schema first and generate Prisma Client for both host and Alpine
COPY prisma/schema.prisma prisma/
RUN npx prisma generate

# Copy rest of the code and build
COPY . .
RUN npm run build

# Final production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install netcat for the wait-for-it script
RUN apk add --no-cache netcat-openbsd

# Copy built artifacts and dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Copy startup scripts
COPY wait-for-it.sh ./wait-for-it.sh
COPY start.sh ./start.sh
RUN chmod +x ./wait-for-it.sh ./start.sh

EXPOSE 3000
CMD ["./start.sh"]
