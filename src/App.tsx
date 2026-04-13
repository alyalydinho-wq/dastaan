import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import VehiclesCatalog from './pages/VehiclesCatalog';
import VehicleDetail from './pages/VehicleDetail';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import VehiclesList from './pages/admin/VehiclesList';
import VehicleForm from './pages/admin/VehicleForm';
import AppointmentsList from './pages/admin/AppointmentsList';
import AppointmentForm from './pages/admin/AppointmentForm';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';

/**
 * Composant principal gérant le routage et l'état d'authentification
 */
export default function App() {
  const [token, setToken] = React.useState<string | null>(localStorage.getItem('tbm_admin_token'));
  const [admin, setAdmin] = React.useState<any>(null);

  const handleLoginSuccess = (newToken: string, adminData: any) => {
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem('tbm_admin_token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('tbm_admin_token');
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/vehicules" element={<VehiclesCatalog />} />
            <Route path="/vehicules/:id" element={<VehicleDetail />} />
            <Route path="/contact" element={<Contact />} />

            {/* Routes Admin */}
            <Route 
              path="/admin/login" 
              element={token ? <Navigate to="/admin/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
            />
            
            <Route 
              path="/admin/dashboard" 
              element={
                token ? (
                  <AdminDashboard token={token} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/admin/login" />
                )
              } 
            />

            <Route 
              path="/admin/vehicules" 
              element={
                token ? (
                  <VehiclesList token={token} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/admin/login" />
                )
              } 
            />

            <Route 
              path="/admin/vehicules/nouveau" 
              element={
                token ? (
                  <VehicleForm token={token} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/admin/login" />
                )
              } 
            />

            <Route 
              path="/admin/vehicules/:id/modifier" 
              element={
                token ? (
                  <VehicleForm token={token} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/admin/login" />
                )
              } 
            />

            <Route 
              path="/admin/rendez-vous" 
              element={
                token ? (
                  <AppointmentsList token={token} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/admin/login" />
                )
              } 
            />

            <Route 
              path="/admin/rendez-vous/nouveau" 
              element={
                token ? (
                  <AppointmentForm token={token} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/admin/login" />
                )
              } 
            />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
