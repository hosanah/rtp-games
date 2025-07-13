import './loadEnv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sequelize from './models';

// Importar rotas
import authRoutes from './routes/auth';
import bettingHouseRoutes from './routes/bettingHouse';
import gameRoutes from './routes/game';
import settingRoutes from './routes/setting';
import initWebSocket from './websocket';


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

// Configurar CORS com suporte a multiplas origens
const allowedOriginsEnv = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = allowedOriginsEnv
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const clean = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(clean)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/houses', bettingHouseRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/settings', settingRoutes);

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

// Página base
app.get('/', (req, res) => {
  res.send('RTP Games Dashboard API está no ar');
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 RTP Games Dashboard API iniciada`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

initWebSocket(server);

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

