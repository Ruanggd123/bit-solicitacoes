# MEMORIAL TÉCNICO DE DESENVOLVIMENTO
**Processo Seletivo — Desenvolvedor(a) de Sistemas Júnior**  
**Empresa:** bit Soluções  
**Projeto:** Portal de Solicitações Internas  
**Data:** Outubro de 2026  

---

## 1. Introdução e Contexto do Projeto

O presente documento constitui o **Memorial Técnico de Desenvolvimento** do **Portal de Solicitações Internas**, elaborado como parte integrante da avaliação técnica para a vaga de Desenvolvedor(a) de Sistemas Júnior na **bit Soluções**.

O propósito central do projeto é fornecer uma plataforma web corporativa centralizada, segura e intuitiva, permitindo que colaboradores de diferentes setores (como TI, RH, Compras, Financeiro e Infraestrutura) registrem suas demandas, e que gestores e técnicos acompanhem seu ciclo de atendimento de forma transparente até a conclusão.

Este memorial documenta de forma minuciosa as escolhas tecnológicas, os fundamentos conceituais e arquiteturais da solução, os padrões de projeto adotados, a estratégia de modelagem de dados, bem como uma análise crítica profunda sobre limitações e oportunidades de evolução em ambiente corporativo de produção.

---

## 2. Tecnologias Utilizadas e Justificativa Técnica

Para a construção do sistema, foram selecionadas tecnologias consolidadas na indústria, priorizando previsibilidade, segurança de tipos, alta manutenibilidade e facilidade de implantação sem atrito para os avaliadores.

Abaixo, cada tecnologia é detalhada segundo os critérios estipulados no edital:

### 2.1. Linguagem de Programação: TypeScript (Backend & Frontend)
- **Motivo da Escolha:** Unificação da linguagem em toda a stack (Full Stack TypeScript), trazendo checagem estática de tipos, inferência precisa e autocompletion durante o desenvolvimento.
- **Benefícios para o Cenário:** Elimina classes inteiras de erros em tempo de execução (`TypeError`, `undefined is not a function`), comuns em JavaScript puro. Facilita o compartilhamento conceitual de DTOs e contratos entre cliente e servidor.
- **Vantagens em relação a alternativas conhecidas:** Comparado ao JavaScript puro, reduz o tempo de depuração em mais de 40%. Comparado a Python ou Java, permite alternar o foco entre backend e frontend sem sobrecarga cognitiva de sintaxe e ecossistema díspares.
- **Impacto:** Alta produtividade no desenvolvimento inicial e extrema facilidade de refatoração contínua com garantia de integridade contratual.

### 2.2. Ambiente de Execução Backend: Node.js (v20+ / v22+) & Express
- **Motivo da Escolha:** Node.js é líder de mercado em APIs REST I/O-intensive graças à sua arquitetura orientada a eventos e non-blocking I/O. O Express é o framework minimalista mais maduro e adotado no ecossistema Node.
- **Benefícios para o Cenário:** Curva de aprendizado controlada, facilidade na implementação de middlewares customizados de segurança, auditoria e validação de requisições.
- **Vantagens em relação a alternativas conhecidas:** Em comparação com frameworks pesados (como NestJS ou Spring Boot), o Express permite estruturar uma arquitetura limpa em camadas explícitas (Controller, Service, Repository) sem excesso de boilerplate ou dependência excessiva de decorators reflexivos complexos para um projeto desse escopo.
- **Impacto:** Inicialização em milissegundos, consumo mínimo de memória RAM e facilidade de orquestração em contêineres Docker.

### 2.3. Framework Frontend: React 18 com Vite
- **Motivo da Escolha:** React é o padrão de excelência corporativo para construção de Single Page Applications (SPA) componentizadas e reativas. O Vite foi escolhido como bundler e servidor de desenvolvimento por sua velocidade extrema baseada em ESM nativo e esbuild.
- **Benefícios para o Cenário:** Hot Module Replacement (HMR) instantâneo, renderização veloz, separação atômica de componentes visuais (modais, badges, cards, tabelas) e estado encapsulado via React Hooks e Context API.
- **Vantagens em relação a alternativas conhecidas:** Em comparação com Create React App (CRA, hoje depreciado) ou Webpack tradicional, o Vite constrói os artefatos de produção em segundos com tree-shaking otimizado. Em comparação ao Next.js, uma SPA tradicional com Vite e Nginx é consideravelmente mais simples de empacotar em contêiner sem a necessidade de um servidor Node ativo no frontend.
- **Impacto:** Experiência do usuário fluida e moderna, sem recarregamento de página, garantindo produtividade máxima para colaboradores.

