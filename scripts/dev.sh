#!/bin/bash

# Script para iniciar ambiente de desenvolvimento

echo "🚀 Iniciando ambiente de desenvolvimento..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Iniciar banco de dados de desenvolvimento
echo "📊 Iniciando banco de dados MySQL..."
docker-compose -f docker-compose.dev.yml up -d

# Aguardar banco estar pronto
echo "⏳ Aguardando banco de dados ficar pronto..."
sleep 10

# Verificar se o banco está rodando
if ! docker-compose -f docker-compose.dev.yml ps mysql-dev | grep -q "Up"; then
    echo "❌ Erro ao iniciar banco de dados"
    exit 1
fi

echo "✅ Banco de dados iniciado com sucesso!"
echo "🌐 phpMyAdmin disponível em: http://localhost:8080"
echo ""
echo "Para iniciar o backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Para iniciar o frontend:"
echo "  cd frontend && yarn dev"
echo ""
echo "Para parar o ambiente:"
echo "  ./scripts/stop-dev.sh"

