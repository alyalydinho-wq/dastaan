import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloatingButton from '../ui/WhatsAppFloatingButton';

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal pour le site public
 * Englobe le contenu avec la Navbar et le Footer
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a1a1a]">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
