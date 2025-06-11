# TAHAP 1: Instalasi Dependency
# Menggunakan Node.js versi 18-alpine yang ringan
FROM node:18-alpine AS deps
# Set direktori kerja di dalam container
WORKDIR /app
# Salin file package.json dan package-lock.json
COPY package*.json ./
# Install semua dependency
RUN npm install --frozen-lockfile

# TAHAP 2: Build Aplikasi
# Menggunakan base image yang sama
FROM node:18-alpine AS builder
WORKDIR /app
# Salin dependency dari tahap 'deps'
COPY --from=deps /app/node_modules ./node_modules
# Salin semua sisa kode aplikasi
COPY . .
# Jalankan perintah build untuk Next.js
RUN npm run build

# TAHAP 3: Menjalankan Aplikasi Produksi
# Menggunakan base image yang sama untuk menjaga image tetap kecil
FROM node:18-alpine AS runner
WORKDIR /app
# Set environment ke production
ENV NODE_ENV production

# Salin hanya artefak build yang diperlukan dari tahap 'builder'
COPY --from=builder /app/public ./public
# Folder .next berisi hasil build dari Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Buka port 3000 (port default Next.js)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD ["npm", "start"]
