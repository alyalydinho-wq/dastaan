import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-24 h-24 bg-tbm-blue/10 text-tbm-blue rounded-full flex items-center justify-center mb-6">
        <Car className="w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-4 text-center">Cette page n'existe pas</h1>
      <p className="text-slate-500 mb-8 text-center max-w-md">Il semble que vous ayez pris un mauvais virage. La page que vous recherchez a été déplacée ou n'existe plus.</p>
      <Link 
        to="/" 
        className="bg-tbm-red text-white px-8 py-3.5 rounded-xl font-bold hover:bg-red-700 transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
