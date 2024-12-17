# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    npm install --include=optional && \
    npm rebuild @rollup/rollup-linux-x64-gnu

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - using smaller nginx image
FROM nginx:1.24-alpine AS production

# Copy only the built files and nginx configuration
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add a healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q --spider http://localhost:80/ || exit 1

EXPOSE 80

# Explicitly set the entrypoint and cmd
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
