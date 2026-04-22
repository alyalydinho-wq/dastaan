import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Plus } from 'lucide-react';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import { Logo } from '../components/Logo';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const allProducts = useStore((state) => state.products);
  const marqueeOfferText = useStore((state) => state.marqueeOfferText);
  
  const categories = ['ALL', 'HAUTS', 'ROBES', 'ACCESSOIRES', 'HIJAB', 'NOUVEAUTÉS', 'PROMOTIONS'];
  
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];
    if (activeCategory === 'NOUVEAUTÉS') return products.filter(p => p.isNew || p.badges?.includes('Nouveau'));
    if (activeCategory === 'COUP DE CŒUR') return products.filter(p => p.isPopular || p.badges?.includes('Coup de cœur'));
    if (activeCategory === 'PROMOTIONS') return products.filter(p => p.salePrice !== undefined || p.badges?.includes('Promo'));
    if (activeCategory !== 'ALL') return products.filter(p => p.category.toUpperCase() === activeCategory);
    return products.slice(0, 6); // Default 6 products
  }, [activeCategory, allProducts]);

  return (
    <div className="w-full bg-brand-bordeaux overflow-hidden">
      {/* ... Hero Section ... */}
      <section className="relative min-h-[50vh] sm:min-h-[400px] md:min-h-[700px] w-full bg-brand-bordeaux overflow-hidden flex items-end pt-12 md:pt-0 pb-0">
        {/* Massive Background Text */}
        <div className="absolute inset-x-0 top-12 md:top-10 flex flex-col items-center justify-start pointer-events-none opacity-[0.35] md:opacity-[0.2] overflow-hidden z-0">
          <Logo className="w-[150vw] sm:w-[150vw] md:w-[120vw] max-w-none h-auto -translate-y-2 md:-translate-y-24" />
        </div>

        {/* Hero Background Image - Subtle Texture/Gradient */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-brand-bordeaux to-transparent z-0"></div>

        {/* Model and Main Content Container */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 flex justify-center items-end mt-4 md:mt-10">
          {/* Middle Column: Model Images */}
          <div className="flex justify-center items-end relative gap-x-4 md:gap-x-12 w-full">
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="relative w-[45%] md:w-[45%] max-w-[400px] flex justify-end z-10"
            >
               <img 
                 src="/perfectgirl-1.webp" 
                 alt="Dastaan Model Left" 
                 className="w-full h-auto object-contain relative pointer-events-none drop-shadow-xl opacity-95 scale-[1.1] md:scale-110 origin-bottom"
                />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="relative w-[45%] md:w-[45%] max-w-[400px] flex justify-start z-10"
            >
               <img 
                 src="/femme-voilee.webp" 
                 alt="Dastaan Model Right" 
                 className="w-full h-auto object-contain relative pointer-events-none drop-shadow-xl opacity-95 scale-[1.1] md:scale-110 origin-bottom"
                />
            </motion.div>
          </div>
        </div>
      </section>

      {marqueeOfferText && (
        <section className="w-full bg-[#b81212] text-brand-bordeaux py-2 overflow-hidden border-b border-white/5 whitespace-nowrap flex items-center relative z-30">
          <div className="animate-marquee flex inline-flex text-[11px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-sans font-medium">
            <span className="mx-4">{marqueeOfferText}</span>
            <span className="mx-4">{marqueeOfferText}</span>
            <span className="mx-4">{marqueeOfferText}</span>
            <span className="mx-4">{marqueeOfferText}</span>
          </div>
        </section>
      )}

      {/* Collection Grid Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="mb-12 space-y-4">
           <p className="text-sm font-sans text-brand-gray">/ Découvrez nos pièces</p>
           <h2 className="text-4xl md:text-5xl font-serif text-brand-offwhite tracking-tight">Notre sélection</h2>
           
           <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 pb-4">
              {categories.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`relative text-[10px] sm:text-xs font-sans uppercase tracking-[0.15em] transition-all duration-300 pb-1 ${activeCategory === cat ? 'text-brand-offwhite' : 'text-brand-gray hover:text-brand-dark'}`}
                >
                  {cat === 'ALL' ? 'Toutes les pièces' : cat}
                  {activeCategory === cat && (
                    <motion.div layoutId="activeTabBadge" className="absolute left-0 right-0 bottom-0 h-px bg-brand-offwhite" />
                  )}
                </button>
              ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredProducts.map((product, i) => (
             <motion.div 
               key={product.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
             >
                <ProductCard product={product} />
             </motion.div>
           ))}
        </div>
        
        {filteredProducts.length === 0 && (
           <div className="text-center py-20 text-brand-beige/20 italic font-bold uppercase tracking-widest text-[10px]">
              Aucune pièce trouvée dans cette sélection.
           </div>
        )}

        <div className="mt-16 flex justify-center">
            <Link to="/shop" className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-beige border-b border-brand-gold/40 pb-1 hover:text-brand-gold transition-colors">
               Voir toute la boutique
            </Link>
        </div>
      </section>

      {/* ... rest of sections ... */}


      {/* Craftsmanship Section */}
      <section className="bg-brand-bordeaux-deep py-16 overflow-hidden border-y border-brand-dark/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div className="space-y-8 order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight leading-tight text-brand-offwhite">L'art de l'artisanat</h2>
              
              <div className="space-y-6">
                 {[
                   { label: '01', title: 'Design & développement', text: 'Nos créations naissent d\'une fusion entre traditions séculaires et esthétique contemporaine.' },
                   { label: '02', title: 'Confiance & qualité', text: 'Chaque pièce est méticuleusement vérifiée pour garantir une finition irréprochable.' },
                   { label: '03', title: 'Contrôle artisanal', text: 'Un artisanat d\'excellence qui sublime chaque silhouette.' },
                 ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                       <div className="w-10 h-10 rounded-full border border-brand-dark/10 flex items-center justify-center text-sm font-sans shrink-0 transition-all duration-500 group-hover:bg-brand-dark group-hover:text-brand-bordeaux group-hover:border-brand-dark text-brand-dark/60">
                          {item.label}
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-md font-serif text-brand-offwhite group-hover:text-brand-dark transition-colors">{item.title}</h4>
                          <p className="text-brand-gray text-sm font-sans mt-1 leading-relaxed max-w-sm">{item.text}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <Link to="/shop" className="inline-flex items-center space-x-3 bg-brand-dark text-brand-bordeaux px-6 py-3 rounded-full group hover:bg-brand-offwhite transition-all duration-300 shadow-xl">
                <span className="text-sm font-sans font-medium">Découvrir le processus <span className="ml-2 transition-transform group-hover:translate-x-1 inline-block">→</span></span>
              </Link>
           </div>

           <div className="order-1 lg:order-2 flex justify-center relative">
              <div className="relative w-full max-w-md">
                 <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800" className="w-full rounded-[60px] aspect-[4/5] object-cover shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10" />
                 <div className="absolute top-1/2 -right-6 w-20 h-20 bg-brand-dark border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                    <Play size={20} className="text-brand-gold fill-brand-gold ml-1" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-brand-bordeaux py-16 border-t border-brand-dark/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
           <span className="text-sm font-sans text-brand-gray mb-6">/ Reflections d'excellence</span>
           
           <div className="relative max-w-xl text-center space-y-6 group">
              <div className="absolute -top-4 -left-6 text-brand-dark opacity-5 transform scale-[3]">"</div>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-dark tracking-tight leading-relaxed">
                 "Une collection qui allie modestie et avant-garde. Dastaan a su capturer l'essence de la femme moderne tout en honorant nos traditions."
              </h3>
              
              <div className="flex flex-col items-center space-y-2 pt-4">
                 <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-dark/10">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover grayscale opacity-80" />
                 </div>
                 <div>
                    <p className="text-brand-dark text-sm font-sans font-medium">Éléonore K.</p>
                    <div className="flex justify-center gap-1 text-brand-dark/40 mt-1">
                       {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Pre-Footer Section - Large Urban Vibes */}
      <section className="bg-brand-dark py-32 flex flex-col items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&q=80&w=2000" 
               alt="Fashion Lifestyle" 
               className="w-full h-full object-cover" 
             />
             <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 via-black/40 to-black/80"></div>
         </div>

         <div className="absolute inset-0 opacity-[0.07] flex items-center justify-center pointer-events-none z-10">
            <Logo className="w-full h-auto min-w-[120vw]" white />
         </div>
         <div className="relative z-20 text-center space-y-6 px-4">
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight drop-shadow-lg">Élevez votre quotidien.</h2>
            <div className="flex justify-center gap-8 text-[11px] text-white/70 uppercase tracking-widest font-sans font-bold drop-shadow-md">
               <span>Est. 2026</span>
               <span className="w-1 h-1 rounded-full bg-brand-gold/50 my-auto"></span>
               <span>Maison de couture</span>
            </div>
         </div>
      </section>
    </div>
  );
}