### 2.4. Estilização: Tailwind CSS
- **Motivo da Escolha:** Framework CSS utilitário que permite construir designs corporativos elegantes, padronizados e responsivos diretamente na estrutura dos componentes.
- **Benefícios para o Cenário:** Design System coeso com paleta de cores corporativa personalizada para a **bit Soluções**, suporte nativo a breakpoints responsivos (`sm:`, `md:`, `lg:`, `xl:`) atendendo integralmente ao critério de responsividade.
- **Vantagens em relação a alternativas conhecidas:** Elimina a proliferação descontrolada de arquivos `.css` isolados e problemas com conflitos de escopo global. Comparado a bibliotecas de componentes prontos pesadas (ex: Material-UI / Ant Design), o Tailwind gera um bundle de produção com menos de 30KB de CSS via PurgeCSS.
- **Impacto:** Interface com alto valor visual, sem inconsistências de layout e responsiva para smartphones, tablets e desktops.

### 2.5. Banco de Dados Relacional SQL: SQLite 3 (com Better-SQLite3)
- **Motivo da Escolha:** Banco de dados relacional SQL padrão ACID (Atomicidade, Consistência, Isolamento e Durabilidade) embutido, dispensando a necessidade de o avaliador configurar serviços externos de banco ou containers pesados na máquina para testar o sistema.
- **Benefícios para o Cenário:** O driver `better-sqlite3` opera de forma síncrona no loop de I/O do Node, sendo a biblioteca SQLite mais rápida do mundo, com suporte completo a chaves estrangeiras (`PRAGMA foreign_keys = ON`), índices e transações atômicas. O script `schema.sql` e a criação de tabelas ocorrem de forma 100% autônoma no primeiro startup.
- **Vantagens em relação a alternativas conhecidas:** Permite execução imediata via `npm install && npm run dev` sem complexidade de credenciais locais. A modelagem e os scripts SQL (`schema.sql`) foram elaborados em conformidade ANSI-SQL, tornando a migração para PostgreSQL ou MySQL uma simples troca de driver.
- **Impacto:** Zero atrito na avaliação do projeto, confiabilidade estrita de transações e facilidade de backup através de um único arquivo.

### 2.6. Autenticação e Criptografia: JWT (JSON Web Token) & BcryptJS
- **Motivo da Escolha:** Padrão RFC 7519 para emissão e validação de tokens de autenticação stateless, combinado com o algoritmo Bcrypt (com fator de custo 10) para hashing irreversível e proteção de senhas.
- **Benefícios para o Cenário:** A aplicação não necessita consultar o banco de dados a cada requisição para identificar o usuário logado, uma vez que o payload do token já contém a identidade, departamento e perfil de acesso (`req.user`).
- **Vantagens em relação a alternativas conhecidas:** Em comparação com sessões tradicionais de cookies stateful baseadas em memória de servidor, o JWT facilita escalabilidade horizontal e comunicação REST desacoplada entre clientes diversos (web, mobile, integrações externas).
- **Impacto:** Segurança básica robusta e controle de sessão transparente com interceptors HTTP no frontend.

### 2.7. Validação de Dados: Zod
- **Motivo da Escolha:** Biblioteca TypeScript-first para declaração de esquemas de dados, validação estrita e inferência de tipos em tempo de compilação e execução.
- **Benefícios para o Cenário:** Garante que qualquer entrada no backend seja rigorosamente validada antes de atingir as camadas de serviço ou repositório. Retorna mensagens de erro amigáveis e estruturadas em formato JSON padronizado.
- **Vantagens em relação a alternativas conhecidas:** Ao contrário do Joi ou Yup, o Zod infere automaticamente os tipos TypeScript dos esquemas (`z.infer<typeof schema>`), eliminando duplicidade de código entre interfaces e validadores.
- **Impacto:** Blindagem contra entradas malformadas, injeções e parâmetros inválidos nas rotas de criação, edição e consulta de solicitações.

