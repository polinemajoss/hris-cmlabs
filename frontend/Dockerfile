# frontend/Dockerfile
FROM node:18-alpine

# Direktori kerja
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file frontend
COPY . .

# Build Next.js untuk produksi
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
