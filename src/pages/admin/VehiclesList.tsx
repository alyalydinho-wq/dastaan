import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import { Plus, Search, Edit2, Trash2, AlertCircle, Car } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
  images: string[];
}

interface VehiclesListProps {
  token: string;
  onLogout: () => void;
}

export default function VehiclesList({ token, onLogout }: VehiclesListProps) {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Mes véhicules — Admin TBM";
    fetchVehicles();
  }, [token]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      console.error("Erreur :", err);
      showToast('Impossible de charger les véhicules', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      setVehicles(vehicles.filter(v => v.id !== id));
      setDeleteConfirmId(null);
      showToast('Véhicule supprimé avec succès', 'success');
    } catch (error) {
      console.error("Erreur de suppression:", error);
      showToast("Impossible de supprimer le véhicule.", 'error');
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    `${v.brand} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Mes véhicules</h1>
          <p className="text-slate-500 mt-1">Gérez votre catalogue de véhicules d'occasion.</p>
        </div>
        <Link 
          to="/admin/vehicules/nouveau"
          className="inline-flex items-center gap-2 bg-tbm-red text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Ajouter un véhicule
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Rechercher par marque ou modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-tbm-blue outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-semibold w-24">Photo</th>
                <th className="p-4 font-semibold">Véhicule</th>
                <th className="p-4 font-semibold">Année</th>
                <th className="p-4 font-semibold">Prix</th>
                <th className="p-4 font-semibold">Kilométrage</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-tbm-blue border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-1">Aucun véhicule trouvé</p>
                    <p className="text-slate-500">Essayez de modifier vos critères de recherche ou ajoutez un nouveau véhicule.</p>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100">
                        <img 
                          src={vehicle.images?.[0] || `https://picsum.photos/seed/${vehicle.brand}/200/150`} 
                          alt={vehicle.model}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{vehicle.brand} {vehicle.model}</p>
                    </td>
                    <td className="p-4 text-slate-600">{vehicle.year}</td>
                    <td className="p-4 font-bold text-tbm-blue">{vehicle.price.toLocaleString('fr-FR')} €</td>
                    <td className="p-4 text-slate-600">{vehicle.mileage.toLocaleString('fr-FR')} km</td>
                    <td className="p-4">
                      <Badge status={vehicle.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/vehicules/${vehicle.id}/modifier`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => setDeleteConfirmId(vehicle.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Simple footer for now) */}
        {!loading && filteredVehicles.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-sm text-slate-500 text-center">
            Affichage de {filteredVehicles.length} véhicule(s)
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Supprimer ce véhicule ?</h3>
            <p className="text-slate-500 mb-6">Cette action est irréversible. Le véhicule et ses images seront définitivement supprimés.</p>
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
