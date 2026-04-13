import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- MIDDLEWARE ---

const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Accès non autorisé' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Session expirée' });
  }
};

// --- API ROUTES ---

// Seed Database (for easy Vercel setup)
app.get('/api/seed', async (req, res) => {
  try {
    await prisma.appointment.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.admin.deleteMany();

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: {
        email: 'admin@tbm.re',
        password: hashedPassword,
      },
    });

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
      }
    ];

    for (const vehicle of vehicles) {
      await prisma.vehicle.create({ data: vehicle });
    }

    res.json({ message: 'Base de données initialisée avec succès ! Vous pouvez retourner sur l\'accueil de votre site.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'initialisation de la base de données' });
  }
});

// Vehicles: Get All with Filters
import { getVehicles, getFeaturedVehicles, getVehicleById } from './src/lib/db';

app.get('/api/vehicles', async (req, res) => {
  try {
    const filters = {
      brand: req.query.brand as string,
      model: req.query.model as string,
      type: req.query.type as string,
      transmission: req.query.transmission as string,
      color: req.query.couleur as string,
      fuel: req.query.carburant as string | string[],
      priceMax: req.query.prixMax ? parseInt(req.query.prixMax as string) : undefined,
      mileageMax: req.query.kmMax ? parseInt(req.query.kmMax as string) : undefined,
      yearMin: req.query.anneeMin ? parseInt(req.query.anneeMin as string) : undefined,
      yearMax: req.query.anneeMax ? parseInt(req.query.anneeMax as string) : undefined,
    };
    const vehicles = await getVehicles(filters);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
  }
});

// Vehicles: Get Featured
app.get('/api/vehicles/featured', async (req, res) => {
  try {
    const vehicles = await getFeaturedVehicles();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules en vedette' });
  }
});

// Vehicles: Get by ID
app.get('/api/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du véhicule' });
  }
});

// Appointments: Create
import { z } from 'zod';
import { createAppointment, getDashboardStats } from './src/lib/db';
import nodemailer from 'nodemailer';

// Admin: Dashboard Stats
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    // In a real app, we would verify the JWT token here
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// Admin: Vehicles CRUD
import { createVehicle, updateVehicle, deleteVehicle } from './src/lib/db';

const vehicleSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().min(1990).max(2025),
  price: z.number().min(0),
  mileage: z.number().min(0),
  fuel: z.enum(['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL']),
  transmission: z.enum(['Manuelle', 'Automatique']),
  color: z.string().optional(),
  description: z.string().min(20),
  status: z.enum(['available', 'sold', 'reserved']),
  featured: z.boolean(),
  images: z.array(z.string()),
});

// Create Vehicle
app.post('/api/admin/vehicles', async (req, res) => {
  try {
    const data = vehicleSchema.parse(req.body);
    const vehicle = await createVehicle(data);
    res.json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Données invalides', details: error.flatten().fieldErrors });
    }
    res.status(500).json({ error: 'Erreur lors de la création du véhicule' });
  }
});

// Update Vehicle
app.put('/api/admin/vehicles/:id', async (req, res) => {
  try {
    const data = vehicleSchema.parse(req.body);
    const vehicle = await updateVehicle(req.params.id, data);
    res.json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Données invalides', details: error.flatten().fieldErrors });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour du véhicule' });
  }
});

