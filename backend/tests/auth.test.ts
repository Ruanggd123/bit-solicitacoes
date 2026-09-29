import request from 'supertest';
import { app } from '../src/app';

describe('Testes de Autenticação (/api/auth)', () => {
  it('Deve autenticar com sucesso o usuário admin e retornar token JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        usuario: 'admin',
        senha: 'admin123'
      });

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toHaveProperty('token');
    expect(res.body.dados.usuario).toHaveProperty('id');
    expect(res.body.dados.usuario.usuario).toBe('admin');
    expect(res.body.dados.usuario.perfil).toBe('administrador');
  });

  it('Deve recusar login com senha incorreta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        usuario: 'admin',
        senha: 'senha_errada_123'
      });

    expect(res.status).toBe(401);
    expect(res.body.sucesso).toBe(false);
  });

  it('Deve recusar login com usuário inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        usuario: 'usuario_inexistente',
        senha: 'qualquer_senha'
      });

    expect(res.status).toBe(401);
    expect(res.body.sucesso).toBe(false);
  });

  it('Deve retornar 400 se campos obrigatórios não forem fornecidos', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        usuario: 'admin'
      });

    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  it('Deve barrar acesso a rota protegida sem token JWT', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('Deve retornar dados do usuário logado na rota /api/auth/me', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        usuario: 'admin',
        senha: 'admin123'
      });

    const token = loginRes.body.dados.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.sucesso).toBe(true);
    expect(meRes.body.dados.usuario).toBe('admin');
  });
});
