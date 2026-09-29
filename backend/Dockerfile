# ==========================================
# Dockerfile - Backend Portal de Solicitações
# bit Soluções
# ==========================================
FROM node:22-bookworm-slim AS build

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código-fonte e compilar TypeScript
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ==========================================
# Estágio de Produção
# ==========================================
FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_PATH=/app/data/solicitacoes.db

# Copiar dependências de produção apenas
COPY package*.json ./
RUN npm ci --only=production

# Copiar build e scripts de schema
COPY --from=build /app/dist ./dist
COPY database/ /app/database/

# Criar pasta para persistência do SQLite
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "dist/server.js"]
