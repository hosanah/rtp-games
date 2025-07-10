#!/bin/bash

# Script para deploy em produção

echo "🚀 Iniciando deploy em produção..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Verificar se os serviços estão rodando
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deploy realizado com sucesso!"
    echo ""
    echo "🌐 Frontend disponível em: http://localhost:3000"
    echo "🔧 Backend API disponível em: http://localhost:3001"
    echo "📊 Banco de dados PostgreSQL na porta: 5432"
    echo ""
    echo "Para ver logs:"
    echo "  docker-compose logs -f"
    echo ""
    echo "Para parar:"
    echo "  docker-compose down"
else
    echo "❌ Erro no deploy. Verificando logs..."
    docker-compose logs
    exit 1
fi