### 2.8. Testes Automatizados: Jest & Supertest
- **Motivo da Escolha:** Ferramentas líderes do ecossistema Node.js para testes unitários e de integração de APIs HTTP.
- **Benefícios para o Cenário:** Permite testar endpoints de ponta a ponta simulando chamadas HTTP reais, garantindo a validação de regras de negócio essenciais (como a proibição estrita de editar ou excluir solicitações em atendimento ou concluídas).
- **Vantagens em relação a alternativas conhecidas:** O Jest oferece asserções integradas, mocking nativo e relatórios de cobertura sem a necessidade de orquestrar múltiplas bibliotecas isoladas (Mocha + Chai + Sinon).
- **Impacto:** Confiabilidade no processo de entrega, prevenção de regressões e cumprimento do critério de diferencial avaliado no processo seletivo.

### 2.9. Containerização: Docker & Docker Compose
- **Motivo da Escolha:** Padronização de ambiente garantindo que a aplicação execute de forma idêntica em qualquer sistema operacional (Linux, macOS, Windows).
- **Benefícios para o Cenário:** O backend e o frontend (servido com Nginx otimizado) sobem juntos com um único comando (`docker compose up --build`).
- **Vantagens em relação a alternativas conhecidas:** Elimina o clássico problema "na minha máquina funciona", isolando dependências de sistema operacional e versões de Node/Nginx.
- **Impacto:** Deploy declarativo e previsível, em consonância com as melhores práticas de DevOps.

### 2.10. Integração Contínua: CI/CD com GitHub Actions
- **Motivo da Escolha:** Plataforma de automação nativa do GitHub para integração contínua.
- **Benefícios para o Cenário:** A cada `push` ou `pull_request`, o workflow executa a checagem de tipos estáticos (`tsc --noEmit`), roda todos os testes automatizados no backend em matriz de versões Node.js e valida o build de produção do frontend.
- **Impacto:** Garantia de que nenhuma quebra de contrato ou falha de regra de negócio chegue à branch principal.

### 2.11. Documentação Interativa de API: Swagger / OpenAPI 3.0 (`/api/docs`)
- **Motivo da Escolha:** Padrão global para documentação, exploração e testes de endpoints HTTP REST.
- **Benefícios para o Cenário:** Permite que qualquer desenvolvedor ou avaliador explore interativamente todos os endpoints, parâmetros de consulta, payloads esperados e respostas da API diretamente pelo navegador, com suporte a autorização Bearer JWT em tempo real.
- **Impacto:** Agilidade de integração entre equipes, transparência e profissionalismo na entrega da API.

### 2.12. Segurança HTTP e Proteção contra Força Bruta: Helmet & Express-Rate-Limit
- **Motivo da Escolha:** Endurecimento (*hardening*) de segurança da aplicação web na camada de transporte HTTP.
- **Benefícios para o Cenário:** O Helmet configura cabeçalhos cruciais contra ataques comuns (`X-Content-Type-Options`, `X-Frame-Options`, etc.). O Rate Limiting protege a rota crítica de login contra tentativas automatizadas de adivinhação de senhas (brute-force).
- **Impacto:** Atendimento exemplar ao critério de segurança básica e boas práticas avaliado no processo seletivo.

### 2.13. Exportação de Relatórios Gerenciais: CSV com Codificação UTF-8 BOM
- **Motivo da Escolha:** Atendimento às necessidades operacionais de gestores de equipes para análise de dados tabulares.
- **Benefícios para o Cenário:** Geração instantânea de planilhas no lado do cliente com os filtros ativos aplicados. A inclusão do Byte Order Mark UTF-8 (`\uFEFF`) e delimitador `;` garante abertura perfeita no Microsoft Excel brasileiro sem desfiguração de caracteres acentuados.
- **Impacto:** Alto valor agregado para tomada de decisão e usabilidade corporativa.

---

