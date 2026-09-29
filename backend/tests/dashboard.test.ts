import request from 'supertest';
import { app } from '../src/app';

describe('Testes do Dashboard (/api/dashboard)', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'admin', senha: 'admin123' });
    token = res.body.dados.token;
  });

  it('Deve retornar os indicadores consolidados do dashboard', async () => {
    const res = await request(app)
      .get('/api/dashboard/metricas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toHaveProperty('total');
    expect(res.body.dados).toHaveProperty('abertas');
    expect(res.body.dados).toHaveProperty('em_atendimento');
    expect(res.body.dados).toHaveProperty('concluidas');
    expect(typeof res.body.dados.total).toBe('number');
    expect(res.body.dados.total).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.dados.por_categoria)).toBe(true);
  });
});
