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

# Production stage
FROM nginx:1.24-alpine

# Copy only the built files and nginx configuration
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