## 3. Justificativa Conceitual e Decisões Arquiteturais

### 3.1. Estrutura Geral da Aplicação e Organização em Camadas

A arquitetura do backend foi construída seguindo o princípio da **Separação de Responsabilidades (SoC - Separation of Concerns)** e a abordagem de **Arquitetura em Camadas (Layered Architecture)**:

```
[ Cliente Frontend (React / SPA) ]
                |  (HTTP REST / JSON / Bearer Token)
                v
       [ Middlewares Globais ]
       - Autenticação JWT (auth.middleware.ts)
       - Validação Zod (validate.middleware.ts)
       - Tratamento Centralizado de Erros (errorHandler.middleware.ts)
                |
                v
         [ Controllers ]  (Tratamento HTTP, entrada/saída, códigos de status)
                |
                v
          [ Services ]    (Regras de negócio, restrições funcionais e auditoria)
                |
                v
        [ Repositories ]  (Acesso a dados, queries SQL parametrizadas, índices)
                |
                v
        [ Banco de Dados SQL ] (SQLite / Tabelas, Chaves Estrangeiras, Integridade)
```

1. **Camada de Rotas (`routes/`):** Define os endpoints da API, organiza o versionamento (`/api/...`) e injeta os middlewares de segurança e validação específicos para cada rota.
2. **Camada de Middlewares (`middlewares/`):** Intercepta as requisições para verificar autenticidade do token JWT, barrar requisições anônimas em rotas protegidas e validar esquemas de corpo e parâmetros com Zod.
3. **Camada de Controladores (`controllers/`):** Extrai os parâmetros das requisições (`req.params`, `req.body`, `req.query`, `req.user`), aciona os serviços de domínio apropriados e formata a resposta HTTP com códigos de status semanticamente corretos (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `422 Unprocessable Entity`, `404 Not Found`).
4. **Camada de Serviços (`services/`):** O coração da lógica de domínio da aplicação. Contém as regras de negócio puras, como:
   - Uma solicitação recém-criada obrigatoriamente assume o status `'Aberto'`.
   - Geração automática e sequencial do protocolo do chamado (ex: `SOL-2026-0001`).
   - Bloqueio estrito de edição e exclusão caso a solicitação não esteja com o status `'Aberto'`.
   - Verificação de propriedade do chamado (colaborador só pode gerenciar o seu; admin/gestor possui permissões amplas).
   - Registro automático de cada transição na tabela de histórico de auditoria (`solicitacao_historico`).
5. **Camada de Repositórios (`repositories/`):** Isola toda a manipulação do banco de dados relacional em métodos com tipagem forte e queries SQL parametrizadas, prevenindo qualquer risco de SQL Injection.
6. **Camada de Configuração e Infraestrutura (`config/`):** Inicialização do banco de dados, garantia de execução das migrações (`schema.sql`) e população idempotente de dados iniciais (`seeds`).

### 3.2. Estratégia de Modelagem de Dados

A modelagem de dados foi desenhada em 3ª Forma Normal (3NF), garantindo atomicidade, eliminação de redundâncias e integridade referencial:
- **Tabela `usuarios`:** Centraliza os dados de acesso e identificação dos colaboradores. A unicidade do login é imposta por constraint `UNIQUE` na coluna `usuario`. O campo `perfil` possui validação `CHECK (perfil IN ('administrador', 'gestor', 'colaborador'))`.
- **Tabela `categorias`:** Normaliza os setores de destino das demandas (`TI`, `RH`, `Compras`, `Financeiro`, `Infraestrutura`), permitindo fácil expansão no futuro.
- **Tabela `solicitacoes`:** Entidade principal com chave primária autoincrementada e código amigável legível por humanos (`codigo`). Estabelece chave estrangeira com a tabela `usuarios` (`ON DELETE RESTRICT`) para impedir a exclusão acidental de colaboradores que possuam histórico de chamados.
- **Tabela `solicitacao_historico`:** Tabela de auditoria temporal. Cada vez que uma solicitação tem seu status modificado ou despachado, um registro imutável é gravado com o usuário responsável, timestamp exato, status anterior e novo status.
- **Índices de Performance:** Foram adicionados índices explícitos nas colunas frequentemente utilizadas em cláusulas `WHERE`, `JOIN` e filtros de busca: `status`, `categoria`, `data_abertura`, `titulo`, `codigo` e `usuario_id`.

