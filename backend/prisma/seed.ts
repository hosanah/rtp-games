import '../src/loadEnv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.rtpHistory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.game.deleteMany();

  // Criar usuários de exemplo
  const hashedPassword = await bcrypt.hash('123456', 12);
  
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@rtpgames.com',
        password: hashedPassword,
      },
      {
        name: 'João Silva',
        email: 'joao@example.com',
        password: hashedPassword,
      },
      {
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: hashedPassword,
      },
    ],
  });

  console.log(`✅ Criados ${users.count} usuários`);

  // Criar jogos de exemplo
  const games = await prisma.game.createMany({
    data: [
      {
        name: 'Book of Dead',
        provider: 'Play\'n GO',
        category: 'Slots',
        minRtp: 94.25,
        maxRtp: 96.21,
        currentRtp: 95.50,
        imageUrl: 'https://example.com/book-of-dead.jpg',
        description: 'Aventure-se no antigo Egito com Rich Wilde nesta emocionante slot de alta volatilidade.',
      },
      {
        name: 'Starburst',
        provider: 'NetEnt',
        category: 'Slots',
        minRtp: 95.98,
        maxRtp: 96.09,
        currentRtp: 96.01,
        imageUrl: 'https://example.com/starburst.jpg',
        description: 'Um clássico jogo de slots com gemas brilhantes e recursos de re-spin.',
      },
      {
        name: 'Gonzo\'s Quest',
        provider: 'NetEnt',
        category: 'Slots',
        minRtp: 95.97,
        maxRtp: 96.00,
        currentRtp: 95.98,
        imageUrl: 'https://example.com/gonzos-quest.jpg',
        description: 'Junte-se a Gonzo em sua busca por ouro com o inovador sistema Avalanche.',
      },
      {
        name: 'Mega Moolah',
        provider: 'Microgaming',
        category: 'Progressive Slots',
        minRtp: 88.12,
        maxRtp: 88.12,
        currentRtp: 88.12,
        imageUrl: 'https://example.com/mega-moolah.jpg',
        description: 'O famoso slot progressivo que já criou muitos milionários.',
      },
      {
        name: 'Lightning Roulette',
        provider: 'Evolution Gaming',
        category: 'Live Casino',
        minRtp: 97.10,
        maxRtp: 97.30,
        currentRtp: 97.20,
        imageUrl: 'https://example.com/lightning-roulette.jpg',
        description: 'Roleta ao vivo com multiplicadores de raio para ganhos eletrizantes.',
      },
      {
        name: 'Blackjack Classic',
        provider: 'Evolution Gaming',
        category: 'Live Casino',
        minRtp: 99.28,
        maxRtp: 99.56,
        currentRtp: 99.42,
        imageUrl: 'https://example.com/blackjack-classic.jpg',
        description: 'O clássico jogo de blackjack com dealers profissionais ao vivo.',
      },
      {
        name: 'Sweet Bonanza',
        provider: 'Pragmatic Play',
        category: 'Slots',
        minRtp: 96.48,
        maxRtp: 96.51,
        currentRtp: 96.49,
        imageUrl: 'https://example.com/sweet-bonanza.jpg',
        description: 'Doces e frutas em um slot colorido com recursos de compra de bônus.',
      },
      {
        name: 'Gates of Olympus',
        provider: 'Pragmatic Play',
        category: 'Slots',
        minRtp: 96.50,
        maxRtp: 96.50,
        currentRtp: 96.50,
        imageUrl: 'https://example.com/gates-of-olympus.jpg',
        description: 'Zeus governa este slot épico com multiplicadores divinos.',
      },
    ],
  });

  console.log(`✅ Criados ${games.count} jogos`);

  // Criar histórico RTP de exemplo
  const allUsers = await prisma.user.findMany();
  const allGames = await prisma.game.findMany();

  const rtpHistoryData = [];
  
  // Criar alguns registros de histórico para cada usuário
  for (const user of allUsers) {
    for (let i = 0; i < 5; i++) {
      const randomGame = allGames[Math.floor(Math.random() * allGames.length)];
      const rtpVariation = (Math.random() - 0.5) * 2; // Variação de -1 a +1
      const rtpValue = Math.max(
        randomGame.minRtp,
        Math.min(randomGame.maxRtp, randomGame.currentRtp + rtpVariation)
      );

      rtpHistoryData.push({
        userId: user.id,
        gameId: randomGame.id,
        rtpValue: parseFloat(rtpValue.toFixed(2)),
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 dias
        notes: Math.random() > 0.5 ? `Sessão de ${Math.floor(Math.random() * 120 + 30)} minutos` : null,
      });
    }
  }

  const rtpHistory = await prisma.rtpHistory.createMany({
    data: rtpHistoryData,
  });

  console.log(`✅ Criados ${rtpHistory.count} registros de histórico RTP`);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

