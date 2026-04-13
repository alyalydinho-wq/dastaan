import prisma from './prisma';

// --- STATEFUL MOCK DATA ---
// This allows the app to work and save changes in memory when no database is connected.
let mockVehicles = [
  {
    id: 'mock-1',
    brand: 'Toyota',
    model: 'Hilux Invincible',
    year: 2022,
    price: 42500,
    mileage: 35000,
    fuel: 'Diesel',
    transmission: 'Automatique',
    color: 'Gris Anthracite',
    description: 'Parfait pour les routes de La Réunion. État irréprochable.',
    images: ['https://picsum.photos/seed/hilux1/800/600'],
    featured: true,
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-2',
    brand: 'Peugeot',
    model: '3008 GT Pack',
    year: 2021,
    price: 29900,
    mileage: 42000,
    fuel: 'Hybride',
    transmission: 'Automatique',
    color: 'Bleu Célèbes',
    description: 'SUV confortable et économique.',
    images: ['https://picsum.photos/seed/3008_1/800/600'],
    featured: true,
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-3',
    brand: 'Renault',
    model: 'Clio V RS Line',
    year: 2023,
    price: 19800,
    mileage: 12500,
    fuel: 'Essence',
    transmission: 'Manuelle',
    color: 'Rouge Flamme',
    description: 'Citadine sportive et moderne.',
    images: ['https://picsum.photos/seed/clio5/800/600'],
    featured: true,
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockAppointments = [
  {
    id: 'mock-app-1',
    clientName: 'Jean Dupont',
    clientPhone: '0692 12 34 56',
    clientEmail: 'jean@dupont.re',
    message: 'Je voudrais voir ce véhicule samedi matin.',
    status: 'pending',
    createdAt: new Date(),
    vehicleId: 'mock-1',
    vehicle: { id: 'mock-1', brand: 'Toyota', model: 'Hilux Invincible' }
  },
  {
    id: 'mock-app-2',
    clientName: 'Marie Martin',
    clientPhone: '0693 98 76 54',
    clientEmail: 'marie.m@email.com',
    message: '',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000),
    vehicleId: 'mock-2',
    vehicle: { id: 'mock-2', brand: 'Peugeot', model: '3008 GT Pack' }
  }
];

/**
 * Filtres pour la recherche de véhicules
 */
export interface VehicleFilters {
  brand?: string;
  model?: string;
  type?: string;
  transmission?: string;
  color?: string;
  fuel?: string | string[];
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  yearMin?: number;
  yearMax?: number;
  status?: string;
}

/**
 * Récupère la liste des véhicules avec filtres optionnels
 */
export async function getVehicles(filters?: VehicleFilters) {
  try {
    if (!process.env.DATABASE_URL) {
      let filtered = [...mockVehicles];
      if (filters?.brand) filtered = filtered.filter(v => v.brand.toLowerCase().includes(filters.brand!.toLowerCase()));
      if (filters?.model) filtered = filtered.filter(v => v.model.toLowerCase().includes(filters.model!.toLowerCase()));
      if (filters?.transmission) filtered = filtered.filter(v => v.transmission.toLowerCase() === filters.transmission!.toLowerCase());
      if (filters?.color) filtered = filtered.filter(v => v.color?.toLowerCase() === filters.color!.toLowerCase());
      
      if (filters?.fuel) {
        if (Array.isArray(filters.fuel)) {
          filtered = filtered.filter(v => filters.fuel!.includes(v.fuel));
        } else {
          filtered = filtered.filter(v => v.fuel === filters.fuel);
        }
      }
      
      if (filters?.status) filtered = filtered.filter(v => v.status === filters.status);
      if (filters?.priceMin) filtered = filtered.filter(v => v.price >= filters.priceMin!);
      if (filters?.priceMax) filtered = filtered.filter(v => v.price <= filters.priceMax!);
      if (filters?.mileageMax) filtered = filtered.filter(v => v.mileage <= filters.mileageMax!);
      if (filters?.yearMin) filtered = filtered.filter(v => v.year >= filters.yearMin!);
      if (filters?.yearMax) filtered = filtered.filter(v => v.year <= filters.yearMax!);
      
      return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    const where: any = {};

    if (filters?.brand) {
      where.brand = { contains: filters.brand, mode: 'insensitive' };
    }
    if (filters?.model) {
      where.model = { contains: filters.model, mode: 'insensitive' };
    }
    if (filters?.transmission) {
      where.transmission = { equals: filters.transmission, mode: 'insensitive' };
    }
    if (filters?.color) {
      where.color = { equals: filters.color, mode: 'insensitive' };
    }
    if (filters?.fuel) {
      if (Array.isArray(filters.fuel)) {
        where.fuel = { in: filters.fuel };
      } else {
        where.fuel = filters.fuel;
      }
    }
    if (filters?.priceMin || filters?.priceMax) {
      where.price = {
        gte: filters.priceMin ?? 0,
        lte: filters.priceMax ?? 999999999,
      };
    }
    if (filters?.mileageMax) {
      where.mileage = { lte: filters.mileageMax };
    }
    if (filters?.yearMin || filters?.yearMax) {
      where.year = {
        gte: filters.yearMin ?? 0,
        lte: filters.yearMax ?? 9999,
      };
    }
    if (filters?.status) {
      where.status = filters.status;
    }

    return await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return getMockVehicles();
  }
}

/**
 * Récupère un véhicule par son ID
 */
export async function getVehicleById(id: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return mockVehicles.find(v => v.id === id) || null;
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { appointments: true },
    });
    return vehicle || getMockVehicles()[0];
  } catch (error) {
    console.error(`Error fetching vehicle ${id}:`, error);
    return getMockVehicles().find(v => v.id === id) || getMockVehicles()[0];
  }
}

