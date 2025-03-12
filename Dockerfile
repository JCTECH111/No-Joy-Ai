# Use an official PHP image with Apache
FROM php:8.2-apache  

# Enable required PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql  

# Copy all project files into the Apache root directory
COPY . /var/www/html/

# Expose port 80 for HTTP traffic
EXPOSE 80  

# Start Apache server
CMD ["apache2-foreground"]
