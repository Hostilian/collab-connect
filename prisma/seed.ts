import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@collab-connect.com' },
    update: {},
    create: {
      email: 'admin@collab-connect.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123!@#', 10),
      emailVerified: new Date(),
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create test users
  const testUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await bcrypt.hash('password123', 10),
        emailVerified: new Date(),
        image: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        password: await bcrypt.hash('password123', 10),
        emailVerified: new Date(),
        image: 'https://avatars.githubusercontent.com/u/3?v=4',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob.johnson@example.com' },
      update: {},
      create: {
        email: 'bob.johnson@example.com',
        name: 'Bob Johnson',
        password: await bcrypt.hash('password123', 10),
        emailVerified: new Date(),
        image: 'https://avatars.githubusercontent.com/u/4?v=4',
      },
    }),
  ]);

  console.log(`✅ Created ${testUsers.length} test users`);

  // Create sample profiles with location data
  const profiles = await Promise.all([
    prisma.profile.upsert({
      where: { userId: testUsers[0].id },
      update: {},
      create: {
        userId: testUsers[0].id,
  bio: 'Full-stack developer passionate about collaboration and open source.',
  location: 'San Francisco, CA',
  latitude: 37.7749,
  longitude: -122.4194,
  isVerified: true,
      },
    }),
    prisma.profile.upsert({
      where: { userId: testUsers[1].id },
      update: {},
      create: {
        userId: testUsers[1].id,
  bio: 'UX designer and product manager looking for exciting projects.',
  location: 'New York, NY',
  latitude: 40.7128,
  longitude: -74.006,
  isVerified: false,
      },
    }),
    prisma.profile.upsert({
      where: { userId: testUsers[2].id },
      update: {},
      create: {
        userId: testUsers[2].id,
  bio: 'Backend engineer with expertise in distributed systems.',
  location: 'Austin, TX',
  latitude: 30.2672,
  longitude: -97.7431,
  isVerified: false,
      },
    }),
  ]);

  console.log(`✅ Created ${profiles.length} profiles with location data`);

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin: admin@collab-connect.com / admin123!@#');
  console.log('User 1: john.doe@example.com / password123');
  console.log('User 2: jane.smith@example.com / password123');
  console.log('User 3: bob.johnson@example.com / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
