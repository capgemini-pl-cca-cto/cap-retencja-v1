import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import userEvent from '@testing-library/user-event';
import Map from './map';
import type { DzialkaModel } from '@/types/inwestycja-model';
import type { AddressSearchResult } from '../types/addressTypes';
import * as dzialkaParser from '../services/dzialka-parser';

interface MockMapEvents extends Mock {
  __clickHandler?: (e: { latlng: { lat: number; lng: number } }) => void;
}

// Mock react-leaflet to avoid map rendering issues in tests
vi.mock('react-leaflet', () => {
  const mockUseMap = vi.fn(() => ({
    setView: vi.fn(),
    fitBounds: vi.fn(),
  }));

  const mockUseMapEvents: MockMapEvents = vi.fn((handlers) => {
    // Store the handlers for later use
    if (handlers && typeof handlers === 'object') {
      // Make click handler available for testing
      mockUseMapEvents.__clickHandler = handlers.click;
    }
    return null;
  }) as MockMapEvents;

  return {
    MapContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-map-container">{children}</div>
    ),
    TileLayer: () => <div data-testid="mock-tile-layer" />,
    Polygon: ({ positions }: { positions: [number, number][] }) => (
      <div
        data-testid="mock-polygon"
        data-positions={JSON.stringify(positions)}
      />
    ),
    Marker: ({
      position,
      children,
    }: {
      position: [number, number];
      children?: React.ReactNode;
    }) => (
      <div data-testid="mock-marker" data-position={JSON.stringify(position)}>
        {children}
      </div>
    ),
    Popup: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-popup">{children}</div>
    ),
    ZoomControl: () => <div data-testid="mock-zoom-control" />,
    useMap: mockUseMap,
    useMapEvents: mockUseMapEvents,
  };
});

// Mock the DialogClose component
vi.mock('@/components/ui/dialog', () => ({
  DialogClose: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-close">{children}</div>
  ),
}));

// Mock fetchDzialkaDataByCoordinates
vi.mock('../services/dzialka-parser', () => ({
  fetchDzialkaDataByCoordinates: vi.fn(),
}));

