import React from 'react';
import CatalogVehicleCard from './CatalogVehicleCard';
import VehicleListItem from './VehicleListItem';

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

interface VehicleGridProps {
  vehicles: Vehicle[];
  viewMode: 'grid' | 'list';
}

export default function VehicleGrid({ vehicles, viewMode }: VehicleGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {vehicles.map(vehicle => (
          <VehicleListItem key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {vehicles.map(vehicle => (
        <CatalogVehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
