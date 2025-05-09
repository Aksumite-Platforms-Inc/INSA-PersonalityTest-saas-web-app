# Stage 1: Build with Bun
FROM oven/bun:1.1.10 AS builder
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

# Stage 2: Serve with Node.js
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/node_modules node_modules

ENV PORT=3000
EXPOSE 3000
CMD ["bun", "run", "start"]
