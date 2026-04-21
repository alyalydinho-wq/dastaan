import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, useStore } from '../store';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, ChevronRight, Share2, Ruler } from 'lucide-react';
import { Logo } from '../components/Logo';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);
  
  const { addToCart, wishlist, toggleWishlist, products } = useStore();
  const isWishlisted = product ? wishlist.some((p) => p.id === product?.id) : false;

  useEffect(() => {
    setLoading(true);
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.colors && foundProduct.colors.length > 0) setSelectedColor(foundProduct.colors[0]);
      if (foundProduct.sizes && foundProduct.sizes.length > 0) setSelectedSize(foundProduct.sizes[0]);
    }
    setLoading(false);
  }, [id, products]);

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) return;
    addToCart({
      product,
      quantity: 1,
      selectedColor,
      selectedSize,
    });
    // Optional: trigger cart drawer open here by adding global state for UI
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-brand-offwhite">
        <h1 className="text-4xl font-sans font-bold tracking-tighter mb-4 uppercase text-brand-gold italic">Produit introuvable</h1>
        <Link to="/shop" className="text-[10px] uppercase tracking-widest border-b-2 border-brand-gold pb-1 font-bold">Retour à la boutique</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      {/* Breadcrumbs */}
      <nav className="flex text-[9px] uppercase tracking-[0.3em] text-brand-beige/40 mb-12 font-bold" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-2 w-full truncate">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-brand-gold transition-colors">Accueil</Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-3 h-3 mx-2 text-white/10" />
              <Link to="/shop" className="hover:text-brand-gold transition-colors">Boutique</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center text-brand-offwhite">
              <ChevronRight className="w-3 h-3 mx-2 text-white/10" />
              <span className="truncate max-w-[150px] italic">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-6 lg:flex-row-reverse">
          {/* Main Image */}
          <div className="flex-1 overflow-hidden bg-brand-bordeaux-deep rounded-3xl relative group border border-white/5 shadow-2xl">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-8 left-8 z-10 flex flex-col gap-3">
              {product.badges?.map((badge, idx) => (
                <span key={idx} className="bg-black text-white text-[10px] uppercase tracking-[0.3em] px-5 py-2 font-bold rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                  {badge}
                </span>
              ))}
              {(!product.badges || product.badges.length === 0) && product.isNew && (
                <span className="bg-black text-white text-[10px] uppercase tracking-[0.3em] px-5 py-2 font-bold rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                  Exclusivité
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:w-24 snap-x hide-scrollbar">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`snap-center flex-shrink-0 w-20 h-24 lg:w-full lg:h-32 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-gold scale-95 shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img src={img} alt={`${product.name} ${idx+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-28 h-max">
          <div className="space-y-8 mb-16">
            <div className="flex items-center gap-4">
              <div className="px-5 py-2 bg-brand-gold/10 rounded-full border border-brand-gold/20 flex items-center">
                <Logo className="h-4 w-auto" white />
              </div>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            
            <div className="flex justify-between items-start pt-2">
              <h1 className="text-4xl lg:text-5xl font-sans font-bold tracking-tighter text-brand-offwhite leading-tight pr-8 uppercase italic">{product.name}</h1>
              <button 
                onClick={() => toggleWishlist(product)}
                className="mt-2 text-white/20 hover:text-brand-gold transition-all hover:scale-110 shrink-0"
              >
                <Heart size={32} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-brand-gold" : ""} strokeWidth={1} />
              </button>
            </div>
            
            <div className="flex items-baseline gap-4">
              {product.salePrice ? (
                <>
                  <span className="text-3xl text-brand-gold font-sans font-bold tracking-tighter">
                    {product.salePrice.toFixed(2)} €
                  </span>
                  <span className="text-xl text-white/20 line-through font-sans italic">
                    {product.price.toFixed(2)} €
                  </span>
                </>
              ) : (
                <div className="text-3xl text-brand-gold font-sans font-bold tracking-tighter">
                  {product.price.toFixed(2)} €
                </div>
              )}
            </div>
            
            <div className="text-black text-xs font-bold leading-relaxed border-l-2 border-black pl-6 italic">
              Une pièce d'exception conçue pour sublimer votre allure avec un raffinement contemporain et une élégance intemporelle.
            </div>
          </div>

          <form className="space-y-12" onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>
            {/* Color Selection */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-black italic opacity-80">Nuance Sélectionnée</span>
                <span className="text-[10px] text-black font-bold uppercase tracking-widest">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-12 px-8 text-[9px] uppercase tracking-[0.2em] font-bold rounded-full border transition-all ${selectedColor === color ? 'bg-black text-white border-black shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-105' : 'bg-gray-100 border-black/10 text-black hover:border-black hover:text-black'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-black italic opacity-60">Choisir une Taille</span>
                <button type="button" className="text-[10px] text-black font-bold uppercase tracking-widest flex items-center hover:text-black transition-colors">
                  <Ruler size={14} className="mr-2" /> Guide des Tailles
                </button>
              </div>
              <div className="flex flex-wrap gap-4">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${selectedSize === size ? 'bg-black text-white border-black shadow-[0_0_25px_rgba(0,0,0,0.4)] scale-110' : 'bg-gray-100 border-black/10 text-black hover:border-black hover:text-black hover:-translate-y-1'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <div className="pt-6 space-y-6">
              <button
                type="submit"
                disabled={!product.inStock}
                className={`w-full py-7 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-700 hover:scale-[1.01] active:scale-[0.98] rounded-full ${
                  product.inStock 
                    ? 'bg-brand-gold text-brand-bordeaux shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)]' 
                    : 'bg-brand-bordeaux-deep text-black/20 cursor-not-allowed border border-black/5'
                }`}
              >
                {product.inStock ? 'Ajouter à mon écrin' : 'Sélection Épuisée'}
              </button>
              <div className="flex justify-center gap-8 text-[9px] text-brand-beige/40 uppercase tracking-[0.2em] font-bold">
                 <span className="flex items-center hover:text-brand-gold cursor-pointer transition-colors"><Share2 size={12} className="mr-2" /> Partager</span>
                 <span className="italic">✨ Livraison Privilégiée Incluse</span>
              </div>
            </div>
            
            {/* Details Accordion */}
            <div className="pt-12 space-y-8 border-t border-white/5">
              <details className="group" open>
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-[10px] uppercase tracking-[0.2em] text-black">
                  <span>Atelier & Composition</span>
                  <span className="transition duration-500 group-open:rotate-180 text-black">
                    <ChevronDown size={14} strokeWidth={3} />
                  </span>
                </summary>
                <div className="text-black font-bold text-xs mt-6 leading-8 border-l border-black/20 pl-6 italic">
                  Confectionné d'une main experte dans nos ateliers couture. Nous privilégions des fibres naturelles et des finitions artisanales pour une durabilité exemplaire.
                </div>
              </details>
               <details className="group">
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-[10px] uppercase tracking-[0.2em] text-black">
                  <span>Logistique & Retours</span>
                  <span className="transition duration-500 group-open:rotate-180 text-black">
                    <ChevronDown size={14} strokeWidth={3} />
                  </span>
                </summary>
                <div className="text-black font-bold text-xs mt-6 leading-8 border-l border-black/20 pl-6 italic">
                  Expédition en 48h par nos partenaires logistique haut de gamme. Retours offerts sous 14 jours si la pièce ne vous comblait pas totalement.
                </div>
              </details>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Temporary ChevronDown since I don't want to import it up top and disrupt the flow
function ChevronDown(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
