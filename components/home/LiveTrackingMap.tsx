'use client';
import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';

// Simulated location updates
const getSimulatedLocation = (index: number) => {
  const path = [
    { lat: 26.2183, lng: 78.1828 }, // Start
    { lat: 26.2200, lng: 78.1850 },
    { lat: 26.2250, lng: 78.1900 },
    { lat: 26.2300, lng: 78.1950 }, // End (Dest)
  ];
  return path[index % path.length];
};

export default function LiveTrackingMap({ status }: { status: string }) {
  const [location, setLocation] = useState(getSimulatedLocation(0));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (status !== 'OUT_FOR_DELIVERY') return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev < 3 ? prev + 1 : prev));
      setLocation(getSimulatedLocation(index + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [status, index]);

  if (status !== 'OUT_FOR_DELIVERY') return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-5">
      <h2 className="font-semibold text-secondary mb-4 text-sm flex items-center gap-2">
        <Truck size={16} className="text-primary" /> Live Delivery Tracking
      </h2>
      <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-200" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg">
          <Truck size={24} />
        </div>
        <p className="text-xs text-muted absolute bottom-2 bg-white/80 px-2 py-1 rounded">
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      </div>
    </div>
  );
}
