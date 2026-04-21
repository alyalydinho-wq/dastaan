import React from 'react';

interface LogoProps {
  className?: string;
  white?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", white = false }) => {
  const fillColor = white ? '#FFFFFF' : '#000000';
  
  return (
    <svg 
      viewBox="0 0 400 150" 
      className={`${className} overflow-visible`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <text 
        x="200" 
        y="100" 
        textAnchor="middle" 
        fill={fillColor} 
        style={{ fontFamily: "'Playball', 'Great Vibes', cursive", fontSize: '120px' }}
      >
        Dastaan
      </text>
      <text 
        x="205" 
        y="145" 
        textAnchor="middle" 
        fill={fillColor} 
        style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '26px', letterSpacing: '0.4em' }}
        className="uppercase font-light"
      >
        Paris
      </text>
    </svg>
  );
};
