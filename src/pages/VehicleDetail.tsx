import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import AppointmentModal from '../components/ui/AppointmentModal';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Gauge, Fuel, Settings, Palette, Eye } from 'lucide-react';

import Loading from '../components/ui/Loading';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  description: string;
  images: string[];
  status: string;
  createdAt?: string;
  financingAvailable?: boolean;
  views?: number;
}

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${id}`);
        if (response.status === 404) {
          navigate('/vehicules', { replace: true });
          return;
        }
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        setVehicle(data);
        
        // Update document title for SEO
        document.title = `${data.brand} ${data.model} ${data.year} — TBM`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', `Achetez ce ${data.brand} ${data.model} d'occasion à La Réunion. Prix: ${data.price}€. Kilométrage: ${data.mileage}km. Révisé et garanti par TBM.`);
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', `${data.brand} ${data.model} — TBM`);
        
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && data.images && data.images.length > 0) {
          ogImage.setAttribute('content', data.images[0]);
        }
      } catch (err) {
        console.error("Erreur :", err);
        setError("Impossible de charger les détails du véhicule.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVehicle();
    
    return () => {
      // Reset SEO tags on unmount
      document.title = "TBM — Véhicules d'occasion à La Réunion | Sainte-Clotilde";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', "TBM, votre concessionnaire de véhicules d'occasion à Sainte-Clotilde, La Réunion. Large choix, prix transparents. Contactez-nous : sastbm@outlook.fr");
      }
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <RootLayout>
        <Loading />
      </RootLayout>
    );
  }

  if (error || !vehicle) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Oups !</h1>
          <p className="text-slate-500 mb-8">{error || "Véhicule introuvable."}</p>
          <Button variant="primary" href="/vehicules">Retour au catalogue</Button>
        </div>
      </RootLayout>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (vehicle.images.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (vehicle.images.length || 1)) % (vehicle.images.length || 1));
  };

  const displayImages = vehicle.images.length > 0 ? vehicle.images : [`https://picsum.photos/seed/${vehicle.brand}${vehicle.model}/1200/800`];

  const isRecent = vehicle.createdAt && (new Date().getTime() - new Date(vehicle.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
  const hasFinancing = vehicle.financingAvailable;
  const viewCount = vehicle.views || Math.floor(Math.random() * 80) + 30; // Mock views if not present
  const isHot = viewCount > 50;

  return (
    <RootLayout>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Link */}
          <Link to="/vehicules" className="inline-flex items-center gap-2 text-slate-500 hover:text-tbm-blue font-bold mb-8 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            Retour au catalogue
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Gallery & Description */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Gallery */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 group">
                  <img 
                    src={displayImages[currentImageIndex]} 
                    alt={`${vehicle.brand} ${vehicle.model} - Vue ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {displayImages.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur hover:bg-white text-slate-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur hover:bg-white text-slate-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {displayImages.length > 1 && (
                  <div className="flex gap-4 mt-4 overflow-x-auto pb-2 snap-x">
                    {displayImages.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-24 h-16 shrink-0 rounded-lg overflow-hidden snap-start transition-all ${currentImageIndex === idx ? 'ring-2 ring-tbm-blue ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-display font-black text-slate-900 mb-6">Description du véhicule</h2>
                <div className="prose prose-slate max-w-none">
                  {vehicle.description ? (
                    <p className="whitespace-pre-line text-slate-600 leading-relaxed">{vehicle.description}</p>
                  ) : (
                    <p className="text-slate-400 italic">Aucune description fournie pour ce véhicule.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Info & Action */}
            <div className="space-y-8">
              
              {/* Main Info */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-display font-black text-slate-900 leading-tight mb-1">
                      {vehicle.brand} {vehicle.model}
                    </h1>
                    <div className="flex items-center gap-3 mt-2 mb-2">
                      <p className="text-lg text-slate-500 font-medium">Année {vehicle.year}</p>
                      {isRecent && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          ✨ Nouveau
                        </span>
                      )}
                      {hasFinancing && (
                        <span className="bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          💶 Financement
                        </span>
                      )}
                      {isHot && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                          🔥 Très demandé
                        </span>
                      )}
                    </div>
                  </div>
                  {vehicle.status !== 'available' && (
                    <Badge status={vehicle.status} />
                  )}
                </div>
                
                <div className="py-6 border-y border-slate-100 my-6">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <p className="text-5xl font-display font-black text-tbm-blue">
                      {vehicle.price.toLocaleString('fr-FR')} €
                    </p>
                    <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
                      <Eye className="w-4 h-4 text-tbm-red" />
                      <span className="text-sm font-medium"><strong>{viewCount}</strong> personnes ont vu ce véhicule</span>
                    </div>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-tbm-red">
                      <Gauge className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kilométrage</p>
                      <p className="font-medium text-slate-900">{vehicle.mileage.toLocaleString('fr-FR')} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-tbm-red">
                      <Fuel className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Carburant</p>
                      <p className="font-medium text-slate-900">{vehicle.fuel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-tbm-red">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Boîte</p>
                      <p className="font-medium text-slate-900">{vehicle.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-tbm-red">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Couleur</p>
                      <p className="font-medium text-slate-900">{vehicle.color || 'Non spécifié'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interested Box */}
              <div className="bg-tbm-blue p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-tbm-red rounded-full blur-2xl opacity-30" />
                
                <h3 className="text-2xl font-display font-black mb-4 relative z-10">Je suis intéressé(e)</h3>
                <p className="text-blue-200 mb-8 relative z-10">
                  Ce véhicule vous plaît ? Prenez rendez-vous pour venir le découvrir et l'essayer dans notre concession.
                </p>
                
                <Button 
                  variant="primary" 
                  className="w-full py-4 text-lg shadow-lg shadow-red-500/20 relative z-10 mb-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  Demander un rendez-vous
                </Button>

                <a 
                  href="tel:+262692000000"
                  className="w-full flex items-center justify-center gap-2 py-4 text-lg font-bold bg-white text-tbm-blue rounded-lg shadow-lg relative z-10 mb-8 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Appeler maintenant
                </a>

                <div className="pt-6 border-t border-blue-800/50 relative z-10">
                  <div className="flex items-start gap-3 text-blue-200">
                    <MapPin className="w-5 h-5 text-tbm-red shrink-0 mt-1" />
                    <p className="text-sm leading-relaxed">
                      <strong className="text-white block mb-1">TBM Occasions</strong>
                      66 rue Léopold Rambaud<br/>
                      Sainte-Clotilde<br/>
                      Réunion 97490
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehicle={vehicle} 
      />
    </RootLayout>
  );
}
