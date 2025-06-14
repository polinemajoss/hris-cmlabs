# backend/Dockerfile

# Gunakan base image PHP 8.2 FPM
FROM php:8.2-fpm

# Install dependensi yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libpq-dev \
    nodejs \
    npm

# Install ekstensi PHP
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy source code
COPY . .

# Install dependensi composer
RUN composer install --no-interaction --no-plugins --no-scripts --prefer-dist

# Ubah kepemilikan file
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port 9000 untuk FPM
EXPOSE 9000

# Jalankan PHP-FPM
CMD ["php-fpm"]