// Delete Vehicle
app.delete('/api/admin/vehicles/:id', async (req, res) => {
  try {
    await deleteVehicle(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du véhicule' });
  }
});

// Admin: Appointments
import { getAppointments, deleteAppointment, getPendingAppointmentsCount, updateAppointmentStatus } from './src/lib/db';

app.get('/api/admin/appointments', async (req, res) => {
  try {
    const appointments = await getAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
  }
});

app.put('/api/admin/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'refused'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }
    const appointment = await updateAppointmentStatus(req.params.id, status);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

app.delete('/api/admin/appointments/:id', async (req, res) => {
  try {
    await deleteAppointment(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du rendez-vous' });
  }
});

app.get('/api/admin/appointments/pending-count', async (req, res) => {
  try {
    const count = await getPendingAppointmentsCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre de rendez-vous' });
  }
});

// SEO: Sitemap
app.get('/sitemap.xml', async (req, res) => {
  try {
    const vehicles = await getVehicles({ status: 'available' });
    const baseUrl = 'https://ais-dev-mocvuiasueenbezdcol7ih-54400705639.europe-west1.run.app';
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Static pages
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/vehicules</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    
    // Dynamic vehicle pages
    vehicles.forEach(v => {
      xml += `  <url>\n    <loc>${baseUrl}/vehicules/${v.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });
    
    xml += `</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

const appointmentSchema = z.object({
  vehicleId: z.string(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8),
  message: z.string().optional(),
});

// Contact: Send message
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    // In a real app, you would send an email here using Nodemailer, SendGrid, etc.
    console.log('New contact message received:', { name, email, phone, subject, message });
    
    // Simulate successful email sending
    res.status(200).json({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const data = appointmentSchema.parse(req.body);
    
    // Save to DB
    const appointment = await createAppointment(data);

    // Optional: Send Email Notification
    // We wrap this in a try/catch so it doesn't fail the request if SMTP is not configured
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Email to Admin
        await transporter.sendMail({
          from: `"TBM Occasions" <${process.env.SMTP_USER}>`,
          to: 'sastbm@outlook.fr',
          subject: `Nouvelle demande de rendez-vous - ${data.clientName}`,
          html: `
            <div style="font-family: sans-serif; color: #1a1a1a;">
              <h2 style="color: #0D1B8E;">Nouvelle demande de rendez-vous</h2>
              <p><strong>Client :</strong> ${data.clientName}</p>
              <p><strong>Email :</strong> ${data.clientEmail}</p>
              <p><strong>Téléphone :</strong> ${data.clientPhone}</p>
              <p><strong>ID Véhicule :</strong> ${data.vehicleId}</p>
              <p><strong>Message :</strong><br/>${data.message || 'Aucun message'}</p>
            </div>
          `
        });

        // Email to Client
        await transporter.sendMail({
          from: `"TBM Occasions" <${process.env.SMTP_USER}>`,
          to: data.clientEmail,
          subject: `Confirmation de votre demande de rendez-vous - TBM`,
          html: `
            <div style="font-family: sans-serif; color: #1a1a1a;">
              <h2 style="color: #0D1B8E;">Bonjour ${data.clientName},</h2>
              <p>Nous avons bien reçu votre demande de rendez-vous concernant l'un de nos véhicules.</p>
              <p>Notre équipe vous contactera sous 24h au <strong>${data.clientPhone}</strong> pour confirmer la date et l'heure de votre visite.</p>
              <br/>
              <p>À très bientôt,</p>
              <p><strong>L'équipe TBM Occasions</strong><br/>66 rue Léopold Rambaud, Sainte-Clotilde</p>
            </div>
          `
        });
      } else {
        console.log('SMTP not configured. Skipping email notifications.');
      }
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError);
      // We don't throw here to ensure the client still gets a success response for the DB creation
    }

    res.json({ success: true, message: "Votre demande a bien été envoyée ! TBM vous contactera sous 24h." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Données invalides', details: error.flatten().fieldErrors });
    }
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Erreur lors de la création du rendez-vous' });
  }
});

// Upload: Image to Cloudinary
import multer from 'multer';
import { uploadVehicleImage, deleteVehicleImage } from './src/lib/cloudinary';

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', authenticateAdmin, upload.single('image'), async (req: any, res: any) => {
  const { vehicleId } = req.body;
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' });
  if (!vehicleId) return res.status(400).json({ error: 'ID du véhicule manquant' });

  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const result = await uploadVehicleImage(dataURI, vehicleId);
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'upload' });
  }
});

// Delete: Image from Cloudinary
app.delete('/api/upload', authenticateAdmin, async (req: any, res: any) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ error: 'Public ID manquant' });

  try {
    await deleteVehicleImage(publicId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Auth: Login Admin
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!process.env.DATABASE_URL) {
      // Mock login fallback when no DB is configured
      if (email === 'admin@tbm.re' && password === 'admin123') {
        const token = jwt.sign({ id: 'mock-admin-id', email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return res.json({ token, admin: { id: 'mock-admin-id', email } });
      }
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: 'Identifiants invalides' });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(401).json({ error: 'Identifiants invalides' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
