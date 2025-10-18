'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import Map, {
    FullscreenControl,
    Marker,
    NavigationControl,
    Popup,
    ScaleControl,
    type ViewState,
} from 'react-map-gl/maplibre';
import Supercluster from 'supercluster';
import MapSearch, { type MapFilters } from './MapSearch';

// Represents a collaborator from the database.
interface MapUser {
    id: string;
    longitude: number;
    latitude: number;
    name: string;
    bio: string;
    verificationLevel: 'verified' | 'pending' | 'unverified';
    lastCollaboration?: string | null;
    location?: string | null;
}

// GeoJSON point feature for supercluster
type PointFeature = GeoJSON.Feature<GeoJSON.Point, MapUser>;

// Placeholder data when database is not available
const placeholderUsers: MapUser[] = [
    {
        id: '1',
        longitude: -74.006,
        latitude: 40.7128,
        name: 'John D.',
        bio: 'Fighting the good fight against insurance denials in NYC.',
        verificationLevel: 'verified',
        lastCollaboration: 'Housing Justice Co-op • 2 weeks ago',
    },
    {
        id: '2',
        longitude: -118.2437,
        latitude: 34.0522,
        name: 'Jane S.',
        bio: 'Organizing community bids to buy homes in Los Angeles.',
        verificationLevel: 'pending',
        lastCollaboration: 'Westside Mutual Aid • 5 days ago',
    },
    {
        id: '3',
        longitude: -87.6298,
        latitude: 41.8781,
        name: 'Mike P.',
        bio: 'Tech-for-good advocate building legal defense networks.',
        verificationLevel: 'verified',
        lastCollaboration: 'Illinois Insurance Coalition • 1 month ago',
    },
    {
        id: '4',
        longitude: -122.4194,
        latitude: 37.7749,
        name: 'Sarah M.',
        bio: 'Coordinating group house purchases in SF Bay Area.',
        verificationLevel: 'verified',
        lastCollaboration: 'Bay Area Housing Collective • 3 days ago',
        location: 'San Francisco, CA',
    },
    {
        id: '5',
        longitude: 2.3522,
        latitude: 48.8566,
        name: 'Pierre L.',
        bio: 'Fighting insurance companies across Europe.',
        verificationLevel: 'pending',
        lastCollaboration: 'EU Rights Coalition • 1 week ago',
        location: 'Paris, France',
    },
];

