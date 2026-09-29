-- ========================================================
-- Portal de Solicitações Internas - bit Soluções
-- Script de Criação do Banco de Dados (DDL)
-- Compatível com SQLite 3 / PostgreSQL
-- ========================================================

-- Tabela de Usuários do Sistema
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    perfil VARCHAR(20) NOT NULL DEFAULT 'colaborador' CHECK (perfil IN ('administrador', 'gestor', 'colaborador')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias das Solicitações
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(200),
    ativo BOOLEAN NOT NULL DEFAULT 1
);

-- Tabela de Solicitações Internas
CREATE TABLE IF NOT EXISTS solicitacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Aberto' CHECK (status IN ('Aberto', 'Em Atendimento', 'Concluído')),
    usuario_id INTEGER NOT NULL,
    data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_conclusao DATETIME,
    observacoes TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabela de Histórico de Alterações de Status (Auditoria / Timeline)
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

-- Índices para Otimização de Consultas e Filtros
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes(status);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_categoria ON solicitacoes(categoria);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_data_abertura ON solicitacoes(data_abertura);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_usuario_id ON solicitacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_codigo ON solicitacoes(codigo);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_titulo ON solicitacoes(titulo);
CREATE INDEX IF NOT EXISTS idx_historico_solicitacao_id ON solicitacao_historico(solicitacao_id);
