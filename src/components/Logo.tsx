import React from 'react';

interface LogoProps {
  className?: string;
  white?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", white = false }) => {
  // L'image envoyée a un fond blanc et texte noir originalement.
  // mix-blend-mode: multiply va rendre le fond blanc transparent (ne garde que le noir).
  // invert(1) + mix-blend-mode: screen va rendre le fond transparent et le texte blanc.
  return (
    <img 
      src="/logo-dastaan.webp" 
      alt="Dastaan Paris" 
      className={`${className} object-contain`}
      style={
        white 
          ? { filter: 'invert(1)', mixBlendMode: 'screen' } 
          : { mixBlendMode: 'multiply' }
      }
    />
  );
};
