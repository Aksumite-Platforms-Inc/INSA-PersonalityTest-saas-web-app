# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Disable network fetches to avoid EAI_AGAIN errors from fonts.googleapis.com
ENV NEXT_DISABLE_NETWORK_FETCHES=true

WORKDIR /app

# Copy package.json and package-lock.json for better layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application with standalone output
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

# Disable network fetches here as well, just in case
ENV NEXT_DISABLE_NETWORK_FETCHES=true
ENV NODE_ENV=production

WORKDIR /app

# Copy package.json and package-lock.json for production install
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy Next.js standalone output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy node_modules to ensure runtime dependencies are present
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

# Start the application (make sure the standalone server exists)
CMD ["node", "server.js"]
