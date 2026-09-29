import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

export function createApp(): Express {
  const app = express();

  // Configuração de CORS para permitir requisições do frontend
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.use(cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Parse de requisições JSON e URL encoded
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
