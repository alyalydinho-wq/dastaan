import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-12 h-12 border-4 border-tbm-blue border-t-tbm-red rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Chargement en cours...</p>
    </div>
  );
}
