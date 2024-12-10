# Use the PHP image with Apache
FROM php:8.2-apache

# Update the package manager and install system dependencies for PHP extensions
RUN apt-get update && apt-get install -y \
    libmariadb-dev \
    libonig-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache mod_rewrite for PHP routing
RUN a2enmod rewrite

# Set the document root
WORKDIR /var/www/html

# Expose Apache port
EXPOSE 80
