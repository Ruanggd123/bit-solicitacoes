# ==========================================
# Dockerfile - Frontend Portal de Solicitações
# bit Soluções
# ==========================================
FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

# ==========================================
# Estágio de Servidor Nginx Otimizado
# ==========================================
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