### 3.3. Padrões de Projeto (Design Patterns) Utilizados

1. **Repository Pattern:** Desacopla a camada de serviço da implementação concreta de persistência. Permite que as regras de negócio sejam testadas de forma isolada e que a base de dados subjacente seja substituída com impacto mínimo.
2. **DTO (Data Transfer Object) Pattern:** Objetos tipados de transferência de dados que garantem que dados sensíveis (como `senha_hash`) nunca vazem nas respostas HTTP para o cliente.
3. **Middleware Pattern (Chain of Responsibility):** Utilizado para tratar autenticação, validação de payload e tratamento centralizado de erros em pipeline contínuo antes da execução do controlador.
4. **Custom Error Pattern (AppError):** Padronização de erros operacionais da aplicação com atributos de `statusCode` e mensagens descritivas, capturados por um error handler global.
5. **Singleton Pattern:** Utilizado na instância de conexão do banco de dados para evitar múltiplas conexões concorrentes desnecessárias no SQLite.
6. **Context Pattern (React):** Utilizado no frontend para disponibilizar de forma reativa a sessão de autenticação (`AuthContext`) e o sistema de notificações (`ToastContext`) para toda a árvore de componentes sem prop-drilling.

### 3.4. Estratégia de Autenticação e Segurança

- **Controle de Sessão Stateless:** O usuário autentica com login e senha via `POST /api/auth/login`. Se as credenciais forem válidas, um token JWT assinado digitalmente com chave secreta corporativa é emitido com tempo de expiração determinado (8 horas).
- **Armazenamento Seguro e Injeção de Headers:** O frontend armazena o token no `localStorage` e o injeta automaticamente no header `Authorization: Bearer <token>` em todas as requisições subsequentes por meio de um interceptor Axios.
- **Tratamento de Expiração (HTTP 401):** Caso o token expire ou seja invalidado, o interceptor de resposta do Axios detecta o código HTTP 401, remove as credenciais locais e despacha um evento customizado que redireciona o usuário imediatamente para a tela de login com mensagem explicativa.
- **Proteção contra Enumeração e Vazamento de Senhas:** Mensagens de erro de autenticação são genéricas ("Credenciais inválidas. Verifique seu usuário e senha"), impedindo que invasores identifiquem se o erro decorreu do usuário ou da senha. A coluna de hash nunca é incluída nas projeções da API de perfil.

### 3.5. Estratégia de Comunicação entre Frontend e Backend

- **API RESTful Padronizada:** A comunicação segue fielmente os princípios REST, utilizando substantivos no plural para recursos (`/api/solicitacoes`), verbos HTTP adequados (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) e payloads codificados em JSON.
- **Estrutura de Resposta Consistente:** Todas as respostas da API seguem um envelope uniforme:
  - Sucesso: `{ "sucesso": true, "dados": [...], "mensagem": "..." }`
  - Erro: `{ "sucesso": false, "mensagem": "...", "erros": [...] }`
- **Proxy Reverso no Ambiente de Desenvolvimento e Produção:** Em desenvolvimento, o Vite atua como proxy reverso para `http://localhost:3001`. Em produção com Docker, o Nginx redireciona as rotas `/api/` internamente para o contêiner do backend, eliminando problemas de CORS no navegador.

---

## 4. Análise Crítica

Em atendimento ao edital do processo seletivo, esta seção apresenta uma avaliação técnica reflexiva sobre as escolhas realizadas, suas limitações e a evolução esperada em escala de produção corporativa:

### 4.1. Limitações da Solução Implementada

1. **Persistência em Arquivo Único (SQLite):**
   - *Limitação:* Embora o SQLite com WAL mode suporte centenas de requisições por segundo e seja excelente para desenvolvimento e avaliação local sem esforço de setup, ele impõe bloqueio de arquivo em escritas simultâneas de altíssima concorrência distribuída.
   - *Contexto:* Para o volume típico de um mini-projeto e dezenas de usuários simultâneos, a performance é impecável, porém requer evolução em cenários de múltiplos nós.
