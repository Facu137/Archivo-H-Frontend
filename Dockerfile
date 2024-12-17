# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Install npm explicitly
RUN apt-get update && apt-get install -y npm

# Copy package files
COPY package*.json ./

# Install dependencies with specific flags
RUN npm install --no-optional && \
    npm install @rollup/rollup-linux-x64-gnu --no-save

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.24-alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx pid directory
RUN mkdir -p /run/nginx

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
