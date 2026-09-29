import { z } from 'zod';

export const loginSchema = z.object({
  usuario: z.string({
    required_error: 'O campo usuário é obrigatório.'
  }).min(3, 'O usuário deve ter no mínimo 3 caracteres.'),
  senha: z.string({
    required_error: 'O campo senha é obrigatório.'
  }).min(4, 'A senha deve ter no mínimo 4 caracteres.')
});

export type LoginInput = z.infer<typeof loginSchema>;
