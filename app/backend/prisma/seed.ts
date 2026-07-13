import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_ADVISOR_ID = '00000000-0000-0000-0000-000000000001';
const DEMO_CLIENT_ID = '00000000-0000-0000-0000-000000000002';

async function main() {
  console.log('Starting seed...');

  // 1. Create Advisor
  const advisorPassword = await bcrypt.hash('advisor1234', 10);
  const advisor = await prisma.user.upsert({
    where: { email: 'advisor@weallth.demo' },
    update: {},
    create: {
      id: DEMO_ADVISOR_ID,
      email: 'advisor@weallth.demo',
      name: 'John Advisor',
      passwordHash: advisorPassword,
      role: 'advisor',
      onboardingComplete: true,
    },
  });
  console.log(`Advisor created: ${advisor.email}`);

  // 2. Create Client
  const clientPassword = await bcrypt.hash('demo1234', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@weallth.demo' },
    update: {},
    create: {
      id: DEMO_CLIENT_ID,
      email: 'client@weallth.demo',
      name: 'Jane Demo',
      passwordHash: clientPassword,
      role: 'client',
      onboardingComplete: false,
    },
  });
  console.log(`Client created: ${client.email}`);

  // 3. Create Consent Link
  const consent = await prisma.advisorClientConsent.upsert({
    where: {
      advisorId_clientId: {
        advisorId: DEMO_ADVISOR_ID,
        clientId: DEMO_CLIENT_ID,
      },
    },
    update: {},
    create: {
      advisorId: DEMO_ADVISOR_ID,
      clientId: DEMO_CLIENT_ID,
    },
  });
  console.log(`Consent link created: Advisor ${consent.advisorId} -> Client ${consent.clientId}`);

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
