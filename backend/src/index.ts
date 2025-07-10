import './loadEnv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './models';

// Importar rotas
import authRoutes from './routes/auth';


const app = express();
const PORT = parseInt(process.env.PORT || '3001');

// Testar conexão com o banco de dados via Sequelize
export const db = sequelize;
db.authenticate().then(() => {
  console.log('Conectado ao banco de dados via Sequelize');
}).catch(err => {
  console.error('Erro ao conectar ao banco de dados:', err);
});

// Middleware de segurança
app.use(helmet());

// Configurar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela de tempo
  message: 'Muitas tentativas, tente novamente em 15 minutos.'
});
app.use(limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'RTP Games Dashboard API'
  });
});

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 RTP Games Dashboard API iniciada`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, encerrando servidor...');
  await db.close();
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT recebido, encerrando servidor...');
  await db.close();
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

export default app;

