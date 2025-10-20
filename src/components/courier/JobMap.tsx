// Well, here's a map. Shows all the jobs. If you see a pin, that's a job. If you don't, well, that's not my fault.
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem',
  marginBottom: '1rem',
};

// Mock job locations (normally you'd get these from the backend)
const mockJobLocations = [
  { id: 1, lat: 50.081, lng: 14.426, label: 'Prague Job' },
  { id: 2, lat: 52.522, lng: 13.413, label: 'Berlin Job' },
  { id: 3, lat: 41.036, lng: 28.985, label: 'Istanbul Job' },
];

export default function JobMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: 50.081, lng: 14.426 }}
      zoom={4}
    >
      {mockJobLocations.map(job => (
        <Marker key={job.id} position={{ lat: job.lat, lng: job.lng }} label={job.label} />
      ))}
    </GoogleMap>
  );
}
