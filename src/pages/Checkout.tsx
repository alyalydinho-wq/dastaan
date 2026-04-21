import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { Logo } from '../components/Logo';

export default function Checkout() {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const cartTotal = cart.reduce((acc, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);
  const shipping = cartTotal > 150 ? 0 : 9.90;
  const total = cartTotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for checkout
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, total })
      });
      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId);
        setIsSuccess(true);
        clearCart();
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-bordeaux">
        <CheckCircle2 size={64} className="text-brand-gold mb-6 animate-pulse" />
        <h1 className="text-4xl font-sans font-bold tracking-tighter text-brand-offwhite mb-2 text-center uppercase italic">Merci pour votre commande</h1>
        <p className="text-brand-beige/50 mb-8 text-center max-w-md text-[10px] uppercase font-bold tracking-widest italic">
          Votre commande n° <span className="font-mono text-brand-gold">{orderId}</span> a été confirmée. 
          Un email récapitulatif vous a été envoyé.
        </p>
        <Link 
          to="/shop" 
          className="bg-brand-gold text-brand-dark px-10 py-4 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-beige transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          Continuer vos achats
        </Link>
      </div>
    );
  }

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-sans font-bold tracking-tighter text-brand-gold uppercase italic mb-8">Votre panier est vide</h2>
        <button onClick={() => navigate('/shop')} className="bg-brand-gold text-brand-dark px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-beige transition-all shadow-2xl">
          Retour à la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <Link to="/shop" className="inline-flex items-center text-[10px] uppercase tracking-widest text-brand-beige/40 hover:text-brand-gold mb-8 font-bold">
        <ArrowLeft size={16} className="mr-2" /> Retour
      </Link>

      <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tighter text-brand-offwhite mb-12 uppercase italic">Paiement Sécurisé</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Contact */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold border-b border-white/5 pb-2 mb-6 italic">Contact</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">Email</label>
                  <input required type="email" id="email" className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold border-b border-white/5 pb-2 mb-6 italic">Livraison</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="firstName" className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">Prénom</label>
                  <input required type="text" id="firstName" className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">Nom</label>
                  <input required type="text" id="lastName" className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">Adresse</label>
                  <input required type="text" id="address" className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">Code Postal</label>
                  <input required type="text" id="postalCode" className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">Ville</label>
                  <input required type="text" id="city" className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="country" className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">Pays</label>
                  <select required id="country" className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige focus:outline-none focus:border-brand-gold transition-colors appearance-none rounded-none cursor-pointer">
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="MA">Maroc</option>
                    <option value="DZ">Algérie</option>
                    <option value="AE">Émirats Arabes Unis</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Payment Section (Simulated Stripe) */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold border-b border-white/5 pb-2 mb-6 flex items-center italic">
                Paiement <Lock size={16} className="ml-2 text-brand-gold opacity-50" />
              </h2>
              <div className="bg-brand-bordeaux-deep p-8 rounded-3xl border border-white/5 text-[9px] text-brand-beige/40 font-bold uppercase tracking-widest mb-6 flex flex-col items-center justify-center text-center italic leading-relaxed">
                <Lock size={24} className="mb-4 text-brand-gold opacity-30" />
                <div className="flex flex-col items-center gap-2">
                  <p>Environnement de test. Vos données sont cryptées en AES-256 via</p>
                  <Logo className="h-4 w-auto brightness-75" white />
                  <p>(Simulation Stripe).</p>
                </div>
              </div>
              <div className="space-y-4 opacity-30 pointer-events-none">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">Numéro de carte</label>
                  <input type="text" value="•••• •••• •••• 4242" readOnly className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">Expire le</label>
                    <input type="text" value="12/26" readOnly className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-brand-beige/40 mb-2 font-bold italic">CVC</label>
                    <input type="text" value="•••" readOnly className="w-full border-b border-white/10 p-4 text-xs font-bold bg-transparent text-brand-beige" />
                  </div>
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-7 text-[11px] font-bold uppercase tracking-[0.3em] rounded-full transition-all duration-700 flex justify-center items-center shadow-2xl ${isSubmitting ? 'bg-brand-bordeaux-deep text-brand-beige/20 cursor-not-allowed border border-white/5' : 'bg-brand-gold text-brand-dark hover:bg-brand-beige shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:shadow-[0_30px_60px_rgba(212,175,55,0.35)]'}`}
            >
              {isSubmitting ? (
                 <div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
              ) : (
                `CONFIRMER LE PAIEMENT - ${total.toFixed(2)} €`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-brand-bordeaux-deep border border-white/5 p-8 lg:p-10 rounded-3xl sticky top-28 shadow-2xl">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-10 italic">Récapitulatif</h2>
            
            <div className="space-y-6 mb-10 max-h-96 overflow-y-auto pr-4 hide-scrollbar">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-20 h-24 bg-brand-dark flex-shrink-0 rounded-2xl overflow-hidden border border-white/5">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover grayscale-[0.2]" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-[11px] font-bold text-brand-offwhite uppercase tracking-widest line-clamp-2">{item.product.name}</h3>
                    <p className="text-[9px] text-brand-gold font-bold uppercase tracking-[0.2em] italic">{item.selectedColor} — {item.selectedSize}</p>
                    <p className="text-[10px] text-brand-beige/40 font-bold uppercase italic">Qté: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-brand-offwhite">
                    {((item.product.salePrice ?? item.product.price) * item.quantity).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-[10px] uppercase font-bold tracking-widest border-t border-white/10 pt-8 italic text-brand-beige/40">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="text-brand-offwhite font-sans text-xs">{(cartTotal).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-brand-gold font-sans text-xs uppercase">{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xl font-sans font-bold text-brand-gold pt-8 mt-8 border-t border-white/10">
              <span className="text-[11px] uppercase tracking-[0.4em] italic font-bold">Total</span>
              <span className="tracking-tighter">{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
