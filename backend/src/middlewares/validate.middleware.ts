import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }));

        res.status(400).json({
          sucesso: false,
          mensagem: 'Dados de entrada inválidos.',
          erros: errorMessages
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }));

        res.status(400).json({
          sucesso: false,
          mensagem: 'Parâmetros de consulta inválidos.',
          erros: errorMessages
        });
        return;
      }
      next(error);
    }
  };
};
