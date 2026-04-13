import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import AppointmentForm from '../vehicles/AppointmentForm';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  price: number;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export default function AppointmentModal({ isOpen, onClose, vehicle }: AppointmentModalProps) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-tbm-blue rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          <AppointmentForm vehicle={vehicle} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
