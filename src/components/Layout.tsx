import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ShoppingBag, Heart, Menu, Search, X, User, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, wishlist, removeFromCart, updateQuantity } = useStore();
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const navLinks = [
    { name: 'Hauts', path: '/shop?category=Hauts' },
    { name: 'Robes', path: '/shop?category=Robes' },
    { name: 'Accessoires', path: '/shop?category=Accessoires' },
    { name: 'Hijab', path: '/shop?category=Hijab' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bordeaux selection:bg-brand-gold selection:text-brand-dark">
      {/* Top Bar */}
      <div className="bg-black text-white text-[10px] text-center py-2 px-4 font-sans tracking-[0.3em] uppercase border-b border-white/5 flex items-center justify-center gap-3">
        <span>Livraison offerte dès 150€ • Code: DASTAAN 20 (-20%)</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-bordeaux border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button onClick={() => setIsMenuOpen(true)} className="text-brand-beige p-2">
                <Menu size={24} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center md:flex-1">
              <Link to="/" className="flex items-center group">
                <Logo className="h-14 md:h-20 w-auto transition-transform group-hover:scale-105" />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-12 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-beige">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="hover:text-brand-gold transition-colors">
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center justify-end md:flex-1 space-x-2 sm:space-x-4">
              <button className="text-brand-beige hover:text-brand-gold transition-colors hidden sm:block p-2">
                <Search size={18} strokeWidth={2.5} />
              </button>
              <button className="text-brand-beige hover:text-brand-gold transition-colors hidden sm:block p-2">
                <User size={18} strokeWidth={2.5} />
              </button>
              <Link to="/wishlist" className="text-brand-beige hover:text-brand-gold transition-colors relative p-2">
                <Heart size={18} strokeWidth={2.5} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[8px] font-bold leading-none text-brand-dark bg-brand-gold rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-brand-beige hover:text-brand-gold transition-colors relative p-2"
              >
                <ShoppingBag size={18} strokeWidth={2.5} />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[8px] font-bold leading-none text-brand-dark bg-brand-gold rounded-full shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <div className="hidden lg:flex items-center pl-4 ml-2 border-l border-white/10 space-x-3">
                <a 
                  href="https://www.instagram.com/dastaan_com?igsh=MWRwbWNveTQ2NzNmcw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-beige hover:text-brand-gold transition-colors"
                >
                  <Instagram size={18} strokeWidth={2.5} />
                </a>
                <a 
                  href="https://www.facebook.com/share/1HuirAv9rN/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-beige hover:text-brand-gold transition-colors"
                >
                  <Facebook size={18} strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-brand-bordeaux-deep"
          >
            <div className="flex justify-between items-center p-6 border-b border-black/5">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Logo className="h-8" />
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-brand-beige hover:text-brand-gold">
                <X size={24} />
              </button>
            </div>
            <div className="px-6 py-8 space-y-6 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-serif text-brand-offwhite border-b border-white/5 pb-4 hover:text-brand-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-8 flex space-x-6 text-brand-beige">
                <Search size={24} strokeWidth={1.5} />
                <User size={24} strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-brand-bordeaux-deep shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
                <h2 className="text-xl font-serif text-brand-offwhite uppercase tracking-widest italic">Votre Panier <span className="text-sm not-italic opacity-40 ml-2">({cartItemsCount})</span></h2>
                <button onClick={() => setIsCartOpen(false)} className="text-brand-beige hover:text-brand-gold">
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-brand-beige/20">
                    <ShoppingBag size={64} strokeWidth={0.5} className="mb-6 opacity-30 text-brand-gold" />
                    <p className="uppercase tracking-[0.2em] text-[10px] font-bold text-brand-beige">Votre écrin est vide</p>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/shop');
                      }}
                      className="mt-8 bg-brand-gold text-brand-dark px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-beige transition-all duration-300 shadow-xl rounded-full"
                    >
                      Découvrir nos pièces
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item, index) => (
                      <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`} className="flex gap-6 animate-fade-in group">
                        <div className="w-24 h-32 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 relative">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 flex flex-col pt-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-[11px] font-bold text-brand-offwhite uppercase tracking-widest leading-relaxed max-w-[150px]">{item.product.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                              className="text-white/20 hover:text-brand-gold transition-colors"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                          </div>
                          <p className="text-brand-gold text-xs font-bold mt-2">{item.product.price.toFixed(2)} €</p>
                          <div className="text-[9px] text-white/40 uppercase tracking-widest mt-2 font-bold flex flex-col gap-1">
                            <span>Nuance: {item.selectedColor}</span>
                            <span>Taille: {item.selectedSize}</span>
                          </div>
                          
                          <div className="mt-4 flex items-center border border-white/10 w-max bg-white/5 rounded-full overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center text-brand-beige hover:text-brand-gold"
                            >-</button>
                            <span className="w-8 flex justify-center text-[10px] font-bold text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-brand-beige hover:text-brand-gold"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-white/5 bg-white/5 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                      <span className="text-white/40 font-bold">Sous-total</span>
                      <span className="font-bold text-brand-offwhite">{cartTotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                      <span className="text-white/40 font-bold">Expédition</span>
                      <span className="text-brand-gold font-bold italic">Offerte</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center mb-6">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-offwhite">Total Estimé</span>
                    <span className="text-xl font-bold text-brand-gold tracking-tighter">{cartTotal.toFixed(2)} €</span>
                  </div>

                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full bg-brand-gold text-brand-dark py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-beige transition-all duration-500 shadow-2xl active:scale-[0.98] rounded-full"
                  >
                    Valider la commande
                  </button>
                  <div className="flex flex-col items-center gap-2 opacity-20 mt-4">
                    <span className="text-[9px] uppercase tracking-widest font-bold italic">⭐ Transactions 100% sécurisées via</span>
                    <Logo className="h-2 w-auto" white />
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-20">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="mb-8 inline-block mt-[-10px]">
                <Logo className="h-16 md:h-20 w-auto" white />
              </Link>
              <p className="text-white/20 text-[10px] leading-relaxed font-bold mb-8 uppercase tracking-[0.2em] italic max-w-[250px]">
                L'Art de l'excellence redéfini. Chaque pièce raconte une histoire d'élégance éternelle pour la vie moderne.
              </p>
            </div>
            
            <div>
              <h4 className="text-brand-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-8 italic">Collections</h4>
              <ul className="space-y-4 text-[10px] text-white/30 font-bold tracking-widest uppercase italic">
                <li><Link to="/shop?category=Hauts" className="hover:text-white transition-colors">Hauts</Link></li>
                <li><Link to="/shop?category=Robes" className="hover:text-white transition-colors">Robes</Link></li>
                <li><Link to="/shop?category=Accessoires" className="hover:text-white transition-colors">Accessoires</Link></li>
                <li><Link to="/shop?category=Hijab" className="hover:text-white transition-colors">Hijab</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-brand-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-8 italic">Assistance</h4>
              <ul className="space-y-4 text-[10px] text-white/30 font-bold tracking-widest uppercase italic">
                <li><a href="#" className="hover:text-white transition-colors">Questions fréquentes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Expédition Directe</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guide des tailles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nous contacter</a></li>
              </ul>
              
              <div className="mt-8 opacity-70">
                <span className="text-[9px] uppercase tracking-widest font-bold text-white/50 block mb-3">TROUVEZ-NOUS SUR</span>
                <div className="flex items-center gap-4">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors" title="Suivez-nous sur Instagram">
                    <Instagram size={18} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors" title="Suivez-nous sur Facebook">
                    <Facebook size={18} />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-brand-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-8 italic">Newsletter</h4>
              <p className="text-white/20 text-[10px] mb-6 leading-relaxed font-bold uppercase tracking-widest italic">Inscrivez-vous pour des avant-premières exclusives et -20% sur votre commande.</p>
              <form className="flex border-b border-white/10 pb-2 group focus-within:border-brand-gold transition-colors">
                <input 
                  type="email" 
                  placeholder="VOTRE EMAIL" 
                  className="w-full bg-transparent border-none py-2 text-[10px] text-white placeholder-white/10 focus:outline-none font-bold uppercase tracking-widest italic"
                />
                <button type="submit" className="text-brand-gold hover:text-white uppercase tracking-widest text-[9px] font-bold px-4 transition-colors">
                  S'inscrire
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium">
            <p>&copy; {new Date().getFullYear()} Dastaan — Maison de Modestie. Tous droits réservés.</p>
            <div className="flex flex-col md:flex-row items-center gap-10 mt-8 md:mt-0">
              <div className="flex space-x-10">
                <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
                <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              </div>
              <Link to="/admin/login" className="flex items-center gap-2 text-brand-gold/60 hover:text-brand-gold transition-colors font-bold group">
                <div className="w-[1px] h-3 bg-white/10 hidden md:block" />
                <User size={12} className="group-hover:scale-110 transition-transform" />
                <span style={{ borderColor: '#ec1616', color: '#8b7906' }}>Admin / Espace Pro</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
