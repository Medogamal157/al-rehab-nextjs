import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Email of the admin whose password will be reset
const ADMIN_EMAIL = 'admin@alrehabgroup.com';
// New password to set
const NEW_PASSWORD = 'Admin@2024!Secure';

// Create PostgreSQL connection pool using DATABASE_URL from .env
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  ssl: false,
});
const adapter = new PrismaPg(pool, { schema: 'alrehab' });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔐 Resetting admin password...');

  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (!existing) {
    console.error(`❌ No user found with email: ${ADMIN_EMAIL}`);
    const users = await prisma.user.findMany({ select: { email: true, role: true } });
    if (users.length > 0) {
      console.log('\nExisting users in the database:');
      users.forEach((u) => console.log(`   - ${u.email} (${u.role})`));
      console.log('\nUpdate ADMIN_EMAIL in prisma/reset-password.ts to one of the above.');
    } else {
      console.log('\nNo users exist in the database. Run the seed script to create one.');
    }
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);

  const user = await prisma.user.update({
    where: { email: ADMIN_EMAIL },
    data: { password: hashedPassword },
  });

  console.log(`✅ Password reset for: ${user.email}`);
  console.log(`   New password: ${NEW_PASSWORD}`);
  console.log('\n⚠️  Please change the password after logging in!');
}

main()
  .catch((e) => {
    console.error('❌ Password reset failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
