import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product, useStore } from '../store';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const allProducts = useStore((state) => state.products);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category');
  const isNew = searchParams.get('new');
  const isPromo = searchParams.get('promo');

  useEffect(() => {
    setLoading(true);
    let filtered = [...allProducts];

    // Filter logic
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (isNew) {
      filtered = filtered.filter(p => p.isNew || p.badges?.includes('Nouveau'));
    }
    if (isPromo) {
      filtered = filtered.filter(p => p.salePrice !== undefined || p.badges?.includes('Promo') || p.category === 'Promotions');
    }

    // Sort logic
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    
    setProducts(filtered);
    setLoading(false);
  }, [category, isNew, isPromo, allProducts, sortBy]);

  let title = "Toutes les Collections";
  if (category) title = `Collection ${category}`;
  if (isNew) title = "Nouveautés";
  if (isPromo) title = "Promotions & Offres";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-sans font-bold tracking-tighter text-brand-offwhite mb-4 uppercase italic"
        >
          {title}
        </motion.h1>
         <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "60px", opacity: 1 }}
            className="h-[2px] w-14 bg-brand-gold mb-6 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
          />
        <p className="text-brand-beige/40 text-xs uppercase tracking-widest leading-relaxed max-w-xl font-bold italic">
          Découvrez nos créations exclusives, où chaque pièce est pensée pour allier la grâce de la coutume à la modernité des coupes.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center py-6 border-b border-t border-white/5 mb-12 gap-4">
        <div className="relative">
          <button 
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-brand-beige hover:text-brand-gold transition-colors"
          >
            <SlidersHorizontal size={14} className="mr-3" />
            Filtrer les pièces
          </button>
          
          {isFilterMenuOpen && (
            <div className="absolute top-full left-0 mt-2 p-4 bg-brand-bordeaux border border-brand-dark/10 rounded-lg shadow-xl z-50 text-xs uppercase tracking-widest font-bold">
               {/* Simplified Filter Option Example */}
               <button onClick={() => { /* Implement specific category filter state here if needed */ setIsFilterMenuOpen(false); }} className="block py-1 hover:text-brand-gold">Tout</button>
               <button onClick={() => { /* ... */ }} className="block py-1 hover:text-brand-gold">Femme</button>
               <button onClick={() => { /* ... */ }} className="block py-1 hover:text-brand-gold">Enfant</button>
            </div>
          )}
        </div>
        
        <div className="text-[10px] text-brand-gold uppercase tracking-widest font-bold">
          {products.length} {products.length > 1 ? 'pièces trouvées' : 'pièce trouvée'}
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-brand-beige hover:text-brand-gold transition-colors"
          >
            Trier par <ChevronDown size={14} className="ml-2" />
          </button>
          
          {isSortMenuOpen && (
            <div className="absolute top-full right-0 mt-2 p-4 bg-brand-bordeaux border border-brand-dark/10 rounded-lg shadow-xl z-50 text-xs uppercase tracking-widest font-bold whitespace-nowrap">
               <button onClick={() => { setSortBy('default'); setIsSortMenuOpen(false); }} className="block py-1 hover:text-brand-gold">Par défaut</button>
               <button onClick={() => { setSortBy('price-asc'); setIsSortMenuOpen(false); }} className="block py-1 hover:text-brand-gold">Prix croissant</button>
               <button onClick={() => { setSortBy('price-desc'); setIsSortMenuOpen(false); }} className="block py-1 hover:text-brand-gold">Prix décroissant</button>
               <button onClick={() => { setSortBy('newest'); setIsSortMenuOpen(false); }} className="block py-1 hover:text-brand-gold">Nouveautés</button>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-brand-bordeaux-deep aspect-[3/4] mb-4 rounded-3xl"></div>
              <div className="h-4 bg-brand-bordeaux-deep w-3/4 mb-2 rounded"></div>
              <div className="h-4 bg-brand-bordeaux-deep w-1/4 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 text-brand-beige/20">
          <p className="font-serif text-3xl mb-4 text-brand-gold italic">Aucun article trouvé.</p>
          <p className="text-[10px] uppercase tracking-widest font-bold">Essayez de modifier vos filtres ou de revenir plus tard.</p>
        </div>
      )}
    </div>
  );
}
