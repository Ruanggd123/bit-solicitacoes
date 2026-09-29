import { z } from 'zod';

export const createSolicitacaoSchema = z.object({
  titulo: z.string({
    required_error: 'O título é obrigatório.'
  }).trim().min(3, 'O título deve conter no mínimo 3 caracteres.').max(150, 'O título deve ter no máximo 150 caracteres.'),
  descricao: z.string({
    required_error: 'A descrição é obrigatória.'
  }).trim().min(5, 'A descrição deve conter no mínimo 5 caracteres.'),
  categoria: z.string({
    required_error: 'A categoria é obrigatória.'
  }).min(1, 'Selecione uma categoria válida.')
});

export const updateSolicitacaoSchema = z.object({
  titulo: z.string().trim().min(3, 'O título deve conter no mínimo 3 caracteres.').max(150, 'O título deve ter no máximo 150 caracteres.').optional(),
  descricao: z.string().trim().min(5, 'A descrição deve conter no mínimo 5 caracteres.').optional(),
  categoria: z.string().min(1, 'A categoria não pode ser vazia.').optional()
});

export const updateStatusSchema = z.object({
  status: z.enum(['Aberto', 'Em Atendimento', 'Concluído'], {
    errorMap: () => ({ message: 'Status inválido. Valores aceitos: Aberto, Em Atendimento, Concluído.' })
  }),
  comentario: z.string().trim().optional()
});

export const filterSolicitacaoSchema = z.object({
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  categoria: z.string().optional(),
  status: z.enum(['Aberto', 'Em Atendimento', 'Concluído']).optional(),
  titulo: z.string().optional()
});
