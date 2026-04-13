import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function VehicleFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to update URL params
  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const current = newParams.getAll(key);
    if (current.includes(value)) {
      newParams.delete(key);
      current.filter(v => v !== value).forEach(v => newParams.append(key, v));
    } else {
      newParams.append(key, value);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Current values
  const currentBrand = searchParams.get('brand') || '';
  const currentModel = searchParams.get('model') || '';
  const currentTransmission = searchParams.get('transmission') || '';
  const currentAnneeMin = searchParams.get('anneeMin') || '';
  const currentAnneeMax = searchParams.get('anneeMax') || '';
  const currentCouleur = searchParams.get('couleur') || '';
  const currentPrixMax = searchParams.get('prixMax') || '100000';
  const currentKmMax = searchParams.get('kmMax') || '300000';
  const currentCarburants = searchParams.getAll('carburant');

  const AccordionSection = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className="border-b border-white/10 py-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-white font-bold text-sm uppercase tracking-wider mb-2"
        >
          {title}
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && <div className="mt-4 space-y-4">{children}</div>}
      </div>
    );
  };

  const selectClasses = "w-full bg-[#000045] border border-white/15 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#E02000] transition-colors appearance-none";
  const inputClasses = "w-full bg-[#000045] border border-white/15 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#E02000] transition-colors placeholder-white/30";

  return (
    <div className="w-full md:w-[240px] shrink-0 bg-[#000075] h-full md:min-h-screen p-5 border-r border-white/10 flex flex-col overflow-y-auto custom-scrollbar">
      
      <AccordionSection title="Véhicule">
        <div>
          <label className="block text-white/60 text-xs mb-1.5">Marque</label>
          <div className="relative">
            <select value={currentBrand} onChange={(e) => updateFilter('brand', e.target.value)} className={selectClasses}>
              <option value="">Toutes les marques</option>
              <option value="Audi">Audi</option>
              <option value="BMW">BMW</option>
              <option value="Citroën">Citroën</option>
              <option value="Dacia">Dacia</option>
              <option value="Fiat">Fiat</option>
              <option value="Ford">Ford</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Kia">Kia</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Mini">Mini Cooper</option>
              <option value="Nissan">Nissan</option>
              <option value="Peugeot">Peugeot</option>
              <option value="Porsche">Porsche</option>
              <option value="Renault">Renault</option>
              <option value="Toyota">Toyota</option>
              <option value="Volkswagen">Volkswagen</option>
            </select>
            <svg className="w-4 h-4 text-white/60 absolute right-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Modèle</label>
          <input 
            type="text" 
            placeholder="Ex: Clio, 3008, X5..." 
            value={currentModel} 
            onChange={(e) => updateFilter('model', e.target.value)} 
            className={inputClasses} 
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Transmission</label>
          <div className="relative">
            <select value={currentTransmission} onChange={(e) => updateFilter('transmission', e.target.value)} className={selectClasses}>
              <option value="">Toutes</option>
              <option value="Manuelle">Manuelle</option>
              <option value="Automatique">Automatique</option>
            </select>
            <svg className="w-4 h-4 text-white/60 absolute right-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Année</label>
          <div className="flex gap-2">
            <input type="number" placeholder="De" value={currentAnneeMin} onChange={(e) => updateFilter('anneeMin', e.target.value)} className={inputClasses} />
            <input type="number" placeholder="À" value={currentAnneeMax} onChange={(e) => updateFilter('anneeMax', e.target.value)} className={inputClasses} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Couleur">
        <div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Blanc', hex: '#FFFFFF' },
              { name: 'Noir', hex: '#000000' },
              { name: 'Gris', hex: '#9CA3AF' },
              { name: 'Rouge', hex: '#EF4444' },
              { name: 'Bleu', hex: '#3B82F6' },
              { name: 'Vert', hex: '#10B981' },
              { name: 'Beige', hex: '#D4D4D8' },
            ].map(color => (
              <button
                key={color.name}
                onClick={() => updateFilter('couleur', currentCouleur === color.name ? null : color.name)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${currentCouleur === color.name ? 'border-[#E02000] scale-110' : 'border-white/20 hover:scale-110'}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Budget & Kilométrage">
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-white/60">Prix max</span>
            <span className="text-white font-bold">{currentPrixMax === '100000' ? 'Max' : `${parseInt(currentPrixMax).toLocaleString('fr-FR')} €`}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100000" 
            step="1000"
            value={currentPrixMax}
            onChange={(e) => updateFilter('prixMax', e.target.value === '100000' ? null : e.target.value)}
            className="w-full accent-[#E02000] h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-white/60">Kilométrage max</span>
            <span className="text-white font-bold">{currentKmMax === '300000' ? 'Max' : `${parseInt(currentKmMax).toLocaleString('fr-FR')} km`}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="300000" 
            step="5000"
            value={currentKmMax}
            onChange={(e) => updateFilter('kmMax', e.target.value === '300000' ? null : e.target.value)}
            className="w-full accent-[#E02000] h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </AccordionSection>

      <AccordionSection title="Carburant">
        <div className="space-y-2">
          {['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'].map(fuel => {
            const isChecked = currentCarburants.includes(fuel);
            return (
              <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#E02000] border-[#E02000]' : 'bg-[#000045] border-white/20 group-hover:border-white/40'}`}>
                  {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">{fuel}</span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isChecked} 
                  onChange={() => toggleArrayFilter('carburant', fuel)} 
                />
              </label>
            );
          })}
        </div>
      </AccordionSection>

      <div className="mt-8 mb-4">
        <button 
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-transparent border border-white/30 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Réinitialiser les filtres
        </button>
      </div>

    </div>
  );
}
