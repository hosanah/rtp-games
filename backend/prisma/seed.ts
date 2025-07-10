import '../src/loadEnv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados (usuários)...');

  // Descomente se quiser limpar os usuários existentes antes
  // await prisma.user.deleteMany();

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
