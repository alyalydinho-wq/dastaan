import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function WhatsAppFloatingButton() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "262692000000"; // Numéro fictif pour l'exemple, à remplacer par le vrai
  
  useEffect(() => {
    // Apparition retardée pour une meilleure UX
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Déterminer le message en fonction de la page
  let message = "Bonjour, je souhaite avoir plus d'informations sur vos véhicules.";
  
  if (location.pathname.startsWith('/vehicules/')) {
    const id = location.pathname.split('/').pop();
    message = `Bonjour, je suis intéressé par le véhicule (Réf: ${id}). Pouvez-vous me donner plus d'informations ?`;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* Social Proof Bubble */}
      <div className="bg-white text-slate-800 text-xs font-bold px-3 py-2.5 rounded-2xl rounded-br-sm shadow-xl border border-slate-100 flex items-center gap-2 animate-bounce">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
        </span>
        Réponse en -10 min
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300 group"
        aria-label="Contactez-nous sur WhatsApp"
      >
        {/* Pulse Ring Effect */}
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75"></span>
        
        <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.124.553 4.194 1.605 6.015L.201 24l6.102-1.601c1.758.95 3.738 1.45 5.728 1.45 6.648 0 12.031-5.383 12.031-12.031C24.062 5.383 18.679 0 12.031 0zm0 21.844c-1.79 0-3.542-.481-5.08-1.39l-.364-.216-3.774.99.99-3.774-.216-.364A9.97 9.97 0 012.062 12.03c0-5.506 4.482-9.988 9.988-9.988s9.988 4.482 9.988 9.988-4.482 9.988-9.988 9.988zm5.474-7.485c-.3-.15-1.774-.876-2.048-.976-.274-.1-.474-.15-.674.15-.2.3-.774.976-.948 1.176-.174.2-.348.226-.648.076-.3-.15-1.266-.466-2.41-1.486-.89-.794-1.49-1.774-1.664-2.074-.174-.3-.018-.462.132-.612.134-.134.3-.35.45-.524.15-.174.2-.3.3-.5.1-.2.05-.374-.024-.524-.074-.15-.674-1.624-.924-2.224-.244-.58-.492-.502-.674-.512-.174-.01-.374-.01-.574-.01-.2 0-.524.074-.8.374-.274.3-1.048 1.024-1.048 2.498 0 1.474 1.074 2.898 1.224 3.098.15.2 2.112 3.224 5.112 4.524.714.31 1.27.496 1.704.636.716.23 1.368.198 1.882.12.576-.088 1.774-.726 2.024-1.426.25-.7.25-1.3.174-1.426-.076-.126-.276-.2-.576-.35z"/>
        </svg>
      </a>
    </div>
  );
}
