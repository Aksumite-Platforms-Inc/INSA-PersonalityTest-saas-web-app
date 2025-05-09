# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Prevent network fetches during build (avoid fonts.googleapis.com EAI_AGAIN errors)
ENV NEXT_DISABLE_NETWORK_FETCHES=true

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

# Environment setup
ENV NODE_ENV=production
ENV NEXT_DISABLE_NETWORK_FETCHES=true

WORKDIR /app

# Copy only what's needed for production
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy Next.js build output and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Run the Next.js production server
CMD ["npx", "next", "start", "-p", "3000"]