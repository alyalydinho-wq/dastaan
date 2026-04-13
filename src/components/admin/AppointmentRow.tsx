import React, { useState } from 'react';
import { Check, X, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AppointmentRowProps {
  key?: React.Key;
  appointment: any;
  token: string;
  onDelete: (id: string) => void;
}

export default function AppointmentRow({ appointment, token, onDelete }: AppointmentRowProps) {
  const [status, setStatus] = useState(appointment.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    if (status === newStatus || isUpdating) return;
    
    setIsUpdating(true);
    // Optimistic update
    const previousStatus = status;
    setStatus(newStatus);

    try {
      const response = await fetch(`/api/admin/appointments/${appointment.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Erreur');
      showToast(`Statut mis à jour avec succès`, 'success');
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert on failure
      setStatus(previousStatus);
      showToast('Erreur lors de la mise à jour du statut', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="p-4 text-slate-500 text-sm">
        {new Date(appointment.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })}
      </td>
      <td className="p-4">
        <p className="font-bold text-slate-900">{appointment.clientName}</p>
      </td>
      <td className="p-4 text-slate-600">{appointment.clientPhone}</td>
      <td className="p-4 text-slate-600">{appointment.clientEmail}</td>
      <td className="p-4">
        {appointment.vehicle ? (
          <a 
            href={`/vehicules/${appointment.vehicle.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-tbm-blue font-bold hover:underline"
          >
            {appointment.vehicle.brand} {appointment.vehicle.model}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-slate-400 italic">Véhicule supprimé</span>
        )}
      </td>
      <td className="p-4 max-w-xs">
        <p className="text-sm text-slate-600 truncate" title={appointment.message}>
          {appointment.message || <span className="italic text-slate-400">Aucun message</span>}
        </p>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
          status === 'pending' ? 'bg-orange-100 text-orange-800' :
          status === 'confirmed' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status === 'pending' ? 'En attente' : status === 'confirmed' ? 'Confirmé' : 'Refusé'}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isUpdating ? (
            <div className="p-2 text-slate-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
          ) : (
            <>
              {status !== 'confirmed' && (
                <button 
                  onClick={() => handleStatusChange('confirmed')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Confirmer"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
              {status !== 'refused' && (
                <button 
                  onClick={() => handleStatusChange('refused')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Refuser"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => onDelete(appointment.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
