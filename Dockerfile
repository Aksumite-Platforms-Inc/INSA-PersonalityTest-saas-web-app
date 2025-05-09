# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

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

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package.json and package-lock.json for production install
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy Next.js standalone output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ensure .next/standalone has its node_modules (in some setups, it’s self-contained)
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
