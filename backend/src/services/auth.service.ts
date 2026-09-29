import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { LoginInput } from '../validators/auth.schema';
import { AppError } from '../middlewares/errorHandler.middleware';
import { AuthPayload, UserDTO } from '../models/types';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_bit_solucoes_2026_dev_env';
const JWT_EXPIRES_IN = '8h';

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async login(credentials: LoginInput): Promise<{ token: string; usuario: UserDTO }> {
    const user = this.userRepository.findByUsername(credentials.usuario);

    if (!user) {
      throw new AppError('Credenciais inválidas. Verifique seu usuário e senha.', 401);
    }

    const isPasswordValid = await bcrypt.compare(credentials.senha, user.senha_hash);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas. Verifique seu usuário e senha.', 401);
    }

    const payload: AuthPayload = {
      id: user.id,
      usuario: user.usuario,
      nome: user.nome,
      departamento: user.departamento,
      perfil: user.perfil
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const { senha_hash, ...userDto } = user;

    return {
      token,
      usuario: userDto
    };
  }

  getProfile(userId: number): UserDTO {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }
    const { senha_hash, ...userDto } = user;
    return userDto;
  }
}
