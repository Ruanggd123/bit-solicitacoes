import { Database } from 'better-sqlite3';
import { db } from '../config/database';
import {
  Solicitacao,
  SolicitacaoCreateInput,
  SolicitacaoUpdateInput,
  SolicitacaoFiltros,
  SolicitacaoHistorico,
  StatusSolicitacao,
  DashboardMetrics
} from '../models/types';

export class SolicitacaoRepository {
  private database: Database;

  constructor(customDb?: Database) {
    this.database = customDb || db;
  }

  getNextCodigo(): string {
    const ano = new Date().getFullYear();
    const prefixo = `SOL-${ano}-`;
    const stmt = this.database.prepare(`
      SELECT codigo FROM solicitacoes 
      WHERE codigo LIKE ? 
      ORDER BY id DESC LIMIT 1
    `);
    const ultimo = stmt.get(`${prefixo}%`) as { codigo: string } | undefined;

    let proximoNumero = 1;
    if (ultimo && ultimo.codigo) {
      const parts = ultimo.codigo.split('-');
      const num = parseInt(parts[2], 10);
      if (!isNaN(num)) {
        proximoNumero = num + 1;
      }
    }

    return `${prefixo}${String(proximoNumero).padStart(4, '0')}`;
  }

  create(input: SolicitacaoCreateInput & { usuario_id: number; codigo: string }): Solicitacao {
    const stmt = this.database.prepare(`
      INSERT INTO solicitacoes (codigo, titulo, descricao, categoria, status, usuario_id, data_abertura, data_atualizacao)
      VALUES (?, ?, ?, ?, 'Aberto', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const info = stmt.run(
      input.codigo,
      input.titulo,
      input.descricao,
      input.categoria,
      input.usuario_id
    );

    const id = Number(info.lastInsertRowid);
    return this.findById(id)!;
  }

  private static readonly SELECT_BASE = `
    SELECT 
      s.id,
      s.codigo,
      s.titulo,
      s.descricao,
      s.categoria,
      s.status,
      s.usuario_id,
      s.data_abertura,
      s.data_atualizacao,
      s.data_conclusao,
      s.observacoes,
      u.nome as solicitante_nome,
      u.departamento as solicitante_departamento
    FROM solicitacoes s
    INNER JOIN usuarios u ON s.usuario_id = u.id
  `;

  findById(id: number): Solicitacao | undefined {
    const stmt = this.database.prepare(`${SolicitacaoRepository.SELECT_BASE} WHERE s.id = ?`);
    return stmt.get(id) as Solicitacao | undefined;
  }

  findByCodigo(codigo: string): Solicitacao | undefined {
    const stmt = this.database.prepare(`${SolicitacaoRepository.SELECT_BASE} WHERE s.codigo = ?`);
    return stmt.get(codigo) as Solicitacao | undefined;
  }

  findAll(filtros: SolicitacaoFiltros = {}): Solicitacao[] {
    let sql = `${SolicitacaoRepository.SELECT_BASE} WHERE 1=1`;

    const params: any[] = [];

    if (filtros.data_inicio) {
      sql += ` AND s.data_abertura >= ?`;
      params.push(`${filtros.data_inicio} 00:00:00`);
    }

    if (filtros.data_fim) {
      sql += ` AND s.data_abertura <= ?`;
      params.push(`${filtros.data_fim} 23:59:59`);
    }

    if (filtros.categoria && filtros.categoria.trim() !== '') {
      sql += ` AND s.categoria = ?`;
      params.push(filtros.categoria.trim());
    }

    if (filtros.status && filtros.status.trim() !== '') {
      sql += ` AND s.status = ?`;
      params.push(filtros.status.trim());
    }

    if (filtros.titulo && filtros.titulo.trim() !== '') {
      sql += ` AND (s.titulo LIKE ? OR s.codigo LIKE ? OR s.descricao LIKE ?)`;
      const term = `%${filtros.titulo.trim()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY s.id DESC`;

    const stmt = this.database.prepare(sql);
    return stmt.all(...params) as Solicitacao[];
  }

  update(id: number, data: SolicitacaoUpdateInput): Solicitacao | undefined {
    const fields: string[] = [];
    const params: any[] = [];

    if (data.titulo !== undefined) {
      fields.push('titulo = ?');
      params.push(data.titulo);
    }

    if (data.descricao !== undefined) {
      fields.push('descricao = ?');
      params.push(data.descricao);
    }

    if (data.categoria !== undefined) {
      fields.push('categoria = ?');
      params.push(data.categoria);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('data_atualizacao = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE solicitacoes SET ${fields.join(', ')} WHERE id = ?`;
    this.database.prepare(sql).run(...params);

    return this.findById(id);
  }

  delete(id: number): boolean {
    const stmt = this.database.prepare('DELETE FROM solicitacoes WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }

  updateStatus(
    id: number,
    novoStatus: StatusSolicitacao,
    observacoes?: string
  ): Solicitacao | undefined {
    let sql = `
      UPDATE solicitacoes 
      SET status = ?, 
          data_atualizacao = CURRENT_TIMESTAMP,
          observacoes = COALESCE(?, observacoes),
          data_conclusao = CASE WHEN ? = 'Concluído' THEN CURRENT_TIMESTAMP ELSE NULL END
      WHERE id = ?
    `;

    this.database.prepare(sql).run(novoStatus, observacoes ?? null, novoStatus, id);
    return this.findById(id);
  }

  addHistorico(historico: {
    solicitacao_id: number;
    usuario_id: number;
    status_anterior?: string | null;
    novo_status: string;
    comentario?: string | null;
  }): void {
    const stmt = this.database.prepare(`
      INSERT INTO solicitacao_historico (solicitacao_id, usuario_id, status_anterior, novo_status, comentario, data_registro)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    stmt.run(
      historico.solicitacao_id,
      historico.usuario_id,
      historico.status_anterior ?? null,
      historico.novo_status,
      historico.comentario ?? null
    );
  }

  getHistorico(solicitacaoId: number): SolicitacaoHistorico[] {
    const stmt = this.database.prepare(`
      SELECT 
        h.id,
        h.solicitacao_id,
        h.usuario_id,
        h.status_anterior,
        h.novo_status,
        h.comentario,
        h.data_registro,
        u.nome as responsavel_nome,
        u.departamento as responsavel_departamento
      FROM solicitacao_historico h
      INNER JOIN usuarios u ON h.usuario_id = u.id
      WHERE h.solicitacao_id = ?
      ORDER BY h.id ASC
    `);

    return stmt.all(solicitacaoId) as SolicitacaoHistorico[];
  }

  getDashboardMetrics(): DashboardMetrics {
    const totalStmt = this.database.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Aberto' THEN 1 ELSE 0 END) as abertas,
        SUM(CASE WHEN status = 'Em Atendimento' THEN 1 ELSE 0 END) as em_atendimento,
        SUM(CASE WHEN status = 'Concluído' THEN 1 ELSE 0 END) as concluidas
      FROM solicitacoes
    `);

    const result = totalStmt.get() as any;

    const porCategoriaStmt = this.database.prepare(`
      SELECT categoria, COUNT(*) as total
      FROM solicitacoes
      GROUP BY categoria
      ORDER BY total DESC
    `);

    const porCategoria = porCategoriaStmt.all() as Array<{ categoria: string; total: number }>;

    return {
      total: Number(result?.total || 0),
      abertas: Number(result?.abertas || 0),
      em_atendimento: Number(result?.em_atendimento || 0),
      concluidas: Number(result?.concluidas || 0),
      por_categoria: porCategoria
    };
  }
}
