import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Navbar principale du site public TBM
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos véhicules', path: '/vehicules' },
    { name: 'À propos', path: '/#about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-tbm-blue sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3">
            <img 
              src="/logo-tbm.jpeg" 
              alt="TBM Occasions" 
              className="w-[79px] h-[79px] object-contain bg-white p-1 rounded" 
              onError={(e) => { 
                // Fallback si le logo n'est pas encore uploadé
                e.currentTarget.style.display = 'none'; 
              }} 
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a 
                  key={link.name} 
                  href={link.path} 
                  className="text-white hover:text-red-200 transition-colors"
                  style={{ fontFamily: 'Verdana', fontWeight: 'bold' }}
                >
                  {link.name}
                </a>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-white hover:text-red-200 transition-colors"
                  style={{ fontFamily: 'Verdana', fontWeight: 'bold' }}
                >
                  {link.name}
                </Link>
              )
            ))}
            <Button variant="primary" href="mailto:sastbm@outlook.fr" style={{ fontFamily: 'Verdana', fontWeight: 'bold' }}>
              Prendre RDV
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-white p-2 hover:bg-blue-800 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-tbm-blue border-t border-blue-800">
          <div className="px-4 py-6 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a 
                  key={link.name} 
                  href={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-white text-lg font-medium py-2 border-b border-blue-800/50"
                >
                  {link.name}
                </a>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-white text-lg font-medium py-2 border-b border-blue-800/50"
                >
                  {link.name}
                </Link>
              )
            ))}
            <div className="pt-4">
              <Button variant="primary" href="mailto:sastbm@outlook.fr" className="w-full">
                Prendre RDV
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
