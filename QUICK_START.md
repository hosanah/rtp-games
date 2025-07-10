# 🚀 Guia de Início Rápido - RTP Games Dashboard

## ⚡ Início Rápido com Docker (Recomendado)

### 1. Pré-requisitos
- Docker e Docker Compose instalados
- Portas 3000, 3001 e 3306 disponíveis

### 2. Deploy Completo
```bash
# Clone o projeto
git clone <repository-url>
cd rtp-games-dashboard

# Deploy completo (produção)
./scripts/deploy.sh
```

### 3. Acesse a Aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Banco MySQL**: localhost:3306

### 4. Login de Teste
- **Email**: admin@rtpgames.com
- **Senha**: 123456

---

## 🛠️ Desenvolvimento Local

### 1. Iniciar Banco de Dados
```bash
# Iniciar apenas o MySQL para desenvolvimento
./scripts/dev.sh
```

### 2. Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend (Terminal 2)
```bash
cd frontend
yarn install
yarn dev
```

### 4. Acessar
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **phpMyAdmin**: http://localhost:8080

---

## 📊 Funcionalidades Principais

### ✅ Autenticação
- Cadastro e login de usuários
- Proteção de rotas com JWT
- Logout seguro

### ✅ Dashboard
- Visão geral das estatísticas
- Ações rápidas
- Atividade recente

### ✅ Jogos
- Catálogo completo de jogos
- Filtros por categoria e provedor
- Busca por nome

### ✅ RTP Tracking
- Registro de valores RTP
- Histórico pessoal
- Estatísticas detalhadas

---

## 🔧 Comandos Úteis

### Docker
```bash
# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Rebuild
docker-compose up --build
```

### Desenvolvimento
```bash
# Backend
npm run dev          # Desenvolvimento
npm run build        # Build
npm run prisma:studio # Interface do banco

# Frontend
yarn dev             # Desenvolvimento
yarn build           # Build
yarn lint            # Linter
```

---

## 🗄️ Banco de Dados

### Credenciais (Desenvolvimento)
- **Host**: localhost:3306
- **Usuário**: root
- **Senha**: password
- **Database**: rtp_games_dashboard

### Dados de Teste
- 3 usuários pré-cadastrados
- 8 jogos de exemplo
- Histórico RTP simulado

---

## 🚨 Troubleshooting

### Porta em uso
```bash
# Verificar portas
lsof -i :3000
lsof -i :3001
lsof -i :3306

# Parar containers
docker-compose down
```

### Erro de conexão
1. Verifique se o MySQL está rodando
2. Confirme as variáveis de ambiente
3. Aguarde o banco inicializar (30s)

### Erro de build
1. Limpe node_modules: `rm -rf node_modules && npm install`
2. Limpe cache do Next.js: `rm -rf .next`
3. Rebuild: `yarn build`

---

## 📝 Próximos Passos

1. **Explore o Dashboard** - Veja as estatísticas gerais
2. **Navegue pelos Jogos** - Use filtros e busca
3. **Adicione Registros RTP** - Comece a trackear seus dados
4. **Analise Estatísticas** - Veja seus padrões de jogo

---

**Dica**: Use as credenciais de teste para explorar todas as funcionalidades!