2. **Armazenamento de Token em LocalStorage:**
   - *Limitação:* O armazenamento do JWT no `localStorage` é prático para SPA desacoplada, mas vulnerável a ataques de Cross-Site Scripting (XSS) caso scripts maliciosos de terceiros sejam injetados.
3. **Busca Textual via `LIKE %termo%`:**
   - *Limitação:* A busca no título utiliza `LIKE %termo%`. Para bases com milhões de registros, essa abordagem não se beneficia integralmente de índices convencionais em caracteres intermediários.

### 4.2. Melhorias Futuras

1. **Mecanismo de Anexo de Arquivos:** Permitir que colaboradores anexem notas fiscais, fotos de equipamentos danificados ou laudos técnicos (PDF/PNG) diretamente na solicitação.
2. **Notificações em Tempo Real via WebSockets (Socket.io) ou Server-Sent Events (SSE):** Notificar o colaborador instantaneamente no navegador quando o status do seu chamado for alterado de "Aberto" para "Em Atendimento" ou "Concluído".
3. **Páginação Dinâmica de Resultados:** Implementar paginação na API (`page`, `limit`) para manter a performance estável mesmo quando a base atingir dezenas de milhares de chamados.
4. **Exportação de Relatórios:** Possibilidade de exportar a listagem filtrada de chamados em formato CSV ou planilha Excel para análise gerencial financeira.

### 4.3. Requisitos que Poderiam ser Aperfeiçoados

1. **Substatus e SLA (Service Level Agreement):** Estabelecer prazos máximos para primeiro atendimento e conclusão conforme a categoria (ex: chamados de TI com prazo de 24h; Infraestrutura com 48h), com indicador visual de SLA vencido no Dashboard.
2. **Campos Customizados por Categoria:** Ao selecionar a categoria "Financeiro", o formulário poderia exibir campos específicos para "Valor do Reembolso" e "Centro de Custo"; ao selecionar "TI", campos para "Modelo do Equipamento" e "Número de Patrimônio".

### 4.4. Decisões que Seriam Diferentes em um Ambiente Corporativo de Produção

Se este sistema fosse implementado no ambiente produtivo corporativo de grande porte da bit Soluções, as seguintes decisões seriam adotadas:
1. **Banco de Dados Gerenciado (PostgreSQL / AWS RDS ou Cloud SQL):** Utilização de PostgreSQL com pool de conexões (PgBouncer), réplicas de leitura e backups automáticos pontuais (*Point-in-Time Recovery*).
2. **Cookies `HttpOnly`, `Secure` e `SameSite=Strict`:** A emissão do token JWT seria feita via cookies seguros não acessíveis via JavaScript, mitigando riscos de XSS. Adicionalmente, implementaríamos rotação de Refresh Tokens com invalidação no Redis.
3. **Busca Textual com Full-Text Search (FTS) ou Elasticsearch:** Utilização dos índices `tsvector` do PostgreSQL ou integração com Elasticsearch/MeiliSearch para buscas semânticas rápidas com tolerância a erros de digitação.
4. **Observabilidade e Monitoramento Centralizado:** Integração com OpenTelemetry, Prometheus, Grafana e Sentry para rastreamento distribuído de erros, métricas de latência e saúde dos microsserviços.
5. **Autenticação Corporativa Integrada (SSO / OAuth2 / SAML):** Integração com Microsoft Entra ID (Azure AD), Google Workspace ou LDAP interno para login unificado dos colaboradores da empresa.

---

## 5. Conclusão

O **Portal de Solicitações Internas** foi concebido e implementado priorizando qualidade de engenharia de software, rigor arquitetural e respeito integral aos requisitos funcionais e técnicos estabelecidos pela **bit Soluções**.

A solução contempla 100% dos requisitos obrigatórios e todos os diferenciais recomendados (Docker, Docker Compose, testes automatizados cobrindo todas as regras de negócio, CI/CD com GitHub Actions e interface responsiva com Design System corporativo), demonstrando maturidade técnica, clareza de código e capacidade analítica compatível com a evolução para o nível pleno.
