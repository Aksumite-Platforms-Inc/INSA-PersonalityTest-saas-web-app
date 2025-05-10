# syntax=docker.io/docker/dockerfile:1

# Use full Debian image with build essentials
FROM node:18.20.2-bullseye AS base

# Stage 1: Install dependencies
FROM base AS deps
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json* ./

# Clean install with cache cleanup
RUN npm ci --prefer-offline --no-audit && \
    npm cache clean --force

# Stage 2: Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Memory optimization config
ENV NODE_OPTIONS="--max-old-space-size=16384"
ENV NEXT_TELEMETRY_DISABLED=1
ENV GENERATE_SOURCEMAP=false

# Custom Next.js config for memory optimization
RUN echo "module.exports = { \
  swcMinify: true, \
  output: 'standalone', \
  experimental: { \
    webpackBuildWorker: false, \
    cpus: 1, \
    workerThreads: false, \
    memoryBasedWorkersCount: 1, \
    sharedPool: true \
  } \
}" > next.config.js

# Build with resource limits
RUN npm run build -- --debug

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