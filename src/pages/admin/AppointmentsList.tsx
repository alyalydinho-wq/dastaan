import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import AppointmentRow from '../../components/admin/AppointmentRow';
import { Calendar, AlertCircle, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AppointmentsListProps {
  token: string;
  onLogout: () => void;
}

export default function AppointmentsList({ token, onLogout }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'refused'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Rendez-vous clients — Admin TBM";
    fetchAppointments();
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/admin/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error("Erreur :", err);
      showToast('Impossible de charger les rendez-vous', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      setAppointments(appointments.filter(a => a.id !== id));
      setDeleteConfirmId(null);
      showToast('Rendez-vous supprimé', 'success');
    } catch (error) {
      console.error("Erreur de suppression:", error);
      showToast("Impossible de supprimer le rendez-vous.", 'error');
    }
  };

  const filteredAppointments = appointments.filter(a => 
    filter === 'all' ? true : a.status === filter
  );

  const tabs = [
    { id: 'all', label: 'Tous' },
    { id: 'pending', label: 'En attente' },
    { id: 'confirmed', label: 'Confirmés' },
    { id: 'refused', label: 'Refusés' },
  ];

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Rendez-vous clients</h1>
          <p className="text-slate-500 mt-1">Gérez les demandes de rendez-vous de vos clients.</p>
        </div>
        <Link 
          to="/admin/rendez-vous/nouveau"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-tbm-blue text-white font-bold rounded-xl hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-5 h-5" />
          Nouveau rendez-vous
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex overflow-x-auto">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  filter === tab.id 
                    ? 'bg-tbm-blue text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                {tab.id === 'pending' && appointments.filter(a => a.status === 'pending').length > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === tab.id ? 'bg-white text-tbm-blue' : 'bg-orange-100 text-orange-800'}`}>
                    {appointments.filter(a => a.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-semibold w-40">Date</th>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Téléphone</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Véhicule</th>
                <th className="p-4 font-semibold">Message</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-tbm-blue border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-1">Aucun rendez-vous trouvé</p>
                    <p className="text-slate-500">Il n'y a pas de rendez-vous correspondant à ce filtre.</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <AppointmentRow 
                    key={appointment.id} 
                    appointment={appointment} 
                    token={token} 
                    onDelete={(id) => setDeleteConfirmId(id)} 
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Supprimer ce rendez-vous ?</h3>
            <p className="text-slate-500 mb-6">Cette action est irréversible. Le rendez-vous sera définitivement supprimé de la base de données.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 bg-tbm-red text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
