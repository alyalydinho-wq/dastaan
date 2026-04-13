import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import { Car, CheckCircle, Calendar, Plus, Clock } from 'lucide-react';

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

interface DashboardStats {
  availableVehicles: number;
  soldVehicles: number;
  pendingAppointments: number;
  monthlyAppointments: number;
  recentAppointments: any[];
  recentVehicles: any[];
}

export default function AdminDashboard({ token, onLogout }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Tableau de bord TBM — Admin";

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Erreur :", err);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-tbm-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100">
          <p className="font-bold">{error || "Erreur inconnue"}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Bienvenue sur l'espace d'administration TBM.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Véhicules disponibles" 
          value={stats.availableVehicles} 
          icon={Car} 
          color="blue" 
        />
        <StatCard 
          title="Véhicules vendus" 
          value={stats.soldVehicles} 
          icon={CheckCircle} 
          color="green" 
        />
        <StatCard 
          title="Rendez-vous en attente" 
          value={stats.pendingAppointments} 
          icon={Clock} 
          color="orange"
          badge={stats.pendingAppointments > 0 ? stats.pendingAppointments : undefined}
        />
        <StatCard 
          title="Rendez-vous (ce mois)" 
          value={stats.monthlyAppointments} 
          icon={Calendar} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Recent Appointments */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Derniers rendez-vous</h2>
            <div className="flex items-center gap-4">
              <Link to="/admin/rendez-vous/nouveau" className="text-sm font-semibold text-tbm-blue hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Nouveau
              </Link>
              <Link to="/admin/rendez-vous" className="text-sm font-semibold text-slate-500 hover:text-slate-900 hover:underline">Voir tout</Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Client</th>
                  <th className="p-4 font-semibold">Véhicule</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentAppointments.length > 0 ? (
                  stats.recentAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{app.clientName}</td>
                      <td className="p-4 text-slate-600">{app.vehicle.brand} {app.vehicle.model}</td>
                      <td className="p-4 text-slate-500 text-sm">{new Date(app.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          app.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          app.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {app.status === 'pending' ? 'En attente' : app.status === 'confirmed' ? 'Confirmé' : app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">Aucun rendez-vous récent.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Vehicles */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Derniers véhicules ajoutés</h2>
            <Link to="/admin/vehicules" className="text-sm font-semibold text-tbm-blue hover:underline">Voir tout</Link>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {stats.recentVehicles.length > 0 ? (
                stats.recentVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img 
                        src={vehicle.images?.[0] || `https://picsum.photos/seed/${vehicle.brand}/200/150`} 
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-sm text-slate-500 font-medium">{vehicle.price.toLocaleString('fr-FR')} €</p>
                    </div>
                    <div className="shrink-0">
                      <Badge status={vehicle.status} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">Aucun véhicule récent.</div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <Link 
        to="/admin/vehicules/nouveau"
        className="fixed bottom-8 right-8 w-14 h-14 bg-tbm-red text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 hover:bg-red-700 hover:scale-105 transition-all z-40 group"
        title="Ajouter un véhicule"
      >
        <Plus className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-sm font-medium py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Ajouter un véhicule
        </span>
      </Link>

    </AdminLayout>
  );
}

// Helper component for Stat Cards
function StatCard({ title, value, icon: Icon, color, badge }: { title: string, value: number, icon: any, color: string, badge?: number }) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colorStyles[color as keyof typeof colorStyles]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-display font-black text-slate-900">{value}</p>
      </div>
      
      {badge !== undefined && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-tbm-red text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
          {badge}
        </div>
      )}
    </div>
  );
}
