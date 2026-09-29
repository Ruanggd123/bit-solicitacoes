import request from 'supertest';
import { app } from '../src/app';

describe('Testes de Solicitações (/api/solicitacoes)', () => {
  let tokenAdmin: string;
  let tokenColaborador: string;

  beforeAll(async () => {
    // Obter token do admin
    const resAdmin = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'admin', senha: 'admin123' });
    tokenAdmin = resAdmin.body.dados.token;

    // Obter token do colaborador
    const resColab = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'joao.silva', senha: 'senha123' });
    tokenColaborador = resColab.body.dados.token;
  });

  it('Deve listar solicitações cadastradas', async () => {
    const res = await request(app)
      .get('/api/solicitacoes')
      .set('Authorization', `Bearer ${tokenColaborador}`);

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(Array.isArray(res.body.dados)).toBe(true);
    expect(res.body.dados.length).toBeGreaterThan(0);
  });

  it('Deve criar uma nova solicitação com status inicial "Aberto" e código gerado', async () => {
    const res = await request(app)
      .post('/api/solicitacoes')
      .set('Authorization', `Bearer ${tokenColaborador}`)
      .send({
        titulo: 'Monitor adicional para desenvolvimento',
        descricao: 'Necessito de um segundo monitor de 24 polegadas para visualização simultânea de código e documentação.',
        categoria: 'TI'
      });

    expect(res.status).toBe(201);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.status).toBe('Aberto');
    expect(res.body.dados.codigo).toMatch(/^SOL-\d{4}-\d{4}$/);
    expect(res.body.dados.titulo).toBe('Monitor adicional para desenvolvimento');
  });

  it('Deve recusar criação de solicitação sem campos obrigatórios', async () => {
    const res = await request(app)
      .post('/api/solicitacoes')
      .set('Authorization', `Bearer ${tokenColaborador}`)
      .send({
        titulo: 'Título sem descrição nem categoria'
      });

    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  it('Deve filtrar solicitações por categoria', async () => {
    const res = await request(app)
      .get('/api/solicitacoes?categoria=TI')
      .set('Authorization', `Bearer ${tokenColaborador}`);

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.every((s: any) => s.categoria === 'TI')).toBe(true);
  });

  it('Deve filtrar solicitações por status', async () => {
    const res = await request(app)
      .get('/api/solicitacoes?status=Concluído')
      .set('Authorization', `Bearer ${tokenColaborador}`);

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.every((s: any) => s.status === 'Concluído')).toBe(true);
  });

  it('Deve filtrar solicitações por texto no título', async () => {
    const res = await request(app)
      .get('/api/solicitacoes?titulo=ergonômico')
      .set('Authorization', `Bearer ${tokenColaborador}`);

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.length).toBeGreaterThan(0);
  });

  it('Deve consultar detalhes e histórico de uma solicitação por ID', async () => {
    const res = await request(app)
      .get('/api/solicitacoes/1')
      .set('Authorization', `Bearer ${tokenColaborador}`);

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('historico');
    expect(Array.isArray(res.body.historico)).toBe(true);
  });

  it('Deve permitir editar solicitação com status "Aberto"', async () => {
    // Primeiro cria uma nova
    const createRes = await request(app)
      .post('/api/solicitacoes')
      .set('Authorization', `Bearer ${tokenColaborador}`)
      .send({
        titulo: 'Item para edição teste',
        descricao: 'Descrição temporária antes de atualizar os dados cadastrais.',
        categoria: 'RH'
      });

    const id = createRes.body.dados.id;

    // Edita
    const editRes = await request(app)
      .put(`/api/solicitacoes/${id}`)
      .set('Authorization', `Bearer ${tokenColaborador}`)
      .send({
        titulo: 'Item editado com sucesso',
        descricao: 'Descrição atualizada com dados revisados.'
      });

    expect(editRes.status).toBe(200);
    expect(editRes.body.sucesso).toBe(true);
    expect(editRes.body.dados.titulo).toBe('Item editado com sucesso');
  });

  it('Deve PROIBIR edição de solicitação com status diferente de "Aberto"', async () => {
    // Chamado 3 é Concluído no seed
    const res = await request(app)
      .put('/api/solicitacoes/3')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        titulo: 'Tentativa indevida de alterar solicitação já concluída'
      });

    expect(res.status).toBe(422);
    expect(res.body.sucesso).toBe(false);
    expect(res.body.mensagem).toContain('Apenas solicitações com status "Aberto" podem ser alteradas');
  });

  it('Deve PROIBIR exclusão de solicitação com status diferente de "Aberto"', async () => {
    // Chamado 2 é 'Em Atendimento' no seed
    const res = await request(app)
      .delete('/api/solicitacoes/2')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(422);
    expect(res.body.sucesso).toBe(false);
    expect(res.body.mensagem).toContain('Apenas solicitações com status "Aberto" podem ser excluídas');
  });

  it('Deve permitir excluir solicitação com status "Aberto"', async () => {
    // Cria uma nova
    const createRes = await request(app)
      .post('/api/solicitacoes')
      .set('Authorization', `Bearer ${tokenColaborador}`)
      .send({
        titulo: 'Solicitação criada para ser excluída',
        descricao: 'Esta solicitação será removida no teste funcional.',
        categoria: 'Compras'
      });

    const id = createRes.body.dados.id;

    // Exclui
    const delRes = await request(app)
      .delete(`/api/solicitacoes/${id}`)
      .set('Authorization', `Bearer ${tokenColaborador}`);

    expect(delRes.status).toBe(200);
    expect(delRes.body.sucesso).toBe(true);
  });

  it('Deve alterar o status de "Aberto" para "Em Atendimento" e depois "Concluído"', async () => {
    // Cria nova solicitação
    const createRes = await request(app)
      .post('/api/solicitacoes')
      .set('Authorization', `Bearer ${tokenColaborador}`)
      .send({
        titulo: 'Teste de fluxo de status',
        descricao: 'Verificação da máquina de estados e auditoria de transições.',
        categoria: 'TI'
      });

    const id = createRes.body.dados.id;

    // Transição para "Em Atendimento"
    const status1Res = await request(app)
      .patch(`/api/solicitacoes/${id}/status`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        status: 'Em Atendimento',
        comentario: 'Iniciado atendimento técnico pela equipe de suporte.'
      });

    expect(status1Res.status).toBe(200);
    expect(status1Res.body.dados.status).toBe('Em Atendimento');

    // Transição para "Concluído"
    const status2Res = await request(app)
      .patch(`/api/solicitacoes/${id}/status`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        status: 'Concluído',
        comentario: 'Atendimento finalizado e validado pelo suporte.'
      });

    expect(status2Res.status).toBe(200);
    expect(status2Res.body.dados.status).toBe('Concluído');
    expect(status2Res.body.dados.data_conclusao).not.toBeNull();
  });
});
