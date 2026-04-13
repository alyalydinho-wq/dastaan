import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * Titre de section avec trait décoratif rouge TBM
 */
export default function SectionTitle({ title, subtitle, centered = false, className = '', theme = 'light' }: SectionTitleProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center flex flex-col items-center' : ''} ${className}`}>
      <h2 
        className={`text-3xl md:text-4xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
        style={{ fontFamily: 'Verdana', fontStyle: 'italic' }}
      >
        {title}
      </h2>
      <div className="w-20 h-1.5 bg-tbm-red rounded-full mb-6"></div>
      {subtitle && (
        <p className={`text-lg max-w-2xl ${theme === 'dark' ? 'text-blue-100' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
