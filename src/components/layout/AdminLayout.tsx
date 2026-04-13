import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Calendar, LogOut, Menu, X, Globe } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await fetch('/api/admin/appointments/pending-count');
        if (response.ok) {
          const data = await response.json();
          setPendingCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };
    fetchPendingCount();
  }, [location.pathname]); // Refresh count when navigating

  const navLinks = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Véhicules', path: '/admin/vehicules', icon: Car },
    { name: 'Rendez-vous', path: '/admin/rendez-vous', icon: Calendar, badge: pendingCount > 0 ? pendingCount : undefined },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-tbm-blue text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo-tbm.jpeg" alt="TBM Logo" className="h-8 bg-white p-1 rounded" />
          <span className="font-display font-black text-xl">Admin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-tbm-blue text-white flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-4 border-b border-blue-800/50">
          <img src="/logo-tbm.jpeg" alt="TBM Logo" className="h-10 bg-white p-1.5 rounded-lg" />
          <span className="font-display font-black text-2xl tracking-tight">Admin</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            const Icon = link.icon;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all
                  ${isActive 
                    ? 'bg-tbm-red text-white shadow-lg shadow-red-500/20' 
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                  {link.name}
                </div>
                {link.badge !== undefined && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-tbm-red' : 'bg-tbm-red text-white'}`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-800/50 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <Globe className="w-5 h-5 text-blue-300" />
            Retour au site
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5 text-blue-300" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 md:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