export default function InteractiveMap(): ReactElement {
    const [viewState, setViewState] = useState<ViewState>({
        longitude: -98.5795,
        latitude: 39.8283,
        zoom: 3.25,
        bearing: 0,
        pitch: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    const [popupInfo, setPopupInfo] = useState<MapUser | null>(null);
    const [users, setUsers] = useState<MapUser[]>(placeholderUsers);
    const [allUsers, setAllUsers] = useState<MapUser[]>(placeholderUsers);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<MapFilters>({
        searchQuery: '',
        verificationLevel: 'all',
    });

    const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY || 'YOUR_MAPTILER_KEY';

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/map/users?limit=500');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                if (data.users && data.users.length > 0) {
                    setAllUsers(data.users);
                    setUsers(data.users);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching map users:', err);
                setError('Using placeholder data (database not connected)');
                // Keep placeholder data on error
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...allUsers];

        // Filter by verification level
        if (filters.verificationLevel && filters.verificationLevel !== 'all') {
            filtered = filtered.filter(user => user.verificationLevel === filters.verificationLevel);
        }

        // Filter by search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
                user =>
                    user.name.toLowerCase().includes(query) ||
                    user.bio.toLowerCase().includes(query) ||
                    user.location?.toLowerCase().includes(query)
            );
        }

        setUsers(filtered);
    }, [filters, allUsers]);

    const handleSearch = (_query: string) => {
        // Search is handled by the filter effect
    };

    const handleFilterChange = (newFilters: MapFilters) => {
        setFilters(newFilters);
    };

    // Create supercluster index
    const { supercluster } = useMemo(() => {
        const cluster = new Supercluster<MapUser>({
            radius: 75,
            maxZoom: 20,
            minZoom: 0,
        });

        const geoJsonPoints: PointFeature[] = users.map(user => ({
            type: 'Feature',
            properties: user,
            geometry: {
                type: 'Point',
                coordinates: [user.longitude, user.latitude],
            },
        }));

        cluster.load(geoJsonPoints);

        return { supercluster: cluster, points: geoJsonPoints };
    }, [users]);

    // Get clusters for current viewport
    const clusters = useMemo(() => {
        if (!supercluster || users.length === 0) return [];

        const bounds: [number, number, number, number] = [
            viewState.longitude - 360 / Math.pow(2, viewState.zoom),
            viewState.latitude - 180 / Math.pow(2, viewState.zoom),
            viewState.longitude + 360 / Math.pow(2, viewState.zoom),
            viewState.latitude + 180 / Math.pow(2, viewState.zoom),
        ];

        return supercluster.getClusters(bounds, Math.floor(viewState.zoom));
    }, [supercluster, viewState.longitude, viewState.latitude, viewState.zoom, users.length]);

    const mapStyle = useMemo(
        () => `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapTilerKey}`,
        [mapTilerKey]
    );

    if (mapTilerKey === 'YOUR_MAPTILER_KEY') {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-100">
                <div className="max-w-lg text-center rounded-2xl bg-white p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-red-600">Map configuration required</h2>
                    <p className="mt-3 text-sm text-slate-600">
                        To see the collaboration map you need a MapTiler API key in your <code className="rounded bg-slate-100 px-2 py-0.5">.env</code> file.
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                        Add <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_MAPTILER_KEY="your_key_here"</code> and restart <code className="rounded bg-slate-100 px-1">npm run dev</code>.
                    </p>
                    <a
                        href="https://www.maptiler.com/cloud/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Grab a free MapTiler key
                    </a>
                </div>
            </div>
        );
    }

    const statusColor = (verification: MapUser['verificationLevel']): string => {
        switch (verification) {
            case 'verified':
                return 'bg-emerald-500 shadow-emerald-200';
            case 'pending':
                return 'bg-amber-400 shadow-amber-200';
            default:
                return 'bg-slate-400 shadow-slate-200';
        }
    };

    return (
        <div className="relative h-full w-full">
            {/* Search and Filter Component */}
            <MapSearch
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                currentFilters={filters}
            />

            <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle={mapStyle}
                attributionControl={false}
                maplibreLogo={false}
            >
                <FullscreenControl position="top-right" />
                <NavigationControl position="top-right" />
                <ScaleControl position="bottom-left" />

                {clusters.map((cluster) => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const { cluster: isCluster, point_count: pointCount } = cluster.properties as {
                        cluster?: boolean;
                        point_count?: number;
                        cluster_id?: number;
                    };

                    if (isCluster) {
                        // Render cluster marker
                        return (
                            <Marker
                                key={`cluster-${cluster.id}`}
                                longitude={longitude}
                                latitude={latitude}
                                onClick={(event) => {
                                    event.originalEvent.stopPropagation();

                                    // Get expansion zoom and fly to cluster
                                    const expansionZoom = Math.min(
                                        supercluster.getClusterExpansionZoom(cluster.id as number),
                                        20
                                    );

                                    setViewState({
                                        ...viewState,
                                        longitude,
                                        latitude,
                                        zoom: expansionZoom,
                                    });
                                }}
                            >
                                <div
                                    className="flex h-12 w-12 -translate-y-6 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-white shadow-lg transition-transform hover:scale-110"
                                >
                                    <span className="text-sm font-bold">{pointCount}</span>
                                </div>
                            </Marker>
                        );
                    }

                    // Render individual user marker
                    const user = cluster.properties as MapUser;
                    return (
                        <Marker
                            key={`user-${user.id}`}
                            longitude={longitude}
                            latitude={latitude}
                            onClick={(event) => {
                                event.originalEvent.stopPropagation();
                                setPopupInfo(user);
                            }}
                        >
                            <span
                                className={`inline-flex h-4 w-4 -translate-y-2 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow transition-transform hover:scale-125 ${statusColor(
                                    user.verificationLevel
                                )}`}
                            >
                                <span className="sr-only">Collab user marker</span>
                            </span>
                        </Marker>
                    );
                })}

                {popupInfo && (
                    <Popup
                        focusAfterOpen={false}
                        anchor="top"
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        onClose={() => setPopupInfo(null)}
                        className="font-sans"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-slate-800">{popupInfo.name}</h3>
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${
                                        popupInfo.verificationLevel === 'verified'
                                            ? 'bg-emerald-500'
                                            : popupInfo.verificationLevel === 'pending'
                                            ? 'bg-amber-500'
                                            : 'bg-slate-400'
                                    }`}
                                >
                                    {popupInfo.verificationLevel}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600">{popupInfo.bio}</p>
                            {popupInfo.lastCollaboration && (
                                <p className="text-[11px] font-medium text-slate-500">
                                    Last collaboration: {popupInfo.lastCollaboration}
                                </p>
                            )}
                            <a
                                href="#"
                                className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                View profile →
                            </a>
                        </div>
                    </Popup>
                )}
            </Map>

            <div className="pointer-events-none absolute left-6 top-6 max-w-sm rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    Collaboration heatmap
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Who is organising against the giants?
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Each pulse is a group fighting insurance denials or pooling resources to buy homes together. Zoom in to
                    discover allies, trusted collaborators, and active bids. Click clusters to expand.
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" /> Verified allies
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full bg-amber-400" /> Pending verification
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
                            N
                        </span>
                        Clusters
                    </div>
                </div>
                {error && (
                    <div className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                        ⚠️ {error}
                    </div>
                )}
                {loading && (
                    <div className="mt-3 text-xs text-slate-500">
                        Loading users...
                    </div>
                )}
                <div className="mt-3 text-xs text-slate-500">
                    Showing {users.length} {users.length === 1 ? 'collaborator' : 'collaborators'}
                </div>
            </div>
        </div>
    );
}
