-- ========================================================
-- Portal de Solicitações Internas - bit Soluções
-- Script de População Inicial de Dados (DML / Seeds)
-- ========================================================

-- Categorias Iniciais Sugeridas no Desafio
INSERT OR IGNORE INTO categorias (id, nome, descricao) VALUES
(1, 'TI', 'Demandas relacionadas a hardware, software, rede e acessos'),
(2, 'RH', 'Solicitações de benefícios, férias, dúvidas trabalhistas e onboarding'),
(3, 'Compras', 'Requisições de suprimentos, equipamentos e materiais de escritório'),
(4, 'Financeiro', 'Reembolsos, adiantamentos, notas fiscais e pagamentos'),
(5, 'Infraestrutura', 'Manutenção predial, climatização, limpeza e elétrica');

-- Usuários de Demonstração (Senhas com Hash Bcrypt: admin123 e senha123)
-- Hash para 'admin123': $2b$10$epR338l0FwXf7c/z4G17uOqWz9k12y7DkmcR4jA7iWshh1eI4k7pS
-- Hash para 'senha123': $2b$10$epR338l0FwXf7c/z4G17uOqWz9k12y7DkmcR4jA7iWshh1eI4k7pS (ou gerado na inicialização)
INSERT OR IGNORE INTO usuarios (id, nome, usuario, senha_hash, departamento, perfil) VALUES
(1, 'Administrador do Sistema', 'admin', '$2b$10$h9g13ZqA8Hq5.8sQ6u9LTe4XU9l72XU88XW.tO.Jc1x5F2nK5A7aW', 'TI', 'administrador'),
(2, 'João Silva', 'joao.silva', '$2b$10$h9g13ZqA8Hq5.8sQ6u9LTe4XU9l72XU88XW.tO.Jc1x5F2nK5A7aW', 'RH', 'colaborador'),
(3, 'Maria Souza', 'maria.souza', '$2b$10$h9g13ZqA8Hq5.8sQ6u9LTe4XU9l72XU88XW.tO.Jc1x5F2nK5A7aW', 'Financeiro', 'gestor'),
(4, 'Carlos Lima', 'carlos.lima', '$2b$10$h9g13ZqA8Hq5.8sQ6u9LTe4XU9l72XU88XW.tO.Jc1x5F2nK5A7aW', 'Infraestrutura', 'colaborador');

-- Solicitações Iniciais para Demonstração dos Status e Filtros
INSERT OR IGNORE INTO solicitacoes (id, codigo, titulo, descricao, categoria, status, usuario_id, data_abertura, data_atualizacao, data_conclusao, observacoes) VALUES
(1, 'SOL-2026-0001', 'Troca de teclado e mouse ergonômico', 'Teclado atual está apresentando falha intermitente na tecla barra de espaço.', 'TI', 'Aberto', 2, '2026-09-27 09:15:00', '2026-09-27 09:15:00', NULL, 'Aguardando validação do estoque.'),
(2, 'SOL-2026-0002', 'Cadeira ergonômica para estação de trabalho', 'Solicito avaliação do time de segurança do trabalho e aquisição de cadeira ergonômica com laudo NR17.', 'Infraestrutura', 'Em Atendimento', 2, '2026-09-27 10:30:00', '2026-09-28 14:00:00', NULL, 'Chamado em cotação com três fornecedores credenciados.'),
(3, 'SOL-2026-0003', 'Reembolso de despesas de viagem de treinamento', 'Envio de comprovantes e notas de transporte e refeições referente ao treinamento em Campina Grande.', 'Financeiro', 'Concluído', 3, '2026-09-25 14:00:00', '2026-09-26 17:30:00', '2026-09-26 17:30:00', 'Depósito efetuado na conta do colaborador.'),
(4, 'SOL-2026-0004', 'Aquisição de licença JetBrains WebStorm', 'Necessidade de renovação de licença individual para desenvolvimento de frontend em React/TypeScript.', 'Compras', 'Aberto', 4, '2026-09-28 11:20:00', '2026-09-28 11:20:00', NULL, NULL),
(5, 'SOL-2026-0005', 'Criação de conta de e-mail e acessos para novo colaborador', 'Novo desenvolvedor júnior iniciando na próxima semana na equipe de sistemas.', 'RH', 'Concluído', 2, '2026-09-24 08:45:00', '2026-09-24 16:00:00', '2026-09-24 16:00:00', 'Usuário e acessos ao repositório criados com sucesso.');

-- Histórico de Eventos Iniciais
INSERT OR IGNORE INTO solicitacao_historico (id, solicitacao_id, usuario_id, status_anterior, novo_status, comentario, data_registro) VALUES
(1, 1, 2, NULL, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-27 09:15:00'),
(2, 2, 2, NULL, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-27 10:30:00'),
(3, 2, 1, 'Aberto', 'Em Atendimento', 'Equipe de infraestrutura assumiu o atendimento para cotação.', '2026-09-28 14:00:00'),
(4, 3, 3, NULL, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-25 14:00:00'),
(5, 3, 1, 'Aberto', 'Em Atendimento', 'Financeiro iniciou conferência de notas fiscais.', '2026-09-26 10:00:00'),
(6, 3, 1, 'Em Atendimento', 'Concluído', 'Reembolso processado e comprovante emitido.', '2026-09-26 17:30:00'),
(7, 4, 4, NULL, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-28 11:20:00'),
(8, 5, 2, NULL, 'Aberto', 'Solicitação cadastrada pelo colaborador.', '2026-09-24 08:45:00'),
(9, 5, 1, 'Aberto', 'Concluído', 'Acessos concedidos diretamente pelo time de TI.', '2026-09-24 16:00:00');
