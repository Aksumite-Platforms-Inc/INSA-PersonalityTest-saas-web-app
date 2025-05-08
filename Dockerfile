# ...existing code...
# Stage 1: Build app with Bun
FROM oven/bun:1 AS builder

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build
RUN bunx next export

# Stage 2: Serve with NGINX
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Copy static export output
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# ...existing code...
