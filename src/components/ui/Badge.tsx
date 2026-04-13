import React from 'react';

interface BadgeProps {
  status: 'available' | 'reserved' | 'sold' | string;
  className?: string;
}

/**
 * Composant Badge pour le statut des véhicules
 */
export default function Badge({ status, className = '' }: BadgeProps) {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'disponible':
        return { text: 'Disponible', classes: 'bg-green-100 text-green-800 border-green-200' };
      case 'reserved':
      case 'réservé':
        return { text: 'Réservé', classes: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'sold':
      case 'vendu':
        return { text: 'Vendu', classes: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { text: status, classes: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${config.classes} ${className}`}>
      {config.text}
    </span>
  );
}