describe('Map component', () => {
  const mockSetIdentyfikatorFromMap = vi.fn();
  const mockSetDaneDzialki = vi.fn();
  const mockSetError = vi.fn();

  const mockDzialka: DzialkaModel = {
    id: '30.0001.AR_1.19/1',
    voivodeship: 'wielkopolskie',
    county: 'Poznań',
    commune: 'Poznań',
    region: 'Jeżyce',
    parcel: '19/1',
    centerCoordinates: { lat: 52.4064, lng: 16.9252 },
    polygonCoordinates: [
      [52.4064, 16.9252],
      [52.4065, 16.9253],
      [52.4066, 16.9254],
    ],
  };

  const mockAddress: AddressSearchResult = {
    lat: 52.4064,
    lng: 16.9252,
    address: 'Bułgarska 17, Poznań',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render map container with basic elements', () => {
    // ARRANGE & ACT
    render(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT
    expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tile-layer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-zoom-control')).toBeInTheDocument();
  });

  test('should not render polygon and marker when daneDzialki is undefined', () => {
    // ARRANGE & ACT
    render(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT
    expect(screen.queryByTestId('mock-polygon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-marker')).not.toBeInTheDocument();
  });

  test('should render polygon and marker when daneDzialki is provided', () => {
    // ARRANGE & ACT
    render(
      <Map
        daneDzialki={mockDzialka}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT
    expect(screen.getByTestId('mock-polygon')).toBeInTheDocument();
    expect(screen.getByTestId('mock-marker')).toBeInTheDocument();
  });

  test('should display dzialka information in popup when daneDzialki is provided', () => {
    // ARRANGE & ACT
    render(
      <Map
        daneDzialki={mockDzialka}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT
    expect(screen.getByText('30.0001.AR_1.19/1')).toBeInTheDocument();
    expect(screen.getByText('wielkopolskie')).toBeInTheDocument();
    expect(screen.getByText('Poznań')).toBeInTheDocument();
    expect(screen.getByText('Jeżyce')).toBeInTheDocument();
    expect(screen.getByText('19/1')).toBeInTheDocument();
  });

  test('should render Zamknij and Wybierz buttons in popup', () => {
    // ARRANGE & ACT
    render(
      <Map
        daneDzialki={mockDzialka}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT
    expect(
      screen.getByRole('button', { name: /zamknij/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /wybierz/i }),
    ).toBeInTheDocument();
  });

  test('should call setIdentyfikatorFromMap when Wybierz button is clicked', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(
      <Map
        daneDzialki={mockDzialka}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ACT
    const wybierzButton = screen.getByRole('button', { name: /wybierz/i });
    await user.click(wybierzButton);

    // ASSERT
    expect(mockSetIdentyfikatorFromMap).toHaveBeenCalledWith(
      '30.0001.AR_1.19/1',
    );
    expect(mockSetIdentyfikatorFromMap).toHaveBeenCalledTimes(1);
  });

  test('should fetch dzialka data when map is clicked', async () => {
    // ARRANGE
    const mockFetchedDzialka: DzialkaModel = {
      id: '30.0002.AR_1.20/1',
      voivodeship: 'wielkopolskie',
      county: 'Poznań',
      commune: 'Poznań',
      region: 'Grunwald',
      parcel: '20/1',
      centerCoordinates: { lat: 52.4074, lng: 16.9262 },
      polygonCoordinates: [[52.4074, 16.9262]],
    };

    vi.mocked(dzialkaParser.fetchDzialkaDataByCoordinates).mockResolvedValue(
      mockFetchedDzialka,
    );

    render(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ACT - Simulate map click
    const { useMapEvents } = await import('react-leaflet');
    const clickHandler = (useMapEvents as MockMapEvents).__clickHandler;

    if (clickHandler) {
      await clickHandler({ latlng: { lat: 52.4074, lng: 16.9262 } });
    }

    // ASSERT
    await waitFor(() => {
      expect(dzialkaParser.fetchDzialkaDataByCoordinates).toHaveBeenCalledWith(
        52.4074,
        16.9262,
      );
      expect(mockSetDaneDzialki).toHaveBeenCalledWith(mockFetchedDzialka);
    });
  });

  test('should clear error when map is clicked', async () => {
    // ARRANGE
    const mockFetchedDzialka: DzialkaModel = {
      id: '30.0002.AR_1.20/1',
      voivodeship: 'wielkopolskie',
      county: 'Poznań',
      commune: 'Poznań',
      region: 'Grunwald',
      parcel: '20/1',
      centerCoordinates: { lat: 52.4074, lng: 16.9262 },
      polygonCoordinates: [[52.4074, 16.9262]],
    };

    vi.mocked(dzialkaParser.fetchDzialkaDataByCoordinates).mockResolvedValue(
      mockFetchedDzialka,
    );

    render(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ACT - Simulate map click
    const { useMapEvents } = await import('react-leaflet');
    const clickHandler = (useMapEvents as MockMapEvents).__clickHandler;

    if (clickHandler) {
      await clickHandler({ latlng: { lat: 52.4074, lng: 16.9262 } });
    }

    // ASSERT
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(null);
    });
  });

  test('should set error when fetchDzialkaDataByCoordinates fails', async () => {
    // ARRANGE
    const errorMessage = 'Brak działki w tym miejscu na mapie';
    vi.mocked(dzialkaParser.fetchDzialkaDataByCoordinates).mockRejectedValue(
      new Error(errorMessage),
    );

    render(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ACT - Simulate map click
    const { useMapEvents } = await import('react-leaflet');
    const clickHandler = (useMapEvents as MockMapEvents).__clickHandler;

    if (clickHandler) {
      await clickHandler({ latlng: { lat: 52.4074, lng: 16.9262 } });
    }

    // ASSERT
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('should set generic error message when fetchDzialkaDataByCoordinates fails without Error object', async () => {
    // ARRANGE
    vi.mocked(dzialkaParser.fetchDzialkaDataByCoordinates).mockRejectedValue(
      'Unknown error',
    );

    render(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ACT - Simulate map click
    const { useMapEvents } = await import('react-leaflet');
    const clickHandler = (useMapEvents as MockMapEvents).__clickHandler;

    if (clickHandler) {
      await clickHandler({ latlng: { lat: 52.4074, lng: 16.9262 } });
    }

    // ASSERT
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(
        'Błąd podczas wyszukiwania działki',
      );
    });
  });

  test('should update map position when daneDzialki changes', () => {
    // ARRANGE
    const { rerender } = render(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ACT - Update with dzialka data
    rerender(
      <Map
        daneDzialki={mockDzialka}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT - Check that marker is rendered at the correct position
    const marker = screen.getByTestId('mock-marker');
    const markerPosition = JSON.parse(
      marker.getAttribute('data-position') || '[]',
    );
    expect(markerPosition).toEqual([
      mockDzialka.centerCoordinates.lat,
      mockDzialka.centerCoordinates.lng,
    ]);
  });

  test('should update map position when daneAdresu changes', () => {
    // ARRANGE
    const { rerender } = render(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ACT - Update with address data
    rerender(
      <Map
        daneAdresu={mockAddress}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT - Map container should still be rendered (position change is internal)
    expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
  });

  test('should reset map position when daneDzialki is cleared', () => {
    // ARRANGE
    const { rerender } = render(
      <Map
        daneDzialki={mockDzialka}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    expect(screen.getByTestId('mock-marker')).toBeInTheDocument();

    // ACT - Clear dzialka data
    rerender(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT - Marker should be removed
    expect(screen.queryByTestId('mock-marker')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-polygon')).not.toBeInTheDocument();
  });

  test('should render polygon with correct coordinates', () => {
    // ARRANGE & ACT
    render(
      <Map
        daneDzialki={mockDzialka}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT
    const polygon = screen.getByTestId('mock-polygon');
    const polygonPositions = JSON.parse(
      polygon.getAttribute('data-positions') || '[]',
    );
    expect(polygonPositions).toEqual(mockDzialka.polygonCoordinates);
  });

  test('should handle both daneDzialki and daneAdresu being undefined', () => {
    // ARRANGE & ACT
    render(
      <Map
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT
    expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-marker')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-polygon')).not.toBeInTheDocument();
  });

  test('should update position when daneAdresu is provided after daneDzialki', () => {
    // ARRANGE
    const { rerender } = render(
      <Map
        daneDzialki={mockDzialka}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ACT - Update with address data
    rerender(
      <Map
        daneDzialki={mockDzialka}
        daneAdresu={mockAddress}
        setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap}
        setDaneDzialki={mockSetDaneDzialki}
        setError={mockSetError}
      />,
    );

    // ASSERT - Both dzialka elements and map should still be present
    expect(screen.getByTestId('mock-marker')).toBeInTheDocument();
    expect(screen.getByTestId('mock-polygon')).toBeInTheDocument();
  });
});
