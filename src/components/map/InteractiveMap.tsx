'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  label?: string
  type?: 'pickup' | 'delivery' | 'courier'
}

export interface InteractiveMapProps {
  readonly center?: [number, number]
  readonly zoom?: number
  readonly markers?: MapMarker[]
  readonly onMarkerClick?: (marker: MapMarker) => void
  readonly onMapClick?: (lat: number, lng: number) => void
  readonly className?: string
}

export default function InteractiveMap({
  center = [14.4378, 50.0755], // Prague default
  zoom = 12,
  markers = [],
  onMarkerClick,
  onMapClick,
  className = '',
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Use OpenStreetMap tiles (free, no API key needed)
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: [center[0], center[1]],
      zoom,
    })

    map.current.on('load', () => {
      setLoaded(true)
    })

    map.current.on('click', (e) => {
      if (onMapClick) {
        onMapClick(e.lngLat.lat, e.lngLat.lng)
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [center, zoom, onMapClick])

  // Handle markers
  useEffect(() => {
    if (!map.current || !loaded) return

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    // Add new markers
    markers.forEach((marker) => {
      const el = document.createElement('div')
      el.className = 'marker'
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.borderRadius = '50%'
      el.style.cursor = 'pointer'

      // Color by type
      const colors = {
        pickup: '#22c55e',
        delivery: '#ef4444',
        courier: '#3b82f6',
      }
      el.style.backgroundColor = colors[marker.type || 'courier']

      const m = new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current!)

      if (marker.label) {
        m.setPopup(new maplibregl.Popup().setText(marker.label))
      }

      if (onMarkerClick) {
        el.addEventListener('click', () => onMarkerClick(marker))
      }

      markersRef.current.push(m)
    })
  }, [markers, loaded, onMarkerClick])

  return (
    <div
      ref={mapContainer}
      className={`w-full h-full min-h-[300px] ${className}`}
      data-testid="interactive-map"
    />
  )
}
