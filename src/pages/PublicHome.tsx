import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import RootLayout from '../components/layout/RootLayout';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import VehicleCard from '../components/vehicles/VehicleCard';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { url: string };
    }
  }
}

// --- Types ---
interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  images: string[];
  status: string;
  createdAt?: string;
  financingAvailable?: boolean;
  views?: number;
}

export default function PublicHome() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles/featured');
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        console.error("Erreur de chargement des véhicules :", err);
        setError("Impossible de charger les véhicules pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  // Handle hash scrolling on mount or hash change
  useEffect(() => {
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <RootLayout>
      {/* 1. Hero Section */}
      <header className="relative bg-tbm-blue py-24 md:py-32 overflow-hidden min-h-[600px] flex items-center">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0">
          <spline-viewer url="https://prod.spline.design/PZ2enhIZ1QPFlH3A/scene.splinecode"></spline-viewer>
        </div>
        
        {/* Overlay to ensure text readability over the 3D scene */}
        <div className="absolute inset-0 bg-tbm-blue/40 z-0 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl pointer-events-auto"
          >
            <h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight text-left italic"
              style={{ fontFamily: 'Verdana', borderColor: '#f8f3f3', borderStyle: 'outset' }}
            >
              Votre partenaire auto de confiance à La Réunion
            </h1>
            <p 
              className="text-blue-100 mb-10 font-bold italic text-[20px] leading-[31px] ml-0"
              style={{ fontFamily: 'Verdana' }}
            >
              TBM — Véhicules d'occasion sélectionnés avec soin
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" href="/vehicules" className="text-lg px-8 py-4" style={{ fontFamily: 'Verdana', fontWeight: 'bold' }}>
                Voir nos véhicules
              </Button>
              <Button variant="outline" href="#contact" className="text-lg px-8 py-4 bg-white/5 text-white border-white/30 hover:bg-white hover:text-tbm-blue" style={{ fontFamily: 'Verdana', fontWeight: 'bold' }}>
                Nous contacter
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. Véhicules en vedette */}
      <section id="vehicles" className="py-24 bg-tbm-blue relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle 
            title="Nos véhicules disponibles" 
            centered={true}
            theme="dark"
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-100 rounded-2xl h-[400px] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-tbm-red font-medium bg-red-50 rounded-2xl mt-12">
              {error}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium bg-slate-50 rounded-2xl mt-12">
              Aucun véhicule disponible pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {vehicles.map(vehicle => (
                <div key={vehicle.id}>
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Button variant="outline" href="/vehicules" className="px-10 bg-white text-tbm-red border-white hover:bg-slate-50 hover:text-tbm-red shadow-lg" style={{ fontFamily: 'Verdana', fontWeight: 'bold' }}>
              Voir tous les véhicules
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Section Avantages TBM */}
      <section id="about" className="py-24 bg-tbm-blue border-y border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Avantage 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl shadow-sm flex items-center justify-center text-white mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Verdana', fontStyle: 'italic' }}>Véhicules contrôlés</h3>
              <p className="text-blue-100 leading-relaxed">
                Chaque véhicule passe par une inspection rigoureuse de 110 points de contrôle avant d'être mis en vente.
              </p>
            </div>

            {/* Avantage 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl shadow-sm flex items-center justify-center text-white mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Verdana', fontStyle: 'italic' }}>Prix transparent</h3>
              <p className="text-blue-100 leading-relaxed">
                Pas de frais cachés. Nos prix sont étudiés pour être les plus justes du marché réunionnais.
              </p>
            </div>

            {/* Avantage 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl shadow-sm flex items-center justify-center text-white mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Verdana', fontStyle: 'italic' }}>Service client local</h3>
              <p className="text-blue-100 leading-relaxed">
                Une équipe dédiée à La Réunion pour vous accompagner avant, pendant et après votre achat.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Section Contact rapide */}
      <section id="contact" className="py-24 text-white relative overflow-hidden border-b border-tbm-red">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        />
        {/* Dark/Blue Overlay */}
        <div className="absolute inset-0 bg-tbm-blue/50 z-0 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-tbm-blue/90 via-tbm-blue/40 to-transparent z-0" />
        
        {/* Decorative circle */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-tbm-red rounded-full blur-3xl opacity-40 z-0" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-6">
            Vous avez trouvé votre véhicule ?
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto" style={{ fontFamily: 'Verdana', fontWeight: 'bold', fontStyle: 'italic' }}>
            N'attendez plus, contactez-nous pour réserver un essai ou obtenir plus d'informations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-tbm-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-lg font-medium">Sainte-Clotilde, La Réunion</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-blue-400" />
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-tbm-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:sastbm@outlook.fr" className="text-lg font-medium hover:text-tbm-red transition-colors">
                sastbm@outlook.fr
              </a>
            </div>
          </div>

          <Button variant="primary" href="mailto:sastbm@outlook.fr" className="text-lg px-10 py-4 shadow-xl shadow-red-500/20" style={{ fontFamily: 'Verdana', fontWeight: 'bold', fontStyle: 'italic' }}>
            Prendre rendez-vous
          </Button>
        </div>
      </section>

      {/* 5. Section Avis Clients */}
      <section className="py-24 relative border-b-[6px] border-tbm-red">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2000&q=80")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-tbm-blue/90 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle 
            title="Ce que pensent nos clients" 
            centered={true}
            theme="dark"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Review 1 */}
            <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 relative hover:-translate-y-1 transition-transform duration-300">
              <div className="flex gap-1 mb-6 text-yellow-400">
                {'★★★★★'.split('').map((star, i) => <span key={i} className="text-2xl">{star}</span>)}
              </div>
              <p className="text-slate-600 italic mb-8 leading-relaxed text-lg">
                "Super expérience ! L'équipe de TBM a été très professionnelle et m'a aidé à trouver la voiture parfaite. Je recommande vivement."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tbm-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                  J
                </div>
                <div>
                  <p className="font-bold text-slate-900">Jean D.</p>
                  <p className="text-sm text-slate-500">Acheteur vérifié</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 relative hover:-translate-y-1 transition-transform duration-300">
              <div className="flex gap-1 mb-6 text-yellow-400">
                {'★★★★★'.split('').map((star, i) => <span key={i} className="text-2xl">{star}</span>)}
              </div>
              <p className="text-slate-600 italic mb-8 leading-relaxed text-lg">
                "Véhicule impeccable, conforme à l'annonce. Le processus d'achat a été rapide et transparent. Merci pour votre sérieux !"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tbm-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                  M
                </div>
                <div>
                  <p className="font-bold text-slate-900">Marie L.</p>
                  <p className="text-sm text-slate-500">Acheteur vérifié</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 relative hover:-translate-y-1 transition-transform duration-300">
              <div className="flex gap-1 mb-6 text-yellow-400">
                {'★★★★★'.split('').map((star, i) => <span key={i} className="text-2xl">{star}</span>)}
              </div>
              <p className="text-slate-600 italic mb-8 leading-relaxed text-lg">
                "Très bon accueil et conseils avisés. On sent qu'ils connaissent leur métier. Je suis ravi de mon achat et du suivi proposé."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tbm-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                  P
                </div>
                <div>
                  <p className="font-bold text-slate-900">Paul R.</p>
                  <p className="text-sm text-slate-500">Acheteur vérifié</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
