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
RUN docker-php-ext-install mysqli

# Set working directory
WORKDIR /var/www/html

# Copy PHP backend files
COPY backend/php/ .

RUN echo "session.save_path=\"/tmp\""

# Configure Apache
RUN a2enmod rewrite

# Stage 3: Frontend (Nginx) Build
FROM nginx:alpine AS frontend-build
# Copy website files
COPY website/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Stage 4: Final Production Image
FROM php:8.2-apache AS production

# Install additional utilities
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    nginx

# Clean up apt cache
RUN rm -rf /var/lib/apt/lists/*

# Create application directory
WORKDIR /app

# Copy built artifacts from previous stages
COPY --from=nodejs-backend-build /app/backend/nodejs /app/backend/nodejs
COPY --from=php-backend-build /var/www/html /var/www/html
COPY --from=frontend-build /usr/share/nginx/html/ /app/website
COPY --from=frontend-build /etc/nginx/nginx.conf /etc/nginx/nginx.conf

# Configure Apache to serve both PHP backend and static files
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>\n\
\n\
<VirtualHost *:8080>\n\
    DocumentRoot /app/website\n\
    <Directory /app/website>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Expose ports for different services
EXPOSE 80 8080 3000

# Create startup script
RUN echo '#!/bin/bash\n\
service nginx start\n\
cd /app/backend/nodejs && node server.js &\n\
apache2ctl -D FOREGROUND\n\
' > /start.sh && \
    chmod +x /start.sh

# Default command to start all services
CMD ["/start.sh"]