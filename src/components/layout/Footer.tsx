import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

/**
 * Footer principal du site public TBM
 */
export default function Footer() {
  return (
    <footer className="bg-tbm-blue text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo-tbm.jpeg" 
                alt="TBM Occasions" 
                className="w-[79px] h-[79px] object-contain bg-white p-1 rounded" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
              />
            </Link>
            <p className="text-blue-200 max-w-sm leading-relaxed" style={{ fontFamily: 'Verdana', fontStyle: 'italic', fontWeight: 'normal' }}>
              Votre partenaire de confiance pour l'achat de véhicules d'occasion de qualité à La Réunion. Expertise et service de proximité.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-white">Liens Rapides</h3>
            <ul className="space-y-3 text-blue-200">
              <li><Link to="/vehicules" className="hover:text-white transition-colors">Nos véhicules en stock</Link></li>
              <li><Link to="/#about" className="hover:text-white transition-colors">À propos de TBM</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Prendre rendez-vous</Link></li>
              <li className="pt-4 mt-4 border-t border-blue-800/50">
                <Link to="/admin/login" className="text-sm text-blue-400 hover:text-white transition-colors">
                  Espace Professionnel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-white">Contactez-nous</h3>
            <ul className="space-y-4 text-blue-200">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-tbm-red shrink-0 mt-0.5" />
                <span>66 rue Léopold Rambaud<br/>Sainte-Clotilde<br/>Réunion 97490</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-tbm-red shrink-0" />
                <a href="mailto:sastbm@outlook.fr" className="hover:text-white transition-colors">sastbm@outlook.fr</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-tbm-red shrink-0" />
                <span>0692 10 10 56 - 0692 78 44 29</span>
              </li>
            </ul>
          </div>

          {/* Google Maps */}
          <div className="h-48 lg:h-full min-h-[200px] rounded-xl overflow-hidden shadow-lg border border-white/10">
            <iframe 
              src="https://maps.google.com/maps?q=66%20rue%20L%C3%A9opold%20Rambaud,%20Sainte-Clotilde,%20R%C3%A9union%2097490&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation TBM"
            ></iframe>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} TBM Occasions. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