/**
 * Récupère les véhicules mis en avant
 */
export async function getFeaturedVehicles() {
  try {
    // Fallback to mock data if DATABASE_URL is not configured
    if (!process.env.DATABASE_URL) {
      const featured = mockVehicles.filter(v => v.featured && v.status === 'available');
      if (featured.length >= 6) {
        return featured.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 6);
      }
      const others = mockVehicles.filter(v => !v.featured && v.status === 'available');
      return [...featured, ...others].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 6);
    }

    const featured = await prisma.vehicle.findMany({
      where: { featured: true, status: 'available' },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    if (featured.length < 6) {
      const recent = await prisma.vehicle.findMany({
        where: { 
          status: 'available',
          id: { notIn: featured.map(v => v.id) }
        },
        take: 6 - featured.length,
        orderBy: { createdAt: 'desc' },
      });
      return [...featured, ...recent];
    }

    return featured;
  } catch (error) {
    console.error('Error fetching featured vehicles:', error);
    // Return mock data instead of crashing the UI
    return [];
  }
}

// Helper function to provide mock data when DB is unavailable
function getMockVehicles() {
  return [
    {
      id: 'mock-1',
      brand: 'Toyota',
      model: 'Hilux Invincible',
      year: 2022,
      price: 42500,
      mileage: 35000,
      fuel: 'Diesel',
      transmission: 'Automatique',
      color: 'Gris Anthracite',
      description: 'Parfait pour les routes de La Réunion. État irréprochable.',
      images: ['https://picsum.photos/seed/hilux1/800/600'],
      featured: true,
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'mock-2',
      brand: 'Peugeot',
      model: '3008 GT Pack',
      year: 2021,
      price: 29900,
      mileage: 42000,
      fuel: 'Hybride',
      transmission: 'Automatique',
      color: 'Bleu Célèbes',
      description: 'SUV confortable et économique.',
      images: ['https://picsum.photos/seed/3008_1/800/600'],
      featured: true,
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'mock-3',
      brand: 'Renault',
      model: 'Clio V RS Line',
      year: 2023,
      price: 19800,
      mileage: 12500,
      fuel: 'Essence',
      transmission: 'Manuelle',
      color: 'Rouge Flamme',
      description: 'Citadine sportive et moderne.',
      images: ['https://picsum.photos/seed/clio5/800/600'],
      featured: true,
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
}

/**
 * Crée un nouveau véhicule
 */
export async function createVehicle(data: any) {
  try {
    if (!process.env.DATABASE_URL) {
      const newVehicle = {
        id: 'mock-vehicle-' + Date.now(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockVehicles.push(newVehicle);
      return newVehicle;
    }

    return await prisma.vehicle.create({
      data,
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw new Error('Erreur lors de la création du véhicule');
  }
}

/**
 * Met à jour un véhicule existant
 */
export async function updateVehicle(id: string, data: any) {
  try {
    if (!process.env.DATABASE_URL) {
      const index = mockVehicles.findIndex(v => v.id === id);
      if (index !== -1) {
        mockVehicles[index] = { ...mockVehicles[index], ...data, updatedAt: new Date() };
        return mockVehicles[index];
      }
      throw new Error('Vehicle not found');
    }

    return await prisma.vehicle.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(`Error updating vehicle ${id}:`, error);
    throw new Error('Erreur lors de la mise à jour du véhicule');
  }
}

/**
 * Supprime un véhicule
 */
export async function deleteVehicle(id: string) {
  try {
    if (!process.env.DATABASE_URL) {
      mockVehicles = mockVehicles.filter(v => v.id !== id);
      return { id };
    }

    return await prisma.vehicle.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting vehicle ${id}:`, error);
    throw new Error('Erreur lors de la suppression du véhicule');
  }
}

/**
 * Crée une demande de rendez-vous
 */
export async function createAppointment(data: {
  vehicleId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message?: string;
}) {
  try {
    if (!process.env.DATABASE_URL) {
      const vehicle = mockVehicles.find(v => v.id === data.vehicleId);
      const newApp = {
        id: 'mock-appointment-' + Date.now(),
        ...data,
        status: 'pending',
        createdAt: new Date(),
        vehicle: vehicle ? { id: vehicle.id, brand: vehicle.brand, model: vehicle.model } : undefined
      };
      mockAppointments.push(newApp);
      return newApp;
    }

    return await prisma.appointment.create({
      data,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error('Erreur lors de la création du rendez-vous');
  }
}

/**
 * Récupère tous les rendez-vous
 */
export async function getAppointments() {
  try {
    if (!process.env.DATABASE_URL) {
      return [...mockAppointments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          select: { id: true, brand: true, model: true }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('Erreur lors de la récupération des rendez-vous');
  }
}

/**
 * Met à jour le statut d'un rendez-vous
 */
export async function updateAppointmentStatus(id: string, status: string) {
  try {
    if (!process.env.DATABASE_URL) {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAppointments[index].status = status;
        return mockAppointments[index];
      }
      return { id, status };
    }
    return await prisma.appointment.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    console.error(`Error updating appointment ${id}:`, error);
    throw new Error('Erreur lors de la mise à jour du statut du rendez-vous');
  }
}

/**
 * Supprime un rendez-vous
 */
export async function deleteAppointment(id: string) {
  try {
    if (!process.env.DATABASE_URL) {
      mockAppointments = mockAppointments.filter(a => a.id !== id);
      return { id };
    }
    return await prisma.appointment.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting appointment ${id}:`, error);
    throw new Error('Erreur lors de la suppression du rendez-vous');
  }
}

/**
 * Récupère le nombre de rendez-vous en attente
 */
export async function getPendingAppointmentsCount() {
  try {
    if (!process.env.DATABASE_URL) {
      return mockAppointments.filter(a => a.status === 'pending').length;
    }
    return await prisma.appointment.count({
      where: { status: 'pending' }
    });
  } catch (error) {
    console.error('Error counting pending appointments:', error);
    return 0;
  }
}

/**
 * Récupère les statistiques pour le tableau de bord Admin
 */
export async function getDashboardStats() {
  try {
    if (!process.env.DATABASE_URL) {
      return {
        availableVehicles: mockVehicles.filter(v => v.status === 'available').length,
        soldVehicles: mockVehicles.filter(v => v.status === 'sold').length,
        pendingAppointments: mockAppointments.filter(a => a.status === 'pending').length,
        monthlyAppointments: mockAppointments.length,
        recentAppointments: [...mockAppointments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5),
        recentVehicles: [...mockVehicles].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)
      };
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      availableVehicles,
      soldVehicles,
      pendingAppointments,
      monthlyAppointments,
      recentAppointments,
      recentVehicles
    ] = await Promise.all([
      prisma.vehicle.count({ where: { status: 'available' } }),
      prisma.vehicle.count({ where: { status: 'sold' } }),
      prisma.appointment.count({ where: { status: 'pending' } }),
      prisma.appointment.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { vehicle: { select: { brand: true, model: true } } }
      }),
      prisma.vehicle.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, brand: true, model: true, price: true, status: true, images: true }
      })
    ]);

    return {
      availableVehicles,
      soldVehicles,
      pendingAppointments,
      monthlyAppointments,
      recentAppointments,
      recentVehicles
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Impossible de récupérer les statistiques du tableau de bord');
  }
}
