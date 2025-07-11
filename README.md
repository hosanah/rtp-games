# RTP Games Dashboard

Uma aplicação completa para monitoramento e análise de RTP (Return to Player) de jogos de cassino, desenvolvida com React + Vite, Node.js, Express.js, PostgreSQL e Sequelize ORM.

## 🚀 Tecnologias

### Frontend
- **React** com **Vite**
- **TypeScript**
- **TailwindCSS 3.4.17**
- **React Hook Form** com validação Zod
- **Axios** para requisições HTTP
- **Lucide React** para ícones

### Backend
- **Node.js** com **Express.js**
- **TypeScript**
- **Sequelize ORM**
- **PostgreSQL**
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **CORS** e **Helmet** para segurança

### DevOps
- **Docker** e **Docker Compose**
- **Scripts** automatizados para desenvolvimento e deploy

## 📋 Funcionalidades

### Autenticação
- ✅ Cadastro de usuários
- ✅ Login com JWT
- ✅ Middleware de proteção de rotas
- ✅ Logout seguro

### Dashboard
- ✅ Visão geral das estatísticas
- ✅ Cards informativos
- ✅ Ações rápidas
- ✅ Atividade recente

### Jogos
- ✅ Listagem de jogos com filtros
- ✅ Busca por nome, provedor ou categoria
- ✅ Paginação
- ✅ Detalhes do jogo

### RTP (Return to Player)
- ✅ Registro de valores RTP
- ✅ Histórico pessoal
- ✅ Estatísticas detalhadas
- ✅ Análise por jogo

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose
- Git

### 1. Clone o repositório
```bash
git clone <repository-url>
cd rtp-games-dashboard
```

### 2. Configuração para Desenvolvimento

#### Opção A: Usando Docker (Recomendado)
```bash
# Iniciar ambiente de desenvolvimento
./scripts/dev.sh

# Em outro terminal, iniciar o backend
cd backend
npm install
npm run dev

# Em outro terminal, iniciar o frontend
cd frontend
npm install
npm run dev
```

#### Opção B: Instalação Manual
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Configure as variáveis no .env
npm run migrate
npm run seed
npm run dev

# Frontend
cd frontend
npm install
cp .env.local.example .env.local
# Configure as variáveis no .env.local (VITE_API_URL e VITE_WS_URL)
npm run dev
```

### 3. Deploy em Produção
```bash
# Deploy completo com Docker
./scripts/deploy.sh
```

## 🌐 URLs da Aplicação

### Desenvolvimento
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **pgAdmin**: http://localhost:8080

### Produção (Docker)
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

## 🔐 Credenciais de Teste

### Usuário Admin
- **Email**: admin@rtpgames.com
- **Senha**: 123456

### Outros Usuários
- **Email**: joao@example.com / **Senha**: 123456
- **Email**: maria@example.com / **Senha**: 123456

### Banco de Dados (Desenvolvimento)
- **Host**: localhost:5432
- **Usuário**: postgres
- **Senha**: 2412055aa
- **Database**: vigilancia

## 📁 Estrutura do Projeto

```
rtp-games-dashboard/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── middleware/      # Middlewares (auth, etc.)
│   │   ├── routes/          # Rotas da API
│   │   ├── types/           # Tipos TypeScript
│   │   └── utils/           # Utilitários
│   ├── models/              # Sequelize models
│   └── package.json
├── frontend/                # App React + Vite
│   ├── src/
│   │   ├── pages/           # Páginas
│   │   ├── components/      # Componentes React
│   │   ├── hooks/           # Hooks customizados
│   │   ├── lib/             # Utilitários e configurações
│   │   └── types/           # Tipos TypeScript
│   └── package.json
├── Dockerfile               # Build da aplicação frontend
├── Dockerfileapi            # Build da API backend
├── scripts/                 # Scripts de automação
├── docker-compose.yml       # Produção
├── docker-compose.dev.yml   # Desenvolvimento
└── README.md
```

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm start            # Iniciar produção
npm run migrate         # Executar migrations
npm run seed            # Popular banco com dados
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar produção
npm run lint         # Linter
```

### Docker
```bash
./scripts/dev.sh         # Ambiente de desenvolvimento
./scripts/stop-dev.sh    # Parar desenvolvimento
./scripts/deploy.sh      # Deploy produção
```

## 🗄️ Banco de Dados

### Tabelas Principais
- **users**: Usuários do sistema
- **games**: Catálogo de jogos
- **rtp_history**: Histórico de registros RTP

### Relacionamentos
- Um usuário pode ter muitos registros RTP
- Um jogo pode ter muitos registros RTP
- Cada registro RTP pertence a um usuário e um jogo

## 🔒 Segurança

- **JWT** para autenticação stateless
- **bcrypt** para hash de senhas (12 rounds)
- **Helmet** para headers de segurança
- **Rate limiting** para prevenir ataques
- **CORS** configurado adequadamente
- **Validação** de entrada em todas as rotas

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário
- `GET /api/auth/verify` - Verificar token

### Jogos
- `GET /api/games` - Listar jogos
- `GET /api/games/:id` - Detalhes do jogo
- `GET /api/games/categories` - Categorias
- `GET /api/games/providers` - Provedores
- `GET /api/games/stats` - Estatísticas

### RTP
- `POST /api/rtp` - Adicionar registro
- `GET /api/rtp/history` - Histórico do usuário
- `GET /api/rtp/stats` - Estatísticas do usuário
- `GET /api/rtp/games/:id/history` - Histórico do jogo
- `DELETE /api/rtp/:id` - Deletar registro

### Betting Houses
- `POST /api/houses` - Criar casa de aposta
- `GET /api/houses` - Listar casas de aposta
- `GET /api/houses/:id` - Detalhes da casa de aposta
- `PUT /api/houses/:id` - Atualizar casa de aposta
- `DELETE /api/houses/:id` - Remover casa de aposta

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**
   - Verifique se o PostgreSQL está rodando
   - Confirme as credenciais no .env

2. **Erro de CORS**
   - Verifique a configuração FRONTEND_URL no backend
   - Confirme a URL da API no frontend

3. **Erro de autenticação**
   - Verifique se o JWT_SECRET está configurado
   - Confirme se o token está sendo enviado corretamente

### Logs
```bash
# Ver logs do Docker
docker-compose logs -f

# Ver logs específicos
docker-compose logs backend
docker-compose logs frontend
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

## 👥 Autores

Desenvolvido como projeto de demonstração de stack completa com React + Vite, Node.js, Express.js, PostgreSQL e Docker.

---

**Nota**: Este é um projeto de demonstração. Para uso em produção, considere implementar funcionalidades adicionais de segurança, monitoramento e backup.

