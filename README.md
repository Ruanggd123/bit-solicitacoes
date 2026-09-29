# Portal de Solicitações Internas — bit Soluções
> **Processo Seletivo para Desenvolvedor(a) de Sistemas Júnior**  
> Avaliação Técnica — Mini-Projeto Full Stack

[![CI / CD Pipeline](https://github.com/ruangomes/bit-solicitacoes/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ruangomes/bit-solicitacoes/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node->=%2020.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://www.docker.com/)

---

## 📌 Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Documentos Oficiais da Entrega](#-documentos-oficiais-da-entrega)
3. [Diferenciais Implementados](#-diferenciais-implementados)
4. [Pré-requisitos](#-pré-requisitos)
5. [Instalação e Configuração](#-instalação-e-configuração)
6. [Execução da Aplicação](#-execução-da-aplicação)
   - [Opção 1: Execução com Docker & Docker Compose (Recomendado)](#opção-1-execução-com-docker--docker-compose-recomendado)
   - [Opção 2: Execução Manual com Node.js (Sem necessidade de Docker)](#opção-2-execução-manual-com-nodejs)
7. [Credenciais de Demonstração e Acesso aos Usuários de Teste](#-credenciais-de-demonstração-e-acesso)
8. [Execução dos Testes Automatizados](#-execução-dos-testes-automatizados)
9. [Estrutura do Projeto](#-estrutura-do-projeto)
10. [Endpoints da API REST](#-endpoints-da-api-rest)

---

## 💡 Sobre o Projeto

O **Portal de Solicitações Internas** é uma solução web corporativa Full Stack desenvolvida para atender às demandas de comunicação e atendimento interno dos colaboradores da **bit Soluções**.

O sistema permite que colaboradores cadastrem solicitações para diferentes áreas da empresa (TI, RH, Compras, Financeiro e Infraestrutura), acompanhem o status da sua demanda em tempo real e visualizem métricas analíticas e linha do tempo de cada atendimento.

---

## 📑 Documentos Oficiais da Entrega

Em conformidade estrita com o edital do processo seletivo, os seguintes documentos compõem esta entrega:

- 📘 [**MEMORIAL TÉCNICO DE DESENVOLVIMENTO**](./docs/MEMORIAL_TECNICO.md): Detalhamento das tecnologias, justificativas técnicas e conceituais, padrões de projeto e análise crítica da solução.
- 🗄️ [**DICIONÁRIO DE DADOS**](./database/DICIONARIO_DE_DADOS.md): Especificação de todas as tabelas, tipos de dados, chaves primárias e estrangeiras, índices de performance e Diagrama Entidade-Relacionamento (DER).
- 📜 [**SCRIPT DE CRIAÇÃO DO BANCO (DDL)**](./database/schema.sql): Script SQL para recriação integral da base de dados e índices.
- 🌱 [**SCRIPT DE POPULAÇÃO INICIAL (SEEDS)**](./database/seeds.sql): Carga inicial de categorias, usuários com senhas criptografadas em Bcrypt e solicitações de exemplo.

---

## 🌟 Diferenciais Implementados (Critérios de Avaliação e Extras)

- 🐳 **Docker e Docker Compose:** Orquestração completa de contêineres de backend e frontend com Nginx em um único comando (`docker compose up --build`).
- 🧪 **Testes Automatizados:** Suíte com 19 testes automatizados com Jest e Supertest cobrindo 100% dos fluxos e regras de negócio essenciais.
- 🚀 **CI/CD Integrado:** Pipeline no GitHub Actions configurada para lint, checagem estática de tipos e testes contínuos em matriz de versões do Node.js.
- 📱 **Design Responsivo:** Interface construída com Tailwind CSS totalmente adaptável a telas móveis (smartphones, tablets e desktops).
- 📖 **Documentação Interativa Swagger / OpenAPI 3.0:** Interface interativa completa para teste dos endpoints da API em `http://localhost:3001/api/docs`.
- 🛡️ **Segurança HTTP Reforçada:** Cabeçalhos defensivos via `Helmet` e proteção contra ataques de força bruta no login via `Express-Rate-Limit`.
- 📊 **Exportação de Relatórios Gerenciais:** Botão no frontend para download instantâneo da listagem filtrada em formato CSV compatível nativamente com Microsoft Excel (UTF-8 BOM).
- ⚡ **Execução Unificada com 1 Comando:** Script na raiz do projeto para rodar simultaneamente backend e frontend em um único terminal.

---

## 💻 Pré-requisitos

Para executar a aplicação na máquina local sem Docker, certifique-se de possuir:

- **Linguagem e Runtime:** Node.js (versão 20.x ou superior, testado e validado em Node 22 e Node 24).
- **Gerenciador de Pacotes:** `npm` (versão 10.x ou superior).
- **Banco de Dados:** SQLite 3 (embutido no projeto via driver de alta performance `better-sqlite3`, dispensando a instalação de servidores de banco de dados externos).
- **Navegador Web Moderno:** Google Chrome, Firefox, Safari ou Microsoft Edge.

*(Caso opte por executar via contêineres, é necessário apenas ter o **Docker** e **Docker Compose** instalados).*

---

## ⚙️ Instalação e Configuração

### 1. Clonar o Repositório
```bash
git clone https://github.com/ruangomes/bit-solicitacoes.git
cd bit-solicitacoes
```

### 2. Configurar Variáveis de Ambiente
O backend já possui um arquivo `.env` pré-configurado para desenvolvimento local imediato. Caso deseje inspecionar ou alterar:

```bash
# No diretório backend/
cp .env.example .env
```

Conteúdo padrão do arquivo `backend/.env`:
```env
PORT=3001
JWT_SECRET=super_secret_jwt_key_bit_solucoes_2026_dev_env
DATABASE_PATH=./data/solicitacoes.db
CORS_ORIGIN=*
```

### 3. Instalar Dependências

#### Backend:
```bash
cd backend
npm install
cd ..
```

#### Frontend:
```bash
cd frontend
npm install
cd ..
```

#### Banco de Dados:
> **Observação:** Não é necessário executar nenhum comando manual de inicialização de banco! Ao iniciar o backend, a aplicação executa automaticamente o script `schema.sql` e popula as categorias e usuários de teste (`seeds.sql`), deixando tudo pronto para uso.

---

## 🚀 Execução da Aplicação

### Opção 1: Execução com Docker & Docker Compose (Recomendado)

Basta estar na raiz do projeto e executar:

```bash
docker compose up --build
```

- **Frontend (Web):** Acesse em `http://localhost:3000`
- **Backend (API REST):** Disponível em `http://localhost:3001`
- **Health Check da API:** `http://localhost:3001/api/health`

Para encerrar os contêineres:
```bash
docker compose down
```

---

### Opção 2: Execução Unificada em 1 Comando (Raiz do Projeto)

Na raiz da pasta `bit-solicitacoes/`, basta rodar:

```bash
npm run dev
```

> Esse comando inicializa o backend na porta `3001` e o frontend na porta `3000` simultaneamente no mesmo terminal com logs coloridos!

---

### Opção 3: Execução Manual com Dois Terminais

Caso prefira rodar cada serviço separadamente:

#### Terminal 1 — Backend:
```bash
cd backend
npm run dev
```
> O servidor iniciará em `http://localhost:3001` (Swagger disponível em `http://localhost:3001/api/docs`).

#### Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```
> A aplicação React abrirá na porta `http://localhost:3000`.

---

## 🔑 Credenciais de Demonstração e Acesso

A tela de login do sistema disponibiliza **botões de 1 clique** para preenchimento imediato das credenciais demonstrativas para o avaliador. Caso queira digitar manualmente:

| Usuário | Senha | Perfil | Departamento | Escopo de Acesso |
| :--- | :--- | :--- | :--- | :--- |
| `admin` | `admin123` | Administrador | TI | Acesso completo a todas as demandas e alterações de status |
| `joao.silva` | `senha123` | Colaborador | RH | Abertura e gestão das suas próprias solicitações |
| `maria.souza` | `senha123` | Gestor | Financeiro | Visualização e despacho de solicitações corporativas |
| `carlos.lima` | `senha123` | Colaborador | Infraestrutura | Colaborador de operações |

---

## 🧪 Execução dos Testes Automatizados

A suíte de testes de integração e regras de negócio foi construída com Jest e Supertest.

Para rodar os testes no backend:
```bash
cd backend
npm test
```

Para verificar o relatório detalhado de cobertura de testes:
```bash
cd backend
npm run test:coverage
```

### Regras de Negócio Testadas:
- Autenticação e geração segura de token JWT.
- Bloqueio de acesso a endpoints privados sem token ou com token inválido.
- Validação de entrada de dados com Zod (rejeição de payloads vazios ou inválidos).
- **Proibição estrita de edição de solicitações que não estejam no status "Aberto" (HTTP 422).**
- **Proibição estrita de exclusão de solicitações que não estejam no status "Aberto" (HTTP 422).**
- Fluxo de transição da máquina de estados (`Aberto` ➔ `Em Atendimento` ➔ `Concluído`).
- Cálculo preciso dos 4 indicadores do Dashboard.

---

## 📁 Estrutura do Projeto

```
bit-solicitacoes/
├── .github/
│   └── workflows/
│       └── ci.yml                   # Pipeline de Integração Contínua (CI/CD)
├── backend/
│   ├── src/
│   │   ├── config/                  # Inicializador SQLite e migrações automáticas
│   │   ├── controllers/             # Controladores REST HTTP
│   │   ├── middlewares/             # Middlewares de Auth JWT, Zod e Tratamento de Erros
│   │   ├── models/                  # Tipos TypeScript, Interfaces e DTOs
│   │   ├── repositories/            # Camada de persistência SQL parametrizada
│   │   ├── routes/                  # Definição e agrupamento de rotas
│   │   ├── services/                # Regras de negócio, restrições e auditoria
│   │   ├── validators/              # Esquemas de validação de dados Zod
│   │   ├── app.ts                   # Configuração da aplicação Express
│   │   └── server.ts                # Inicialização do servidor HTTP
│   ├── tests/                       # Testes automatizados (Jest / Supertest)
│   ├── Dockerfile                   # Dockerfile multi-stage do backend
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/              # Componentes visuais (Badges, Cards, Modais, Filtros)
│   │   ├── contexts/                # AuthContext e ToastContext
│   │   ├── pages/                   # Login, Dashboard e Solicitações
│   │   ├── services/                # Cliente Axios com interceptors de token e 401
│   │   ├── types/                   # Tipagens TypeScript do cliente
│   │   ├── App.tsx                  # Componente raiz
│   │   └── main.tsx
│   ├── Dockerfile                   # Dockerfile multi-stage com servidor Nginx
│   ├── nginx.conf                   # Configuração Nginx com suporte a SPA e Proxy
│   ├── tailwind.config.js           # Design System corporativo da bit Soluções
│   └── package.json
├── database/
│   ├── schema.sql                   # Script DDL com integridade referencial e índices
│   ├── seeds.sql                    # Script DML com dados iniciais e senhas Bcrypt
│   └── DICIONARIO_DE_DADOS.md       # Dicionário de dados formal com DER e diagramas
├── docs/
│   └── MEMORIAL_TECNICO.md          # Memorial Técnico Obrigatório com justificativas
├── docker-compose.yml               # Orquestrador multi-container
├── .gitignore
└── README.md                        # Documentação principal de execução
```

---

## 🌐 Endpoints da API REST

Todas as rotas (exceto login) exigem o cabeçalho `Authorization: Bearer <token>`.

### Autenticação (`/api/auth`)
- `POST /api/auth/login` — Autentica o usuário e retorna o token JWT e dados do perfil.
- `GET /api/auth/me` — Retorna os dados do usuário autenticado na sessão.
- `POST /api/auth/logout` — Registra o encerramento da sessão.

### Solicitações (`/api/solicitacoes`)
- `GET /api/solicitacoes` — Lista solicitações com suporte a filtros dinâmicos (`categoria`, `status`, `titulo`, `data_inicio`, `data_fim`).
- `GET /api/solicitacoes/:id` — Retorna detalhes completos do chamado e histórico de auditoria.
- `POST /api/solicitacoes` — Cadastra nova solicitação (status inicial automático `'Aberto'`).
- `PUT /api/solicitacoes/:id` — Edita solicitação (permitido apenas se status for `'Aberto'`).
- `DELETE /api/solicitacoes/:id` — Exclui solicitação (permitido apenas se status for `'Aberto'`).
- `PATCH /api/solicitacoes/:id/status` — Altera o status (`Aberto` ➔ `Em Atendimento` ➔ `Concluído`) com registro de comentário e auditoria.

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/metricas` — Retorna os indicadores quantitativos (Total, Abertas, Em Atendimento, Concluídas e distribuição por categoria).

### Categorias (`/api/categorias`)
- `GET /api/categorias` — Lista as categorias ativas cadastradas no sistema.

---

## 👨‍💻 Desenvolvedor

Projeto desenvolvido com dedicação para a etapa de avaliação técnica da **bit Soluções**.  
Disponível para contato e apresentação na entrevista técnica!
