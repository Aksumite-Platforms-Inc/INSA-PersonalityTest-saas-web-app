# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Prevent network fetch delays during build (like Google Fonts)
ENV NEXT_DISABLE_NETWORK_FETCHES=true

WORKDIR /app

# Copy package files for better caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

# Set production environment
ENV NODE_ENV=production
ENV NEXT_DISABLE_NETWORK_FETCHES=true

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the built app (non-standalone)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose port 3000
EXPOSE 3000

# Start the app using next start
CMD ["npm", "start"]