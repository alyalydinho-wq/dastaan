import React from 'react';
import { Link } from 'react-router-dom';

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
  featured?: boolean;
  color?: string;
  createdAt?: string;
  financingAvailable?: boolean;
  views?: number;
}

interface VehicleListItemProps {
  vehicle: Vehicle;
}

export default function VehicleListItem({ vehicle }: VehicleListItemProps) {
  
  const getStatusBadge = () => {
    switch (vehicle.status) {
      case 'available':
        return <span className="bg-[#16a34a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">Disponible</span>;
      case 'reserved':
        return <span className="bg-[#ea580c] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">Réservé</span>;
      case 'sold':
        return <span className="bg-[#6b7280] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">Vendu</span>;
      default:
        return null;
    }
  };

  const isRecent = vehicle.createdAt && (new Date().getTime() - new Date(vehicle.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
  const hasFinancing = vehicle.financingAvailable;
  const viewCount = vehicle.views || Math.floor(Math.random() * 80) + 30; // Mock views if not present
  const isHot = viewCount > 50;

  return (
    <div className="bg-[#000075] rounded-xl border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/30 hover:bg-[#000090] group flex flex-col sm:flex-row">
      
      {/* Photo (Fixed width on desktop) */}
      <div className="relative w-full sm:w-[240px] shrink-0 h-[160px] sm:h-auto bg-[#000045]">
        <img 
          src={vehicle.images[0] || `https://picsum.photos/seed/${vehicle.brand}${vehicle.model}/800/450`} 
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 items-start">
          {getStatusBadge()}
          {isRecent && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1">
              ✨ Nouveau
            </span>
          )}
          {hasFinancing && (
            <span className="bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1">
              💶 Financement
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {vehicle.featured && (
            <div className="bg-[#E02000] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span>⭐</span> Coup de cœur
            </div>
          )}
          {isHot && (
            <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span>🔥</span> Très demandé
            </div>
          )}
        </div>
      </div>

      {/* Info Center */}
      <div className="p-4 flex-grow flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/10">
        <h3 className="text-white font-bold text-lg leading-tight mb-2">
          {vehicle.brand} {vehicle.model} <span className="text-white/60 font-normal">({vehicle.year})</span>
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">
            Très bon état
          </span>
          <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">
            {vehicle.fuel}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/60">
          <div className="flex items-center gap-1.5">
            <span>👁️</span> {viewCount} vues
          </div>
          <div className="flex items-center gap-1.5">
            <span>📍</span> {vehicle.mileage.toLocaleString('fr-FR')} km
          </div>
          <div className="flex items-center gap-1.5">
            <span>⚙️</span> {vehicle.transmission}
          </div>
          <div className="flex items-center gap-1.5">
            <span>🎨</span> {vehicle.color || 'Non spécifié'}
          </div>
        </div>
      </div>

      {/* Price & Actions Right */}
      <div className="p-4 sm:w-[200px] shrink-0 flex flex-col justify-center bg-white/5">
        <div className="mb-4 text-center sm:text-left">
          <p className="text-[10px] text-white/60 uppercase tracking-wider mb-0.5">Prix de vente</p>
          <p className="text-white font-bold text-2xl">
            {vehicle.price.toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link 
            to={`/vehicules/${vehicle.id}`}
            className="w-full flex items-center justify-center text-xs font-medium text-white bg-transparent border border-white/30 rounded-lg py-2.5 hover:bg-white/10 transition-colors"
          >
            Voir le détail
          </Link>
          <a 
            href={`/#contact`}
            className="w-full flex items-center justify-center text-xs font-medium text-white bg-[#E02000] rounded-lg py-2.5 hover:bg-red-700 transition-colors"
          >
            Demander un RDV
          </a>
        </div>
      </div>

    </div>
  );
}
