// src/app/map/page.tsx
'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import dynamic from 'next/dynamic';

// Dynamically import the map component (heavy dependency)
// This reduces initial bundle size significantly
const InteractiveMap = dynamic(
  () => import('@/components/map/InteractiveMap'),
  {
    loading: () => (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
      </div>
    ),
    ssr: false, // Map requires browser APIs
  }
);

export default function MapPage() {
  return (
    <div className="h-screen w-screen">
      <InteractiveMap />
    </div>
  );
}
