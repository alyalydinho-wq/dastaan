import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

/**
 * Composant Bouton réutilisable aux couleurs TBM
 */
export default function Button({ variant = 'primary', href, children, className = '', onClick, type = 'button', disabled, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-tbm-red text-white hover:bg-red-700 shadow-md hover:shadow-lg",
    secondary: "bg-tbm-blue text-white hover:bg-blue-900 shadow-md hover:shadow-lg",
    outline: "border-2 border-tbm-blue text-tbm-blue hover:bg-tbm-blue hover:text-white"
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  if (href && !disabled) {
    // Si c'est une ancre, on utilise un tag <a> normal pour le scroll
    if (href.startsWith('#') || href.startsWith('/#')) {
      return <a href={href} className={classes} onClick={onClick as any}>{children}</a>;
    }
    return <Link to={href} className={classes} onClick={onClick as any}>{children}</Link>;
  }

  return <button type={type} className={classes} onClick={onClick as any} disabled={disabled} {...props}>{children}</button>;
}
