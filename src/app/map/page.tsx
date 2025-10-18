// src/app/map/page.tsx
'use client';

import InteractiveMap from '@/components/map/InteractiveMap';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapPage() {
  return (
    <div className="h-screen w-screen">
      <InteractiveMap />
    </div>
  );
}
