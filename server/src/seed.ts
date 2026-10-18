import { prisma } from './db.js';
import bcrypt from 'bcryptjs';
import { DOCTORS } from '../../src/data/doctors.js';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Demo Patient & Doctor Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'patient@curahealth.com' },
    update: {},
    create: {
      email: 'patient@curahealth.com',
      passwordHash,
      name: 'Adarsh Mishra',
      role: 'PATIENT',
      phone: '+1 (555) 019-2834',
    },
  });
  console.log(`✅ Demo patient user ready: ${demoUser.email} (password: password123)`);

  const doctorUser = await prisma.user.upsert({
    where: { email: 'dr.richard@curahealth.com' },
    update: {},
    create: {
      email: 'dr.richard@curahealth.com',
      passwordHash,
      name: 'Dr. Richard James',
      role: 'DOCTOR',
      phone: '+1 (555) 482-1920',
    },
  });
  console.log(`✅ Demo doctor user ready: ${doctorUser.email} (password: password123)`);

  // 2. Seed All Doctors
  console.log(`📋 Seeding ${DOCTORS.length} doctors into PostgreSQL...`);
  for (const doc of DOCTORS) {
    await prisma.doctor.upsert({
      where: { id: doc.id },
      update: {
        name: doc.name,
        specialty: doc.specialtyName,
        qualification: doc.qualifications,
        experience: doc.experienceYears,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        fee: doc.consultationFee,
        location: doc.address,
        hospital: doc.hospital,
        avatar: doc.avatarUrl,
        about: doc.about,
        nextAvailable: doc.availableDates?.[0]?.dateStr || 'Available Tomorrow',
        consultationModes: ['video', 'in-person'],
        availability: doc.availableDates || [],
      },
      create: {
        id: doc.id,
        name: doc.name,
        specialty: doc.specialtyName,
        qualification: doc.qualifications,
        experience: doc.experienceYears,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        fee: doc.consultationFee,
        location: doc.address,
        hospital: doc.hospital,
        avatar: doc.avatarUrl,
        about: doc.about,
        nextAvailable: doc.availableDates?.[0]?.dateStr || 'Available Tomorrow',
        consultationModes: ['video', 'in-person'],
        availability: doc.availableDates || [],
      },
    });
  }

  console.log(`✅ All ${DOCTORS.length} doctors successfully seeded into PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
