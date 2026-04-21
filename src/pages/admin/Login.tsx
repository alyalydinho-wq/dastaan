import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { motion } from 'motion/react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { Logo } from '../../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, adminCredentials } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === adminCredentials.email && password === adminCredentials.password) {
      login(email);
      navigate('/admin/dashboard');
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo className="h-16 w-auto mb-6" />
          <h1 className="text-3xl font-sans font-bold tracking-tighter text-black uppercase italic mb-2">Espace Professionnel</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Connexion Réservée aux Administrateurs</p>
        </div>

        <div className="bg-gray-50 p-8 md:p-10 rounded-[40px] border border-gray-200 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-2xl flex items-center gap-3 font-bold uppercase tracking-wider"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-700 ml-4 italic">Email Professionnel</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@admin.com"
                  required
                  className="w-full bg-white border border-gray-200 rounded-full py-4 pl-14 pr-6 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-700 ml-4 italic">Mot de Passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-gray-200 rounded-full py-4 pl-14 pr-6 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-all font-bold"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all duration-500 shadow-xl"
            >
              Se Connecter
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors font-bold"
          >
            Retour au Site
          </button>
        </div>
      </motion.div>
    </div>
  );
}
