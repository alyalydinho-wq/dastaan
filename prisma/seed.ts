import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed started...');

  // 1. Nettoyage de la base
  await prisma.appointment.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.admin.deleteMany();

  // 2. Création de l'admin par défaut
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.create({
    data: {
      email: 'admin@tbm.re',
      password: hashedPassword,
    },
  });

  // 3. Création de 5 véhicules réalistes pour La Réunion
  const vehicles = [
    {
      brand: 'Toyota',
      model: 'Hilux Invincible',
      year: 2022,
      price: 42500,
      mileage: 35000,
      fuel: 'Diesel',
      transmission: 'Automatique',
      color: 'Gris Anthracite',
      description: 'Parfait pour les routes de La Réunion. État irréprochable, entretien à jour chez Toyota.',
      images: ['https://picsum.photos/seed/hilux1/800/600', 'https://picsum.photos/seed/hilux2/800/600'],
      featured: true,
      status: 'available',
    },
    {
      brand: 'Peugeot',
      model: '3008 GT Pack',
      year: 2021,
      price: 29900,
      mileage: 42000,
      fuel: 'Hybride',
      transmission: 'Automatique',
      color: 'Bleu Célèbes',
      description: 'SUV confortable et économique. Idéal pour les trajets mixtes littoral/hauts.',
      images: ['https://picsum.photos/seed/3008_1/800/600'],
      featured: true,
      status: 'available',
    },
    {
      brand: 'Dacia',
      model: 'Duster Prestige',
      year: 2020,
      price: 16500,
      mileage: 55000,
      fuel: 'Diesel',
      transmission: 'Manuelle',
      color: 'Orange Atacama',
      description: 'Le baroudeur par excellence. Très bon rapport qualité/prix pour l\'île.',
      images: ['https://picsum.photos/seed/duster1/800/600'],
      featured: false,
      status: 'available',
    },
    {
      brand: 'Renault',
      model: 'Clio V RS Line',
      year: 2023,
      price: 19800,
      mileage: 12500,
      fuel: 'Essence',
      transmission: 'Manuelle',
      color: 'Rouge Flamme',
      description: 'Citadine sportive et moderne. Faible kilométrage, garantie constructeur.',
      images: ['https://picsum.photos/seed/clio5/800/600'],
      featured: true,
      status: 'available',
    },
    {
      brand: 'Volkswagen',
      model: 'Golf 8 R-Line',
      year: 2022,
      price: 33500,
      mileage: 28000,
      fuel: 'Essence',
      transmission: 'Automatique',
      color: 'Blanc Pur',
      description: 'Élégance et performance. Toit ouvrant, cockpit digital, full options.',
      images: ['https://picsum.photos/seed/golf8/800/600'],
      featured: false,
      status: 'available',
    },
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.create({
      data: vehicle,
    });
  }

  console.log('Seed finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
