import React from 'react';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const { wishlist } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tighter text-brand-offwhite mb-4 uppercase italic">Votre Wishlist</h1>
        <div className="h-[2px] w-14 bg-brand-gold mx-auto mb-6 shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
        <p className="text-brand-beige/40 text-[10px] uppercase tracking-widest font-bold italic font-bold">Vos articles favoris pour une prochaine commande.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-brand-beige/20">
           <Heart size={48} strokeWidth={1} className="mb-4 text-brand-gold opacity-40" />
           <p className="text-2xl font-sans font-bold text-brand-gold tracking-tighter mb-8 uppercase italic">Votre liste de favoris est vide</p>
           <Link to="/shop" className="bg-brand-gold text-brand-dark px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-beige transition-all shadow-2xl">
              Explorer nos collections
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
