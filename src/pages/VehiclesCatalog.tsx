import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import VehicleFilters from '../components/vehicles/catalog/VehicleFilters';
import ResultsBar from '../components/vehicles/catalog/ResultsBar';
import VehicleGrid from '../components/vehicles/catalog/VehicleGrid';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  images: string[];
  status: string;
  featured?: boolean;
  color?: string;
  createdAt?: string;
  financingAvailable?: boolean;
  views?: number;
}

export default function VehiclesCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    document.title = "Catalogue des véhicules — TBM";

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(searchParams).toString();
        // In a real app, pagination would be handled by the backend
        const response = await fetch(`/api/vehicles?${query}`);
        if (!response.ok) throw new Error('Erreur réseau');
        let data: Vehicle[] = await response.json();
        
        // Client-side sorting based on 'sort' param
        const sort = searchParams.get('sort') || 'recent';
        if (sort === 'prix_asc') data.sort((a, b) => a.price - b.price);
        if (sort === 'prix_desc') data.sort((a, b) => b.price - a.price);
        if (sort === 'km') data.sort((a, b) => a.mileage - b.mileage);
        // 'recent' could sort by ID or a createdAt field if it existed

        setVehicles(data);
        setCurrentPage(1); // Reset to page 1 on filter change
      } catch (err) {
        console.error("Erreur :", err);
        setError("Impossible de charger le catalogue.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]);

  // Pagination logic
  const totalPages = Math.ceil(vehicles.length / itemsPerPage);
  const paginatedVehicles = vehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SkeletonLoader = () => (
    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className={`bg-[#000075] rounded-xl border border-white/10 animate-pulse ${viewMode === 'grid' ? 'h-[380px]' : 'h-[160px]'}`} />
      ))}
    </div>
  );

  return (
    <RootLayout>
      <div className="bg-[#000060] min-h-screen flex flex-col md:flex-row">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-[#000060] sticky top-20 z-40">
          <h1 className="text-white font-display font-black text-xl">Catalogue</h1>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 bg-[#E02000] text-white px-4 py-2 rounded-lg text-sm font-bold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filtres
          </button>
        </div>

        {/* Sidebar (Desktop + Mobile overlay) */}
        <div className={`
          fixed inset-0 z-50 bg-[#000060] md:relative md:bg-transparent md:z-auto transition-transform duration-300
          ${showMobileFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Mobile close button */}
          <div className="md:hidden p-4 flex justify-end border-b border-white/10">
            <button onClick={() => setShowMobileFilters(false)} className="text-white p-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <VehicleFilters />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden min-h-screen">
          <div className="max-w-5xl mx-auto">
            
            <ResultsBar 
              count={vehicles.length} 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
            />

            {loading ? (
              <SkeletonLoader />
            ) : error ? (
              <div className="text-center py-20 bg-[#000075] rounded-xl border border-white/10">
                <p className="text-[#E02000] font-bold">{error}</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-24 bg-[#000075] rounded-xl border border-white/10 flex flex-col items-center">
                <svg className="w-16 h-16 text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Aucun véhicule trouvé</h3>
                <p className="text-white/60 mb-6">Aucun véhicule ne correspond à vos critères actuels.</p>
                <button 
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="bg-[#E02000] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                <VehicleGrid vehicles={paginatedVehicles} viewMode={viewMode} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      Précédent
                    </button>
                    <span className="text-white/60 text-sm">
                      Page <strong className="text-white">{currentPage}</strong> sur {totalPages}
                    </span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </RootLayout>
  );
}
