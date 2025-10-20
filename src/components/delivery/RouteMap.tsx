// Well, would you look at that. It's a map with a route on it.
import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '300px',
};

interface RouteMapProps {
  pickup: string;
  delivery: string;
  onDistanceUpdate?: (km: number | null) => void;
}

// ...existing code...

export default function RouteMap({ pickup, delivery, onDistanceUpdate }: RouteMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [pickupPos, setPickupPos] = useState<google.maps.LatLng | google.maps.LatLngLiteral | null>(null);
  const [deliveryPos, setDeliveryPos] = useState<google.maps.LatLng | google.maps.LatLngLiteral | null>(null);
  // Calculate distance in km from directions
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoaded || !pickup || !delivery) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: pickup }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setPickupPos(results[0].geometry.location);
        geocoder.geocode({ address: delivery }, (results2, status2) => {
          if (status2 === 'OK' && results2 && results2[0]) {
            setDeliveryPos(results2[0].geometry.location);
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
              {
                origin: results[0].geometry.location,
                destination: results2[0].geometry.location,
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === 'OK') {
                  setDirections(result);
                }
              }
            );
          }
        });
      }
    });
  }, [isLoaded, pickup, delivery]);

  useEffect(() => {
    if (directions && directions.routes && directions.routes[0]) {
      const legs = directions.routes[0].legs;
      if (legs && legs[0] && legs[0].distance) {
        const km = legs[0].distance.value / 1000;
        setDistanceKm(km);
        if (onDistanceUpdate) onDistanceUpdate(km);
      } else {
        setDistanceKm(null);
        if (onDistanceUpdate) onDistanceUpdate(null);
      }
    }
  }, [directions, onDistanceUpdate]);

  if (!isLoaded) return <div>Loading map...</div>;
  if (!pickupPos || !deliveryPos) return <div>Enter both addresses to see the route.</div>;

  return (
    <>
      <GoogleMap mapContainerStyle={containerStyle} center={pickupPos} zoom={12}>
        <Marker position={pickupPos} label="A" />
        <Marker position={deliveryPos} label="B" />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      {distanceKm !== null && (
        <div className="mt-2 text-sm text-gray-700">Distance: {distanceKm.toFixed(2)} km</div>
      )}
    </>
  );
}
