import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AdminLayout from '../../components/layout/AdminLayout';
import ImageUploader from '../../components/admin/ImageUploader';
import { ChevronLeft, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const vehicleSchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.number().min(1990, "Année invalide").max(2025, "Année invalide"),
  price: z.number().min(0, "Le prix doit être positif"),
  mileage: z.number().min(0, "Le kilométrage doit être positif"),
  fuel: z.enum(['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL']),
  transmission: z.enum(['Manuelle', 'Automatique']),
  color: z.string().optional(),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  status: z.enum(['available', 'sold', 'reserved']),
  featured: z.boolean(),
  images: z.array(z.string()),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  token: string;
  onLogout: () => void;
}

export default function VehicleForm({ token, onLogout }: VehicleFormProps) {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuel: 'Essence',
      transmission: 'Manuelle',
      status: 'available',
      featured: false,
      images: [],
    }
  });

  useEffect(() => {
    document.title = isEditMode ? "Modifier un véhicule — Admin TBM" : "Nouveau véhicule — Admin TBM";

    if (isEditMode) {
      const fetchVehicle = async () => {
        try {
          const response = await fetch(`/api/vehicles/${id}`);
          if (!response.ok) throw new Error('Véhicule introuvable');
          const data = await response.json();
          reset(data);
        } catch (err) {
          setError("Impossible de charger les données du véhicule.");
          showToast("Impossible de charger les données du véhicule.", 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [id, isEditMode, reset]);

  const onSubmit = async (data: VehicleFormData) => {
    setSaving(true);
    setError(null);

    try {
      const url = isEditMode ? `/api/admin/vehicles/${id}` : '/api/admin/vehicles';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la sauvegarde';
        try {
          const result = await response.json();
          errorMessage = result.error || errorMessage;
        } catch (e) {
          if (response.status === 413) {
            errorMessage = "Les images sont trop volumineuses. Veuillez réduire leur taille.";
          } else {
            errorMessage = `Erreur serveur (${response.status})`;
          }
        }
        throw new Error(errorMessage);
      }

      showToast(isEditMode ? 'Véhicule modifié avec succès' : 'Véhicule ajouté avec succès', 'success');
      // Success -> Redirect to list
      navigate('/admin/vehicules');
    } catch (err: any) {
      console.error("Erreur de sauvegarde:", err);
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-tbm-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="mb-8">
        <Link to="/admin/vehicules" className="inline-flex items-center gap-2 text-slate-500 hover:text-tbm-blue font-bold mb-4 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          Retour aux véhicules
        </Link>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">
          {isEditMode ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
        </h1>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Informations générales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Marque *</label>
                  <input 
                    {...register('brand')} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all"
                    placeholder="ex: Toyota"
                  />
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Modèle *</label>
                  <input 
                    {...register('model')} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all"
                    placeholder="ex: Hilux Invincible"
                  />
                  {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Année *</label>
                  <input 
                    type="number"
                    {...register('year', { valueAsNumber: true })} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all"
                  />
                  {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Prix (€) *</label>
                  <input 
                    type="number"
                    {...register('price', { valueAsNumber: true })} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Caractéristiques techniques</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kilométrage (km) *</label>
                  <input 
                    type="number"
                    {...register('mileage', { valueAsNumber: true })} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all"
                  />
                  {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Couleur</label>
                  <input 
                    {...register('color')} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all"
                    placeholder="ex: Gris Anthracite"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Carburant *</label>
                  <select 
                    {...register('fuel')} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all"
                  >
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique</option>
                    <option value="GPL">GPL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Transmission *</label>
                  <select 
                    {...register('transmission')} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all"
                  >
                    <option value="Manuelle">Manuelle</option>
                    <option value="Automatique">Automatique</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Description détaillée</h2>
              <textarea 
                {...register('description')} 
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all resize-y"
                placeholder="Décrivez l'état du véhicule, ses options, son historique..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Photos */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Photos du véhicule</h2>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <ImageUploader 
                    images={field.value} 
                    onChange={field.onChange} 
                  />
                )}
              />
            </div>

          </div>

          {/* Right Column: Status & Publish */}
          <div className="space-y-8">
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Publication</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Statut</label>
                  <select 
                    {...register('status')} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-tbm-blue outline-none transition-all font-medium"
                  >
                    <option value="available">🟢 Disponible</option>
                    <option value="reserved">🟠 Réservé</option>
                    <option value="sold">🔴 Vendu</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input 
                    type="checkbox" 
                    {...register('featured')}
                    className="w-5 h-5 text-tbm-blue rounded border-slate-300 focus:ring-tbm-blue"
                  />
                  <div>
                    <p className="font-bold text-slate-900">Mettre en vedette</p>
                    <p className="text-xs text-slate-500">Afficher sur la page d'accueil</p>
                  </div>
                </label>

                <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-tbm-red text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Enregistrement...' : 'Enregistrer le véhicule'}
                  </button>
                  
                  <Link 
                    to="/admin/vehicules"
                    className="w-full text-center px-6 py-3.5 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    Annuler
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </form>
    </AdminLayout>
  );
}
