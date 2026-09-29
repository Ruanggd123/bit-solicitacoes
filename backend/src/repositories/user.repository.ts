import { Database } from 'better-sqlite3';
import { db } from '../config/database';
import { User, UserDTO } from '../models/types';

export class UserRepository {
  private database: Database;

  constructor(customDb?: Database) {
    this.database = customDb || db;
  }

  findByUsername(usuario: string): User | undefined {
    const stmt = this.database.prepare(`
      SELECT id, nome, usuario, senha_hash, departamento, perfil, criado_em
      FROM usuarios
      WHERE usuario = ?
    `);
    return stmt.get(usuario) as User | undefined;
  }

  findById(id: number): User | undefined {
    const stmt = this.database.prepare(`
      SELECT id, nome, usuario, senha_hash, departamento, perfil, criado_em
      FROM usuarios
      WHERE id = ?
    `);
    return stmt.get(id) as User | undefined;
  }

  create(user: Omit<User, 'id' | 'criado_em'>): User {
    const stmt = this.database.prepare(`
      INSERT INTO usuarios (nome, usuario, senha_hash, departamento, perfil)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(user.nome, user.usuario, user.senha_hash, user.departamento, user.perfil);
    return this.findById(Number(info.lastInsertRowid))!;
  }

  findAll(): UserDTO[] {
    const stmt = this.database.prepare(`
      SELECT id, nome, usuario, departamento, perfil, criado_em
      FROM usuarios
      ORDER BY nome ASC
    `);
    return stmt.all() as UserDTO[];
  }
}
