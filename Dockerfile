# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Enable standalone mode and build
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

ENV HOST 0.0.0.0

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy node_modules bundled inside standalone (should already have it)
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Run using standalone server
CMD ["node", "server.js"]