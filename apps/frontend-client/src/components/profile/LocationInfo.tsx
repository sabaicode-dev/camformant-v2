import React from 'react';
import { MapPin } from 'lucide-react';
import { Location } from '@/types/profile';

interface LocationInfoProps {
  location?: Location;
}

export function LocationInfo({ location }: LocationInfoProps) {
  const fullAddress = [location?.address, location?.city, location?.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="flex items-center text-gray-600">
      <MapPin className="w-4 h-4 mr-2" />
      <span>{fullAddress || 'Location not specified'}</span>
    </div>
  );
}