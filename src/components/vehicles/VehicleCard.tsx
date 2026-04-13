import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

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

interface VehicleCardProps {
  vehicle: Vehicle;
}

/**
 * Composant d'affichage d'un véhicule sous forme de carte
 */
export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const isRecent = vehicle.createdAt && (new Date().getTime() - new Date(vehicle.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
  const hasFinancing = vehicle.financingAvailable;
  const viewCount = vehicle.views || Math.floor(Math.random() * 80) + 30; // Mock views if not present
  const isHot = viewCount > 50;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col h-full">
      {/* Image Section (16/9) */}
      <div className="relative aspect-video overflow-hidden bg-slate-200">
        <img 
          src={vehicle.images[0] || `https://picsum.photos/seed/${vehicle.brand}${vehicle.model}/800/450`} 
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          <span className="bg-white/95 backdrop-blur-sm text-tbm-blue px-3 py-1.5 rounded-lg text-sm font-black shadow-sm">
            {vehicle.year}
          </span>
          {vehicle.status !== 'available' && (
            <Badge status={vehicle.status} className="shadow-sm" />
          )}
          {isRecent && (
            <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
              ✨ Nouveau
            </span>
          )}
          {hasFinancing && (
            <span className="bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
              💶 Financement
            </span>
          )}
          {isHot && (
            <span className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
              🔥 Très demandé
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            {vehicle.brand} <span className="font-medium text-slate-700">{vehicle.model}</span>
          </h3>
          <p className="text-2xl font-display font-black text-tbm-blue whitespace-nowrap">
            {vehicle.price.toLocaleString('fr-FR')} €
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 text-sm text-slate-600 font-medium mt-auto">
          {/* Kilométrage */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-tbm-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {vehicle.mileage.toLocaleString('fr-FR')} km
          </div>
          
          {/* Carburant */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-tbm-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            {vehicle.fuel}
          </div>
          
          {/* Transmission */}
          <div className="flex items-center gap-2 col-span-2">
            <svg className="w-4 h-4 text-tbm-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {vehicle.transmission}
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/vehicules/${vehicle.id}`}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-tbm-red hover:bg-tbm-red hover:text-white transition-all group-hover:border-tbm-red"
        >
          Voir le détail
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
