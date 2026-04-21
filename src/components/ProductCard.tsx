import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product, useStore } from '../store';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.some((p) => p.id === product.id);

  return (
    <div className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-bordeaux-deep mb-6 rounded-3xl border border-white/5 shadow-2xl">
        {/* Badges */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          {product.badges?.map((badge, idx) => (
            <span key={idx} className="bg-brand-dark text-brand-bordeaux text-[9px] uppercase tracking-wider px-3 py-1 font-medium rounded-full">
              {badge}
            </span>
          ))}
          {(!product.badges || product.badges.length === 0) && product.isNew && (
            <span className="bg-brand-dark text-brand-bordeaux text-[9px] uppercase tracking-wider px-3 py-1 font-medium rounded-full">Nouveau</span>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-sm bg-white/80 backdrop-blur text-brand-dark opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-dark hover:text-brand-bordeaux"
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "" : ""} />
        </button>

        <Link to={`/product/${product.id}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
            referrerPolicy="no-referrer"
          />
          {/* Hover Image */}
          {product.images[1] && (
            <img 
              src={product.images[1]} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-0 group-hover:opacity-100 grayscale-[0.2] group-hover:grayscale-0"
              referrerPolicy="no-referrer"
            />
          )}
        </Link>
      </div>

      <div className="flex justify-between items-start px-2 mt-4">
        <div className="flex flex-col gap-1">
          <Link to={`/product/${product.id}`} className="text-sm font-serif font-medium text-brand-offwhite hover:text-brand-dark transition-colors">
            {product.name}
          </Link>
          <div className="text-brand-gray text-xs font-sans">
            {product.colors.length} {product.colors.length > 1 ? 'Nuances' : 'Nuance'}
          </div>
        </div>
        <div className="flex flex-col items-end">
          {product.salePrice ? (
            <>
              <span className="text-xs text-brand-gray line-through font-sans">
                {product.price.toFixed(2)} €
              </span>
              <span className="text-sm text-brand-offwhite font-sans font-medium">
                {product.salePrice.toFixed(2)} €
              </span>
            </>
          ) : (
            <div className="text-sm text-brand-offwhite font-sans font-medium">
              {product.price.toFixed(2)} €
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
