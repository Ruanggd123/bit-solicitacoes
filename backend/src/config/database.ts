import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_PATH = process.env.DATABASE_PATH || path.resolve(__dirname, '../../data/solicitacoes.db');

export function initDatabase(dbPath: string = DB_PATH): Database.Database {
  // Garantir existência do diretório pai se for arquivo
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new Database(dbPath);

  // Habilitar integridade referencial de chaves estrangeiras
  db.pragma('foreign_keys = ON');

  // Executar criação das tabelas caso não existam
  executarMigrations(db);

  // Popular dados iniciais se a tabela de usuários estiver vazia
  popularDadosIniciais(db);

  return db;
}

function executarMigrations(db: Database.Database): void {
  // Localizar arquivo schema.sql na pasta database da raiz do projeto
  const possiblePaths = [
    path.resolve(__dirname, '../../../database/schema.sql'),
    path.resolve(__dirname, '../../database/schema.sql'),
    path.resolve(process.cwd(), 'database/schema.sql'),
    path.resolve(process.cwd(), '../database/schema.sql')
  ];

  let schemaSql = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      schemaSql = fs.readFileSync(p, 'utf-8');
      break;
    }
  }

  if (schemaSql) {
    db.exec(schemaSql);
  } else {
    // Fallback DDL inline caso executado fora do caminho padrão
    db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        usuario VARCHAR(50) NOT NULL UNIQUE,
        senha_hash VARCHAR(255) NOT NULL,
        departamento VARCHAR(50) NOT NULL,
        perfil VARCHAR(20) NOT NULL DEFAULT 'colaborador',
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(50) NOT NULL UNIQUE,
        descricao VARCHAR(200),
        ativo BOOLEAN NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS solicitacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo VARCHAR(20) NOT NULL UNIQUE,
        titulo VARCHAR(150) NOT NULL,
        descricao TEXT NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'Aberto',
        usuario_id INTEGER NOT NULL,
        data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_conclusao DATETIME,
        observacoes TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS solicitacao_historico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        solicitacao_id INTEGER NOT NULL,
        usuario_id INTEGER NOT NULL,
        status_anterior VARCHAR(30),
        novo_status VARCHAR(30) NOT NULL,
        comentario TEXT,
        data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
      );

      CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes(status);
      CREATE INDEX IF NOT EXISTS idx_solicitacoes_categoria ON solicitacoes(categoria);
      CREATE INDEX IF NOT EXISTS idx_solicitacoes_data_abertura ON solicitacoes(data_abertura);
      CREATE INDEX IF NOT EXISTS idx_solicitacoes_codigo ON solicitacoes(codigo);
      CREATE INDEX IF NOT EXISTS idx_solicitacoes_titulo ON solicitacoes(titulo);
    `);
  }
}

function popularDadosIniciais(db: Database.Database): void {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get() as { count: number };
  if (userCount.count > 0) return;

  const defaultPasswordHash = bcrypt.hashSync('senha123', 10);
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);

  // Inserir categorias padrão
  const insertCategoria = db.prepare('INSERT OR IGNORE INTO categorias (nome, descricao) VALUES (?, ?)');
  const categorias = [
    ['TI', 'Demandas relacionadas a hardware, software, rede e acessos'],
    ['RH', 'Solicitações de benefícios, férias, dúvidas trabalhistas e onboarding'],
    ['Compras', 'Requisições de suprimentos, equipamentos e materiais de escritório'],
    ['Financeiro', 'Reembolsos, adiantamentos, notas fiscais e pagamentos'],
    ['Infraestrutura', 'Manutenção predial, climatização, limpeza e elétrica']
  ];

  for (const cat of categorias) {
    insertCategoria.run(cat[0], cat[1]);
  }

  // Inserir usuários padrão
  const insertUser = db.prepare(`
    INSERT INTO usuarios (nome, usuario, senha_hash, departamento, perfil)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run('Administrador do Sistema', 'admin', adminPasswordHash, 'TI', 'administrador');
  insertUser.run('João Silva', 'joao.silva', defaultPasswordHash, 'RH', 'colaborador');
  insertUser.run('Maria Souza', 'maria.souza', defaultPasswordHash, 'Financeiro', 'gestor');
  insertUser.run('Carlos Lima', 'carlos.lima', defaultPasswordHash, 'Infraestrutura', 'colaborador');

  // Inserir chamados iniciais para demonstração
  const insertSolicitacao = db.prepare(`
    INSERT INTO solicitacoes (codigo, titulo, descricao, categoria, status, usuario_id, data_abertura, data_atualizacao, data_conclusao, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertHistorico = db.prepare(`
    INSERT INTO solicitacao_historico (solicitacao_id, usuario_id, status_anterior, novo_status, comentario, data_registro)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Solicitação 1 - Aberto
  insertSolicitacao.run(
    'SOL-2026-0001',
    'Troca de teclado e mouse ergonômico',
    'Teclado atual está apresentando falha intermitente na tecla barra de espaço.',
    'TI',
    'Aberto',
    2,
    '2026-09-27 09:15:00',
    '2026-09-27 09:15:00',
    null,
    null
  );
  insertHistorico.run(1, 2, null, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-27 09:15:00');

  // Solicitação 2 - Em Atendimento
  insertSolicitacao.run(
    'SOL-2026-0002',
    'Cadeira ergonômica para estação de trabalho',
    'Solicito avaliação do time de segurança do trabalho e aquisição de cadeira ergonômica com laudo NR17.',
    'Infraestrutura',
    'Em Atendimento',
    2,
    '2026-09-27 10:30:00',
    '2026-09-28 14:00:00',
    null,
    'Chamado em cotação com três fornecedores credenciados.'
  );
  insertHistorico.run(2, 2, null, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-27 10:30:00');
  insertHistorico.run(2, 1, 'Aberto', 'Em Atendimento', 'Equipe de infraestrutura assumiu o atendimento.', '2026-09-28 14:00:00');

  // Solicitação 3 - Concluído
  insertSolicitacao.run(
    'SOL-2026-0003',
    'Reembolso de despesas de viagem corporativa',
    'Envio de notas de alimentação e hospedagem referente à visita técnica.',
    'Financeiro',
    'Concluído',
    3,
    '2026-09-25 14:00:00',
    '2026-09-26 17:30:00',
    '2026-09-26 17:30:00',
    'Depósito efetuado na conta bancária cadastrada.'
  );
  insertHistorico.run(3, 3, null, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-25 14:00:00');
  insertHistorico.run(3, 1, 'Aberto', 'Em Atendimento', 'Conferência documental realizada.', '2026-09-26 10:00:00');
  insertHistorico.run(3, 1, 'Em Atendimento', 'Concluído', 'Pagamento liberado com sucesso.', '2026-09-26 17:30:00');

  // Solicitação 4 - Aberto
  insertSolicitacao.run(
    'SOL-2026-0004',
    'Aquisição de licença de software de desenvolvimento',
    'Necessidade de renovação de licença para desenvolvimento em TypeScript.',
    'Compras',
    'Aberto',
    4,
    '2026-09-28 11:20:00',
    '2026-09-28 11:20:00',
    null,
    null
  );
  insertHistorico.run(4, 4, null, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-28 11:20:00');

  // Solicitação 5 - Concluído
  insertSolicitacao.run(
    'SOL-2026-0005',
    'Criação de acessos para novo colaborador',
    'Novo desenvolvedor iniciando na equipe de tecnologia da bit Soluções.',
    'RH',
    'Concluído',
    2,
    '2026-09-24 08:45:00',
    '2026-09-24 16:00:00',
    '2026-09-24 16:00:00',
    'Conta de e-mail e acessos ao repositório concedidos.'
  );
  insertHistorico.run(5, 2, null, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-24 08:45:00');
  insertHistorico.run(5, 1, 'Aberto', 'Concluído', 'Acessos configurados.', '2026-09-24 16:00:00');
}

export const db = initDatabase();
export default db;
