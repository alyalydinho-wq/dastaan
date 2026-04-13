import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Save } from 'lucide-react';

interface AppointmentFormProps {
  token: string;
  onLogout: () => void;
}

export default function AppointmentForm({ token, onLogout }: AppointmentFormProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    vehicleId: '',
    message: '',
  });

  useEffect(() => {
    document.title = "Nouveau rendez-vous — Admin TBM";
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du rendez-vous');
      }

      showToast('Rendez-vous ajouté avec succès', 'success');
      navigate('/admin/rendez-vous');
    } catch (error) {
      console.error(error);
      showToast('Erreur lors de l\'ajout du rendez-vous', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/admin/rendez-vous')}
            className="flex items-center gap-2 text-slate-500 hover:text-tbm-blue transition-colors mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux rendez-vous
          </button>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">
            Nouveau rendez-vous
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informations Client */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Informations Client</h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet *</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-tbm-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="clientEmail"
                  required
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-tbm-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="jean.dupont@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  name="clientPhone"
                  required
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-tbm-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="0692 XX XX XX"
                />
              </div>
            </div>

            {/* Détails du rendez-vous */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Détails du rendez-vous</h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Véhicule concerné *</label>
                <select
                  name="vehicleId"
                  required
                  value={formData.vehicleId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-tbm-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                >
                  <option value="">Sélectionnez un véhicule</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} - {v.price.toLocaleString('fr-FR')} €
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message / Notes</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-tbm-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  placeholder="Date souhaitée, questions particulières..."
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/rendez-vous')}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              Enregistrer le rendez-vous
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
