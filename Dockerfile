# =========================================================
# STAGE 1 - Build Vite app
# =========================================================
FROM node:22.12.0 AS builder

WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Bỏ qua check version của Vite
ENV VITE_SKIP_NODE_VERSION_CHECK=true

# Build Vite app
RUN npm run build

# =========================================================
# STAGE 2 - Serve static files with Caddy
# =========================================================
FROM caddy:2.8.4

# Copy Caddy config
COPY ./Caddyfile /etc/caddy/Caddyfile

# Copy built Vite files from previous stage
COPY --from=builder /app/dist /usr/share/caddy

# Expose port 80 (for EasyPanel or Docker)
EXPOSE 80

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
