import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { db } from './config/database';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor backend rodando com sucesso!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Banco SQLite inicializado e sincronizado.`);
  console.log(`====================================================`);
});

// Encerramento gracioso do servidor e conexões
process.on('SIGTERM', () => {
  console.log('Recebido sinal SIGTERM, encerrando servidor com segurança...');
  server.close(() => {
    db.close();
    console.log('Conexões fechadas com sucesso.');
    process.exit(0);
  });
});
