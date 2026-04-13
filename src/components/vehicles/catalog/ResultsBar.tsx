import React from 'react';
import { useSearchParams } from 'react-router-dom';

interface ResultsBarProps {
  count: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export default function ResultsBar({ count, viewMode, setViewMode }: ResultsBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active filters for pills
  const activeFilters: { key: string, label: string, value: string }[] = [];
  
  const addFilter = (key: string, label: string, formatter?: (v: string) => string) => {
    const val = searchParams.get(key);
    if (val && val !== '' && val !== '50000' && val !== '300000') {
      activeFilters.push({ key, label, value: formatter ? formatter(val) : val });
    }
  };

  addFilter('brand', 'Marque');
  addFilter('model', 'Modèle');
  addFilter('type', 'Type');
  addFilter('transmission', 'Boîte');
  addFilter('carrosserie', 'Carrosserie');
  addFilter('couleur', 'Couleur');
  addFilter('prixMax', 'Prix max', (v) => `< ${parseInt(v).toLocaleString('fr-FR')} €`);
  addFilter('kmMax', 'Km max', (v) => `< ${parseInt(v).toLocaleString('fr-FR')} km`);
  
  const carburants = searchParams.getAll('carburant');
  carburants.forEach(c => activeFilters.push({ key: 'carburant', label: 'Carburant', value: c }));

  const removeFilter = (key: string, valueToRemove?: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'carburant' && valueToRemove) {
      const current = newParams.getAll('carburant');
      newParams.delete('carburant');
      current.filter(v => v !== valueToRemove).forEach(v => newParams.append('carburant', v));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const currentSort = searchParams.get('sort') || 'recent';

  const updateSort = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', val);
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-white/10">
      
      {/* Left Side: Count & Pills */}
      <div className="flex flex-col gap-3">
        <h2 className="text-white font-bold text-xl">
          {count} Véhicule{count !== 1 ? 's' : ''}
        </h2>
        
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((f, i) => (
              <span key={`${f.key}-${i}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/12 text-white text-xs rounded-full">
                {f.value}
                <button onClick={() => removeFilter(f.key, f.value)} className="hover:text-[#E02000] transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            ))}
            <button onClick={resetFilters} className="text-[#E02000] text-xs font-medium hover:underline ml-2">
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* Right Side: Sort & View Toggle */}
      <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
        <div className="flex items-center gap-3">
          <label className="text-white/60 text-sm whitespace-nowrap">Trier par :</label>
          <div className="relative">
            <select 
              value={currentSort} 
              onChange={(e) => updateSort(e.target.value)}
              className="bg-[#000045] border border-white/15 text-white text-sm rounded-lg pl-3 pr-8 py-2 outline-none focus:border-[#E02000] transition-colors appearance-none"
            >
              <option value="recent">Plus récent</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
              <option value="km">Kilométrage</option>
            </select>
            <svg className="w-4 h-4 text-white/60 absolute right-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#000045] p-1 rounded-lg border border-white/10">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#E02000] text-white' : 'text-white/50 hover:text-white'}`}
            title="Vue grille"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#E02000] text-white' : 'text-white/50 hover:text-white'}`}
            title="Vue liste"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
