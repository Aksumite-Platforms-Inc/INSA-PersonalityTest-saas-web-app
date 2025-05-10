# syntax=docker.io/docker/dockerfile:1

# Use official Node image with build tools
FROM node:18.20.2-bullseye-slim AS base

# Stage 1: Install system dependencies
FROM base AS deps
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with clean cache
RUN npm ci --no-audit --prefer-offline --no-optional \
    && npm cache clean --force

# Stage 2: Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Memory optimization configuration
ENV NODE_OPTIONS="--max-old-space-size=16384"
ENV NEXT_TELEMETRY_DISABLED=1
ENV GENERATE_SOURCEMAP=false

# Optimized Next.js config
RUN echo "module.exports = { \
  output: 'standalone', \
  experimental: { \
    webpackBuildWorker: false, \
    cpus: 1, \
    workerThreads: false \
  }, \
  compiler: { \
    styledComponents: true \
  } \
}" > next.config.js

# Build with memory limits
RUN npm run build

# Final production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -m nextjs && \
    mkdir -p /app/.next && \
    chown -R nextjs:nodejs /app

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]