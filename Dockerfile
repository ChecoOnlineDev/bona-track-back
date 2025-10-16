# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Copiar el resto de los archivos
COPY . .

# Compilar TypeScript a JavaScript
RUN pnpm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar solo lo necesario desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Instalar solo producción
RUN pnpm ci --only=production

# Puerto expuesto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["pnpm", "run", "start:prod"]
