# Multi-Stage Dockerfile for Full-Stack Application

# Stage 1: Node.js Backend Build
FROM node:20-alpine AS nodejs-backend-build
WORKDIR /app/backend/nodejs

# Copy Node.js backend files
COPY backend/nodejs/package*.json ./
RUN npm install

# Copy rest of the backend code
COPY backend/nodejs/ .

# Stage 2: PHP Backend Build
FROM php:8.2-apache AS php-backend-build
# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring

# Set working directory
WORKDIR /var/www/html

# Copy PHP backend files
COPY backend/php/ .

# Configure Apache
RUN a2enmod rewrite

# Stage 3: Frontend (Nginx) Build
FROM nginx:alpine AS frontend-build
# Copy website files
COPY website/ /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Stage 4: Final Production Image
FROM node:20-alpine AS production

# Install necessary utilities
RUN apk add --no-cache \
    nodejs \
    npm \
    php \
    apache2 \
    nginx

# Create application directory
WORKDIR /app

# Copy built artifacts from previous stages
COPY --from=nodejs-backend-build /app/backend/nodejs /app/backend/nodejs
COPY --from=php-backend-build /var/www/html /app/backend/php
COPY --from=frontend-build /usr/share/nginx/html /app/website
COPY --from=frontend-build /etc/nginx/nginx.conf /etc/nginx/nginx.conf

# Expose ports for different services
EXPOSE 3000 80 8080

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'nginx -g "daemon off;" &' >> /start.sh && \
    echo 'cd /app/backend/nodejs && node server.js &' >> /start.sh && \
    echo 'php -S 0.0.0.0:8080 -t /app/backend/php &' >> /start.sh && \
    echo 'wait -n' >> /start.sh && \
    chmod +x /start.sh

# Default command to start all services
CMD ["/start.sh"]