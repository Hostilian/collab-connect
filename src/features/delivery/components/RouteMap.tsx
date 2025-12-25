// Well, would you look at that. It's a map with a route on it.
import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '300px',
};

interface RouteMapProps {
  readonly pickup: string;
  readonly delivery: string;
  readonly onDistanceUpdate?: (km: number | null) => void;
}

type GoogleMapsAPI = {
  maps: {
    Geocoder: new () => {
      geocode: (
        req: { address: string },
        cb: (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => void
      ) => void
    };
    DirectionsService: new () => {
      route: (
        req: google.maps.DirectionsRequest,
        cb: (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => void
      ) => void
    };
    TravelMode: { DRIVING: google.maps.TravelMode };
  };
};

function getGoogleMaps(): GoogleMapsAPI['maps'] | null {
  const google = (globalThis as typeof globalThis & { google?: GoogleMapsAPI }).google;
  return google?.maps ?? null;
}

export default function RouteMap({ pickup, delivery, onDistanceUpdate }: RouteMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [pickupPos, setPickupPos] = useState<google.maps.LatLng | google.maps.LatLngLiteral | null>(null);
  const [deliveryPos, setDeliveryPos] = useState<google.maps.LatLng | google.maps.LatLngLiteral | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  const fetchDirections = useCallback((
    origin: google.maps.LatLng,
    destination: google.maps.LatLng,
    maps: GoogleMapsAPI['maps']
  ) => {
    const directionsService = new maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        }
      }
    );
  }, []);

  const geocodeDelivery = useCallback((
    geocoder: ReturnType<GoogleMapsAPI['maps']['Geocoder']['prototype']['constructor']>,
    pickupLocation: google.maps.LatLng,
    deliveryAddress: string,
    maps: GoogleMapsAPI['maps']
  ) => {
    geocoder.geocode({ address: deliveryAddress }, (results2: google.maps.GeocoderResult[] | null, status2: google.maps.GeocoderStatus) => {
      if (status2 === 'OK' && results2?.[0]) {
        setDeliveryPos(results2[0].geometry.location);
        fetchDirections(pickupLocation, results2[0].geometry.location, maps);
      }
    });
  }, [fetchDirections]);

  useEffect(() => {
    if (!isLoaded || !pickup || !delivery) return;
    const maps = getGoogleMaps();
    if (!maps) return;
    
    const geocoder = new maps.Geocoder();
    geocoder.geocode({ address: pickup }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        setPickupPos(results[0].geometry.location);
        geocodeDelivery(geocoder, results[0].geometry.location, delivery, maps);
      }
    });
  }, [isLoaded, pickup, delivery, geocodeDelivery]);

  useEffect(() => {
    if (directions?.routes?.[0]) {
      const legs = directions.routes[0].legs;
      if (legs?.[0]?.distance) {
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
