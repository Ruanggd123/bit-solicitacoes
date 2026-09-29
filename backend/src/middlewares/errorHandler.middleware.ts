import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 400, details?: any) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      sucesso: false,
      mensagem: err.message,
      detalhes: err.details
    });
    return;
  }

  console.error('Unhandled Application Error:', err);

  res.status(500).json({
    sucesso: false,
    mensagem: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'
  });
};
