#!/bin/bash

# Script para parar ambiente de desenvolvimento

echo "🛑 Parando ambiente de desenvolvimento..."

# Parar containers de desenvolvimento
docker-compose -f docker-compose.dev.yml down

echo "✅ Ambiente de desenvolvimento parado com sucesso!"

