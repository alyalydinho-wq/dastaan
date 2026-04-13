import React from 'react';
import { Car, LayoutDashboard, Calendar, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  adminEmail: string;
  onLogout: () => void;
}

/**
 * Barre de navigation pour l'interface d'administration TBM
 */
export default function AdminHeader({ adminEmail, onLogout }: AdminHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="bg-tbm-blue p-1.5 rounded-md">
                <Car className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-display font-black text-tbm-blue tracking-tighter">
                TBM<span className="text-tbm-red">.</span>ADMIN
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-tbm-blue transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Tableau de bord
              </Link>
              <Link 
                to="/admin/vehicles" 
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-tbm-blue transition-colors"
              >
                <Car className="w-4 h-4" />
                Véhicules
              </Link>
              <Link 
                to="/admin/appointments" 
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-tbm-blue transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Rendez-vous
              </Link>
            </nav>
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">{adminEmail}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-tbm-red hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
