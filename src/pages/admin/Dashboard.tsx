import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Product } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../../components/Logo';
import { Plus, Trash2, Edit3, Save, X, LogOut, Package, Image as ImageIcon, Tag, LayoutDashboard, Search, Settings, Globe, Eye, EyeOff } from 'lucide-react';

const CATEGORIES = ['Hauts', 'Robes', 'Accessoires', 'Hijab', 'Nouveautés', 'Promotions'];
const BADGES = ['Nouveau', 'Promo', 'Coup de cœur', 'Épuisé', 'Populaire'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, adminUser, logout, adminCredentials, updateAdminCredentials, marqueeOfferText, setMarqueeOfferText } = useStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    email: adminCredentials.email,
    password: adminCredentials.password
  });
  const [showPassword, setShowPassword] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Initial form state
  const initialForm: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    category: 'Hauts',
    images: [''],
    colors: ['Noir'],
    sizes: ['M'],
    inStock: true,
    badges: []
  };

  const [form, setForm] = useState<Partial<Product>>(initialForm);

  if (!adminUser) {
    navigate('/admin/login');
    return null;
  }

  const handleSave = () => {
    if (!form.name || !form.price) return;

    if (isEditing) {
      updateProduct({ ...form, id: isEditing } as Product);
      setIsEditing(null);
    } else {
      addProduct({
        ...form,
        id: 'p' + Date.now(),
        images: form.images?.filter(img => img !== '') || ['https://picsum.photos/seed/default/800/1200'],
        badges: form.badges || [],
      } as Product);
      setIsAdding(false);
    }
    setForm(initialForm);
  };

  const handleEdit = (p: Product) => {
    setForm({ ...p, badges: p.badges || [] });
    setIsEditing(p.id);
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateImageUrl(index, base64String);
    };
    reader.readAsDataURL(file);
  };

  const addImageUrl = () => {
    setForm({ ...form, images: [...(form.images || []), ''] });
  };

  const updateImageUrl = (index: number, value: string) => {
    const newImages = [...(form.images || [])];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
  };

  const removeImageUrl = (index: number) => {
    const newImages = [...(form.images || [])].filter((_, i) => i !== index);
    setForm({ ...form, images: newImages.length ? newImages : [''] });
  };

  const toggleBadge = (badge: string) => {
    const currentBadges = form.badges || [];
    if (currentBadges.includes(badge)) {
      setForm({ ...form, badges: currentBadges.filter(b => b !== badge) });
    } else {
      setForm({ ...form, badges: [...currentBadges, badge] });
    }
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminCredentials(settingsForm);
    setSettingsSuccess(true);
    setTimeout(() => {
      setSettingsSuccess(false);
      setIsSettingsOpen(false);
    }, 1500);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-gray-300 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-white shadow-md">
              <LayoutDashboard size={20} />
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Logo className="h-4 w-auto" />
              <div className="w-[1px] h-3 bg-gray-200" />
              <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">Gestion des Collections</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-gray-300 hover:bg-gray-200 transition-all text-[9px] font-bold uppercase tracking-widest text-gray-600"
            >
              <Globe size={14} />
              <span className="hidden md:inline">Retour au site</span>
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-gray-300 hover:bg-gray-200 transition-all text-[9px] font-bold uppercase tracking-widest text-gray-700"
            >
              <Settings size={14} />
              <span className="hidden md:inline">Paramètres</span>
            </button>

            <div className="w-[1px] h-6 bg-gray-200 mx-2" />

            <button 
              onClick={() => { logout(); navigate('/admin/login'); }}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 transition-all text-[9px] font-bold uppercase tracking-widest"
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-white/95 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-gray-50 p-10 rounded-[50px] border border-gray-300 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            >
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-sans font-bold tracking-tight text-black uppercase italic mb-8">Paramètres Admin</h2>

              <form onSubmit={handleSettingsSave} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-4 italic">Nouvel Email</label>
                  <input 
                    type="email" 
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-full py-4 px-6 text-sm text-black focus:outline-none focus:border-gray-400 transition-all font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-4 italic">Nouveau Mot de Passe</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={settingsForm.password}
                      onChange={(e) => setSettingsForm({...settingsForm, password: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-full py-4 px-6 pr-14 text-sm text-black focus:outline-none focus:border-gray-400 transition-all font-bold"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={settingsSuccess}
                  className={`w-full py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-center justify-center gap-3 ${
                    settingsSuccess 
                      ? 'bg-green-600 text-white' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {settingsSuccess ? (
                    <>
                      <Save size={16} />
                      Modifié avec succès
                    </>
                  ) : (
                    'Enregistrer les modifications'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-sans font-bold tracking-tight text-black uppercase italic">
                  {isEditing ? 'Modifier le Produit' : 'Ajouter une Pièce'}
                </h2>
                {(isEditing || isAdding) && (
                  <button 
                    onClick={() => { setIsEditing(null); setIsAdding(false); setForm(initialForm); }}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-300 shadow-[0_10px_40px_rgba(0,0,0,0.1)] space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-2 italic block mb-2">Nom du Produit</label>
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="ex: Abaya Silk Road"
                    className="w-full bg-white border border-gray-300 rounded-2xl py-4 px-6 text-sm text-black focus:outline-none focus:border-gray-400 transition-all font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-2 italic block mb-2">Prix Normal (€)</label>
                    <input 
                      type="number" 
                      value={form.price}
                      onChange={(e) => setForm({...form, price: parseFloat(e.target.value) || 0})}
                      className="w-full bg-white border border-gray-300 rounded-2xl py-4 px-6 text-sm text-black focus:outline-none focus:border-gray-400 transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-2 italic block mb-2">Prix Promo (€)</label>
                    <input 
                      type="number" 
                      value={form.salePrice || ''}
                      onChange={(e) => setForm({...form, salePrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                      placeholder="Optionnel"
                      className="w-full bg-white border border-gray-300 rounded-2xl py-4 px-6 text-sm text-black focus:outline-none focus:border-gray-400 transition-all font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-2 italic block mb-2">Catégorie</label>
                  <select 
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-2xl py-4 px-6 text-sm text-black focus:outline-none focus:border-gray-400 transition-all font-bold appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-2 italic block">Photos du Produit (Depuis l'ordinateur)</label>
                    <button 
                      onClick={addImageUrl}
                      className="text-black hover:text-black transition-colors bg-brand-gold/10 p-2 rounded-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.images?.map((url, idx) => (
                      <div key={idx} className="relative flex flex-col gap-3">
                        <div className="relative group">
                          {url ? (
                            <div className="w-full h-48 bg-white rounded-2xl overflow-hidden border border-gray-300 relative shadow-inner">
                              <img src={url} className="w-full h-full object-cover" alt="Preview" />
                              <div className="absolute inset-0 bg-gray-100/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                  Changer
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => handleFileChange(idx, e)}
                                  />
                                </label>
                                {form.images!.length > 1 && (
                                  <button 
                                    onClick={() => removeImageUrl(idx)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-400 transition-colors"
                                  >
                                    Supprimer
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <label className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-gray-900/30 hover:bg-white transition-all group">
                              <div className="w-12 h-12 rounded-full bg-brand-gold/5 flex items-center justify-center text-black/40 group-hover:text-gray-500 transition-colors">
                                <ImageIcon size={24} />
                              </div>
                              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-gray-500">Choisir une image</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleFileChange(idx, e)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest mt-4 italic leading-relaxed">
                    Note: Les images sont stockées localement. Évitez les fichiers trop volumineux pour préserver la mémoire du navigateur.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-2 italic block mb-3">Badges Marketing (Multi-sélection)</label>
                  <div className="flex flex-wrap gap-2">
                    {BADGES.map(b => (
                      <button
                        key={b}
                        onClick={() => toggleBadge(b)}
                        className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${
                          form.badges?.includes(b) 
                            ? 'bg-black text-white border-gray-900 shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                            : 'bg-white border-gray-300 text-gray-400 hover:text-black'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-2 italic block mb-2">Description</label>
                  <textarea 
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    rows={4}
                    className="w-full bg-white border border-gray-300 rounded-3xl py-4 px-6 text-xs text-gray-600 focus:outline-none focus:border-gray-400 transition-all font-bold resize-none italic leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                   <button 
                    onClick={handleSave}
                    className="flex-1 bg-black text-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                  >
                    <Save size={16} />
                    {isEditing ? 'Mettre à jour' : 'Enregistrer la pièce'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-7">
            {/* Offer Marquee Editor */}
            <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-300 shadow-[0_10px_40px_rgba(0,0,0,0.1)] mb-12">
               <h2 className="text-xl font-sans font-bold tracking-tight text-black uppercase italic mb-6">Barre d'accueil (Offres)</h2>
               <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 ml-2 italic block">Texte Défilant</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={marqueeOfferText}
                      onChange={(e) => setMarqueeOfferText(e.target.value)}
                      placeholder="ex: GET ONE 50% OFF ✦ ..."
                      className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 px-6 text-sm text-black focus:outline-none focus:border-gray-400 transition-all font-bold"
                    />
                  </div>
                  <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest italic pt-2">
                    Note: Ajoutez un symbole (comme ✦ ou +) entre chaque phrase pour un meilleur effet visuel, et répétez-le plusieurs fois. La modification est sauvegardée instantanément.
                  </p>
               </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-8">
               <div className="relative flex-1 w-full max-w-md">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                  type="text" 
                  placeholder="Rechercher une pièce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-300 rounded-full py-4 pl-14 pr-6 text-xs font-bold text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-all"
                 />
               </div>
               <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-black">
                  {filteredProducts.length} ARTICLES AU TOTAL
               </div>
            </div>

            <div className="space-y-6">
              {filteredProducts.map((p) => (
                <motion.div 
                  layout
                  key={p.id}
                  className="bg-white border border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 rounded-3xl flex items-center gap-8 group transition-all"
                >
                  <div className="w-24 h-32 rounded-2xl overflow-hidden shrink-0 border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                       <span className="text-[9px] uppercase tracking-widest bg-brand-gold/10 text-black px-2 py-0.5 rounded-full border border-gray-900/20 font-bold">{p.category}</span>
                       {p.badges?.map(b => (
                         <span key={b} className="text-[8px] uppercase tracking-widest bg-brand-bordeaux text-white px-2 py-0.5 rounded-full font-bold italic">{b}</span>
                       ))}
                    </div>
                    <h3 className="text-black font-bold uppercase tracking-widest truncate">{p.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-lg font-sans font-bold tracking-tighter ${p.salePrice ? 'text-gray-400 line-through text-sm' : 'text-black'}`}>{p.price.toFixed(2)} €</span>
                      {p.salePrice && <span className="text-lg font-sans font-bold tracking-tighter text-black">{p.salePrice.toFixed(2)} €</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(p)}
                      className="p-4 rounded-2xl bg-white/5 border border-gray-300 text-gray-500 hover:text-black hover:bg-white transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteProduct(p.id)}
                      className="p-4 rounded-2xl bg-red-500/5 border border-gray-300 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-[50px]">
                   <Package size={48} className="mx-auto text-white/5 mb-6" />
                   <p className="text-black font-serif text-2xl italic">Aucun résultat.</p>
                   <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">La collection semble incomplète ou masquée.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
