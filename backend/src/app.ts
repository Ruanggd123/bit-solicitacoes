import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { swaggerDocument } from './config/swagger';

export function createApp(): Express {
  const app = express();

  // Proteção de Cabeçalhos HTTP com Helmet (Segurança Básica Avançada)
  app.use(
    helmet({
      contentSecurityPolicy: false, // Permite renderização correta do Swagger UI
      crossOriginEmbedderPolicy: false
    })
  );

  // Configuração de CORS para permitir requisições do frontend
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.use(
    cors({
      origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // Parse de requisições JSON e URL encoded
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate Limiting no Login (Proteção contra ataques de Força Bruta / Brute-Force)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20, // Limite de 20 tentativas por IP a cada 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      sucesso: false,
      mensagem: 'Muitas tentativas de login realizadas a partir deste endereço IP. Aguarde 15 minutos antes de tentar novamente.'
    }
  });

  app.use('/api/auth/login', loginLimiter);

  // Documentação Interativa Swagger / OpenAPI 3.0
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'Documentação da API — bit Soluções',
    customCss: '.swagger-ui .topbar { display: none }'
  }));

  // Rotas da API sob o prefixo /api
  app.use('/api', routes);

  // Tratamento de rotas inexistentes (404)
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      sucesso: false,
      mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`
    });
  });

  // Middleware global de tratamento de erros
  app.use(errorHandler);

  return app;
}

export const app = createApp();
export default app;
