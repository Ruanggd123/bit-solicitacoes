export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Portal de Solicitações Internas — bit Soluções API',
    version: '1.0.0',
    description: 'Documentação interativa da API REST para o Portal de Solicitações Internas da bit Soluções. Permite autenticação, abertura de chamados, controle de status, consultas filtradas e indicadores do dashboard.',
    contact: {
      name: 'Equipe de Engenharia / Candidato',
      email: 'contato@bitsolucoes.info'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor Local da API'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT retornado pelo endpoint de login.'
      }
    },
    schemas: {
      LoginInput: {
        type: 'object',
        required: ['usuario', 'senha'],
        properties: {
          usuario: { type: 'string', example: 'admin' },
          senha: { type: 'string', example: 'admin123' }
        }
      },
      SolicitacaoCreate: {
        type: 'object',
        required: ['titulo', 'descricao', 'categoria'],
        properties: {
          titulo: { type: 'string', example: 'Troca de mouse ergonômico' },
          descricao: { type: 'string', example: 'O mouse atual está falhando no botão esquerdo.' },
          categoria: { type: 'string', example: 'TI', enum: ['TI', 'RH', 'Compras', 'Financeiro', 'Infraestrutura'] }
        }
      },
      SolicitacaoStatusUpdate: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['Aberto', 'Em Atendimento', 'Concluído'], example: 'Em Atendimento' },
          comentario: { type: 'string', example: 'Iniciada verificação pelo suporte técnico.' }
        }
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        summary: 'Autenticação de Usuário (Login)',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' }
            }
          }
        },
        responses: {
          200: { description: 'Login efetuado com sucesso (retorna JWT e perfil)' },
          400: { description: 'Campos inválidos ou ausentes' },
          401: { description: 'Credenciais inválidas' },
          429: { description: 'Limite de tentativas excedido (Rate Limit)' }
        }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Dados do Usuário Autenticado na Sessão',
        tags: ['Autenticação'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dados do perfil do usuário logado' },
          401: { description: 'Não autorizado / Token ausente ou expirado' }
        }
      }
    },
    '/auth/logout': {
      post: {
        summary: 'Encerramento de Sessão (Logout)',
        tags: ['Autenticação'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Sessão encerrada com sucesso' }
        }
      }
    },
    '/solicitacoes': {
      get: {
        summary: 'Listar Solicitações com Filtros Dinâmicos',
        tags: ['Solicitações'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'categoria', in: 'query', schema: { type: 'string' }, description: 'Filtrar por setor (ex: TI, RH)' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['Aberto', 'Em Atendimento', 'Concluído'] } },
          { name: 'titulo', in: 'query', schema: { type: 'string' }, description: 'Busca por termo no título ou código' },
          { name: 'data_inicio', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Data inicial (YYYY-MM-DD)' },
          { name: 'data_fim', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Data final (YYYY-MM-DD)' }
        ],
        responses: {
          200: { description: 'Lista de solicitações retornada com sucesso' },
          401: { description: 'Não autorizado' }
        }
      },
      post: {
        summary: 'Cadastrar Nova Solicitação Interna',
        tags: ['Solicitações'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SolicitacaoCreate' }
            }
          }
        },
        responses: {
          201: { description: 'Solicitação criada com status inicial Aberto e código gerado' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Não autorizado' }
        }
      }
    },
    '/solicitacoes/{id}': {
      get: {
        summary: 'Consultar Detalhes e Linha do Tempo da Solicitação',
        tags: ['Solicitações'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Detalhes completos e histórico de auditoria' },
          404: { description: 'Solicitação não encontrada' }
        }
      },
      put: {
        summary: 'Editar Solicitação Aberta',
        tags: ['Solicitações'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SolicitacaoCreate' }
            }
          }
        },
        responses: {
          200: { description: 'Solicitação editada com sucesso' },
          403: { description: 'Sem permissão para alterar chamado de outro colaborador' },
          422: { description: 'Proibido: apenas solicitações com status "Aberto" podem ser editadas' }
        }
      },
      delete: {
        summary: 'Excluir Solicitação Aberta',
        tags: ['Solicitações'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Solicitação excluída com sucesso' },
          403: { description: 'Sem permissão' },
          422: { description: 'Proibido: apenas solicitações com status "Aberto" podem ser excluídas' }
        }
      }
    },
    '/solicitacoes/{id}/status': {
      patch: {
        summary: 'Alterar Status da Solicitação (Máquina de Estados)',
        tags: ['Solicitações'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SolicitacaoStatusUpdate' }
            }
          }
        },
        responses: {
          200: { description: 'Status alterado e evento registrado no histórico' },
          400: { description: 'Status inválido ou idêntico ao atual' }
        }
      }
    },
    '/dashboard/metricas': {
      get: {
        summary: 'Obter Indicadores Consolidados do Dashboard',
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Métricas: Total, Abertas, Em Atendimento, Concluídas e por Categoria' }
        }
      }
    },
    '/categorias': {
      get: {
        summary: 'Listar Categorias Ativas',
        tags: ['Categorias'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de categorias disponíveis' }
        }
      }
    },
    '/health': {
      get: {
        summary: 'Health Check da API',
        tags: ['Sistema'],
        responses: {
          200: { description: 'API em funcionamento operacional' }
        }
      }
    }
  }
};
