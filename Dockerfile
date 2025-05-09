# Stage 1: Build with Bun
FROM oven/bun:1 AS builder

WORKDIR /app


COPY  package.json ./

RUN bun install

COPY . .
RUN bun run build

# Stage 2: Run with Node.js
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
