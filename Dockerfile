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

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/nginx.conf

# Copy nginx template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Create cache directories
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx

EXPOSE 80

# Use shell form to expand environment variables
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
