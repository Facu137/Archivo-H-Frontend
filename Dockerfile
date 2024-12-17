# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN apt-get update && \
    apt-get install -y npm && \
    npm install --omit=optional

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.24-alpine

# Copy only the built files and nginx configuration
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create required nginx directories
RUN mkdir -p /run/nginx

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
