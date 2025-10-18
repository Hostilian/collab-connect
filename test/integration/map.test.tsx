import InteractiveMap from '@/components/map/InteractiveMap';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock maplibre-gl
vi.mock('maplibre-gl', () => ({
  Map: vi.fn(() => ({
    on: vi.fn(),
    remove: vi.fn(),
    addControl: vi.fn(),
    getCanvas: vi.fn(() => ({
      style: {},
    })),
  })),
  NavigationControl: vi.fn(),
  GeolocateControl: vi.fn(),
}));

// Mock react-map-gl
vi.mock('react-map-gl', () => ({
  Map: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-map">{children}</div>
  ),
  NavigationControl: () => <div data-testid="navigation-control" />,
  GeolocateControl: () => <div data-testid="geolocate-control" />,
  Marker: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('InteractiveMap Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the map component', () => {
    const { getByTestId } = render(<InteractiveMap />);
    expect(getByTestId('mock-map')).toBeInTheDocument();
  });

  it('should render map controls', () => {
    const { getByTestId } = render(<InteractiveMap />);
    expect(getByTestId('navigation-control')).toBeInTheDocument();
    expect(getByTestId('geolocate-control')).toBeInTheDocument();
  });

  it('should initialize with default viewport settings', async () => {
    const { container } = render(<InteractiveMap />);

    await vi.waitFor(() => {
      expect(container.querySelector('[data-testid="mock-map"]')).toBeInTheDocument();
    });
  });

  it('should handle user location updates', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) => {
        success({
          coords: {
            latitude: 51.505,
            longitude: -0.09,
            accuracy: 10,
          },
        });
      }),
    };

    // @ts-expect-error - Mocking navigator.geolocation
    global.navigator.geolocation = mockGeolocation;

    render(<InteractiveMap />);

    await vi.waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });
  });

  it('should display markers when user data is available', async () => {
    const mockUsers = [
      {
        id: '1',
        latitude: 51.505,
        longitude: -0.09,
        profile: { name: 'Test User' },
      },
    ];

    const axios = await import('axios');
    vi.mocked(axios.default.get).mockResolvedValue({
      data: mockUsers,
    });

    const { queryAllByTestId } = render(<InteractiveMap />);

    await vi.waitFor(() => {
      expect(queryAllByTestId('marker').length).toBeGreaterThan(0);
    });
  });

  it('should handle API errors gracefully', async () => {
    const axios = await import('axios');
    vi.mocked(axios.default.get).mockRejectedValue(new Error('API Error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<InteractiveMap />);

    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
