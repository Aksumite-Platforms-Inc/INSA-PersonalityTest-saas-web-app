# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the full project
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy only needed files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]