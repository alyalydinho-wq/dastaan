import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../ui/Button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// Regex pour accepter les numéros français (métropole) et réunionnais (0692, 0693, 0262)
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$|^(?:(?:\+|00)262|0)[26]9[23][\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/;

const formSchema = z.object({
  clientName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  clientEmail: z.string().email("Format d'email invalide"),
  clientPhone: z.string().regex(phoneRegex, "Format de téléphone invalide (ex: 0692 12 34 56)"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  price: number;
}

interface AppointmentFormProps {
  vehicle: Vehicle;
  onSuccess?: () => void;
}

export default function AppointmentForm({ vehicle, onSuccess }: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          vehicleId: vehicle.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue');
      }

      setSubmitStatus('success');
      if (onSuccess) {
        setTimeout(onSuccess, 3000); // Ferme la modale après 3s
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-tbm-blue p-8 rounded-3xl text-center text-white">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-display font-black mb-4">Demande envoyée !</h3>
        <p className="text-blue-200">
          Votre demande a bien été envoyée ! L'équipe TBM vous contactera sous 24h pour confirmer votre rendez-vous.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-tbm-blue p-8 rounded-3xl text-white">
      <h3 className="text-2xl font-display font-black mb-6">Demander un rendez-vous</h3>
      
      {/* Véhicule pré-sélectionné (Lecture seule) */}
      <div className="bg-blue-900/50 p-4 rounded-xl mb-6 border border-blue-800">
        <p className="text-sm text-blue-300 font-bold uppercase tracking-wider mb-1">Véhicule sélectionné</p>
        <p className="font-medium text-lg">{vehicle.brand} {vehicle.model}</p>
        <p className="text-tbm-red font-black">{vehicle.price.toLocaleString('fr-FR')} €</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-blue-200 mb-2">Prénom et Nom *</label>
          <input
            {...register('clientName')}
            className="w-full px-4 py-3 bg-white/10 border border-blue-800 rounded-xl text-white placeholder-blue-400 focus:ring-2 focus:ring-tbm-red outline-none transition-all"
            placeholder="Jean Dupont"
          />
          {errors.clientName && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.clientName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-blue-200 mb-2">Email *</label>
          <input
            {...register('clientEmail')}
            type="email"
            className="w-full px-4 py-3 bg-white/10 border border-blue-800 rounded-xl text-white placeholder-blue-400 focus:ring-2 focus:ring-tbm-red outline-none transition-all"
            placeholder="jean.dupont@email.com"
          />
          {errors.clientEmail && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.clientEmail.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-blue-200 mb-2">Téléphone *</label>
          <input
            {...register('clientPhone')}
            type="tel"
            className="w-full px-4 py-3 bg-white/10 border border-blue-800 rounded-xl text-white placeholder-blue-400 focus:ring-2 focus:ring-tbm-red outline-none transition-all"
            placeholder="0692 XX XX XX"
          />
          {errors.clientPhone && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.clientPhone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-blue-200 mb-2">Message (Optionnel)</label>
          <textarea
            {...register('message')}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-blue-800 rounded-xl text-white placeholder-blue-400 focus:ring-2 focus:ring-tbm-red outline-none transition-all resize-none"
            placeholder="Précisez votre demande (disponibilités, questions...)"
          />
        </div>

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full py-4 text-lg shadow-lg shadow-red-500/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Envoi en cours...
            </>
          ) : (
            'Envoyer ma demande'
          )}
        </Button>
      </form>
    </div>
  );
}
