# frontend/Dockerfile

# STAGE 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Pastikan NEXT_PUBLIC_API_URL sudah diset di environment atau di sini
ENV NEXT_PUBLIC_API_URL=http://your_domain_or_ip/api
RUN npm run build

# STAGE 2: Production
FROM nginx:stable-alpine
COPY --from=builder /app/out /usr/share/nginx/html
# Jika menggunakan Next.js SSR, copy folder .next/standalone dan server.js
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public

# Hapus konfigurasi default Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
