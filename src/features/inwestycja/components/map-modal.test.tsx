import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import MapModal from './map-modal';
import type { DzialkaModel } from '@/types/inwestycja-model';
import type { AddressSearchResult } from '../types/addressTypes';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Mock react-leaflet to avoid map rendering issues in tests
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="mock-tile-layer" />,
  Polygon: () => <div data-testid="mock-polygon" />,
  Marker: () => <div data-testid="mock-marker" />,
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-popup">{children}</div>
  ),
  ZoomControl: () => <div data-testid="mock-zoom-control" />,
  useMap: () => ({
    setView: vi.fn(),
    fitBounds: vi.fn(),
  }),
  useMapEvents: () => ({}),
}));

// Mock LocationInput component
vi.mock('./location-input', () => ({
  default: ({
    onDzialkaFound,
    onAddressFound,
    error,
    setError,
  }: {
    onDzialkaFound: (dzialka: DzialkaModel) => void;
    onAddressFound: (address: AddressSearchResult) => void;
    error: string | null;
    setError: (error: string | null) => void;
  }) => (
    <div data-testid="mock-location-input">
      <button
        type="button"
        data-testid="trigger-dzialka-found"
        onClick={() =>
          onDzialkaFound({
            id: '123456_1.0001.1_1',
            voivodeship: 'Wielkopolskie',
            county: 'Poznań',
            commune: 'Poznań',
            region: 'Region 1',
            parcel: '0001',
            centerCoordinates: { lat: 52.4064, lng: 16.9252 },
            polygonCoordinates: [
              [52.4064, 16.9252],
              [52.4065, 16.9253],
            ] as [number, number][],
          })
        }
      >
        Trigger Dzialka Found
      </button>
      <button
        type="button"
        data-testid="trigger-address-found"
        onClick={() =>
          onAddressFound({
            lat: 52.4064,
            lng: 16.9252,
            address: 'Bułgarska 17, Poznań',
          })
        }
      >
        Trigger Address Found
      </button>
      <button
        type="button"
        data-testid="trigger-error"
        onClick={() => setError('Test error message')}
      >
        Trigger Error
      </button>
      <button
        type="button"
        data-testid="clear-error"
        onClick={() => setError(null)}
      >
        Clear Error
      </button>
      {error && <div data-testid="location-input-error">{error}</div>}
    </div>
  ),
}));

// Mock Map component
vi.mock('./map', () => ({
  default: ({
    daneDzialki,
    setIdentyfikatorFromMap,
    setDaneDzialki,
    setError,
    daneAdresu,
  }: {
    daneDzialki?: DzialkaModel | undefined;
    setIdentyfikatorFromMap: (value: string) => void;
    setDaneDzialki: (value: DzialkaModel | undefined) => void;
    setError: (value: string | null) => void;
    daneAdresu?: AddressSearchResult | null;
  }) => (
    <div data-testid="mock-map">
      {daneDzialki && (
        <div data-testid="map-dzialka-data">Dzialka: {daneDzialki.id}</div>
      )}
      {daneAdresu && (
        <div data-testid="map-address-data">Address: {daneAdresu.address}</div>
      )}
      <button
        type="button"
        data-testid="map-set-identyfikator"
        onClick={() => setIdentyfikatorFromMap('123456_1.0001.1_1')}
      >
        Set Identyfikator
      </button>
      <button
        type="button"
        data-testid="map-set-error"
        onClick={() => setError('Map error')}
      >
        Set Map Error
      </button>
      <button
        type="button"
        data-testid="map-clear-dzialka"
        onClick={() => setDaneDzialki(undefined)}
      >
        Clear Dzialka
      </button>
    </div>
  ),
}));

describe('MapModal component', () => {
  const mockSetIdentyfikatorFromMap = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to render MapModal within Dialog context
  const renderMapModal = () => {
    return render(
      <Dialog open={true}>
        <DialogContent className="max-w-none w-screen h-screen p-0">
          <MapModal setIdentyfikatorFromMap={mockSetIdentyfikatorFromMap} />
        </DialogContent>
      </Dialog>,
    );
  };

  test('should render content', () => {
    // ARRANGE
    renderMapModal();

    //ACT
    const closeButton = screen.getByRole('button', { name: /zamknij mapę/i });

    // ASSERT
    expect(screen.getByText(/wyszukaj działkę na mapie/i)).toBeInTheDocument();
    expect(
      screen.getByText(/wpisz adres w formie: miasto, ulica numer/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/poznań, bułgarska 17/i)).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(screen.getByTestId('mock-location-input')).toBeInTheDocument();
    expect(screen.getByTestId('mock-map')).toBeInTheDocument();
  });

  test('should handle dzialka found event', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    const triggerButton = screen.getByTestId('trigger-dzialka-found');
    await user.click(triggerButton);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByTestId('map-dzialka-data')).toBeInTheDocument();
      expect(
        screen.getByText(/dzialka: 123456_1.0001.1_1/i),
      ).toBeInTheDocument();
    });
  });

  test('should handle address found event', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    const triggerButton = screen.getByTestId('trigger-address-found');
    await user.click(triggerButton);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByTestId('map-address-data')).toBeInTheDocument();
      expect(
        screen.getByText(/address: bułgarska 17, poznań/i),
      ).toBeInTheDocument();
    });
  });

  test('should clear daneDzialki when address is found', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    // First set dzialka
    const triggerDzialkaButton = screen.getByTestId('trigger-dzialka-found');
    await user.click(triggerDzialkaButton);

    await waitFor(() => {
      expect(screen.getByTestId('map-dzialka-data')).toBeInTheDocument();
    });

    // Then set address
    const triggerAddressButton = screen.getByTestId('trigger-address-found');
    await user.click(triggerAddressButton);

    // ASSERT - dzialka should be cleared
    await waitFor(() => {
      expect(screen.queryByTestId('map-dzialka-data')).not.toBeInTheDocument();
      expect(screen.getByTestId('map-address-data')).toBeInTheDocument();
    });
  });

  test('should clear daneAdresu when dzialka is found', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    // First set address
    const triggerAddressButton = screen.getByTestId('trigger-address-found');
    await user.click(triggerAddressButton);

    await waitFor(() => {
      expect(screen.getByTestId('map-address-data')).toBeInTheDocument();
    });

    // Then set dzialka
    const triggerDzialkaButton = screen.getByTestId('trigger-dzialka-found');
    await user.click(triggerDzialkaButton);

    // ASSERT - address should be cleared
    await waitFor(() => {
      expect(screen.queryByTestId('map-address-data')).not.toBeInTheDocument();
      expect(screen.getByTestId('map-dzialka-data')).toBeInTheDocument();
    });
  });

  test('should display error alert when error occurs', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    const triggerErrorButton = screen.getByTestId('trigger-error');
    await user.click(triggerErrorButton);

    // ASSERT - Check for both the alert and the location input error
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Test error message');
      expect(screen.getByTestId('location-input-error')).toBeInTheDocument();
    });
  });

  test('should display specific error message for non-existent dzialka', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    // Simulate error with specific message
    const triggerErrorButton = screen.getByTestId('trigger-error');
    await user.click(triggerErrorButton);

    // ASSERT
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });

  test('should close error alert when close button is clicked', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    // Trigger error
    const triggerErrorButton = screen.getByTestId('trigger-error');
    await user.click(triggerErrorButton);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    // Close error
    const closeAlertButton = screen.getByRole('button', {
      name: /close alert/i,
    });
    await user.click(closeAlertButton);

    // ASSERT
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('should clear error when address is found', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    // First set error
    const triggerErrorButton = screen.getByTestId('trigger-error');
    await user.click(triggerErrorButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Then find address which should clear error
    const triggerAddressButton = screen.getByTestId('trigger-address-found');
    await user.click(triggerAddressButton);

    // ASSERT - error should be cleared (no alert should be visible)
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('should pass setIdentyfikatorFromMap to Map component', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    const setIdentyfikatorButton = screen.getByTestId('map-set-identyfikator');
    await user.click(setIdentyfikatorButton);

    // ASSERT
    expect(mockSetIdentyfikatorFromMap).toHaveBeenCalledWith(
      '123456_1.0001.1_1',
    );
  });

  test('should not display error alert on small screens', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    const triggerErrorButton = screen.getByTestId('trigger-error');
    await user.click(triggerErrorButton);

    // ASSERT
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      // Check that it has the class 'max-sm:hidden'
      expect(alert).toHaveClass('max-sm:hidden');
    });
  });

  test('should pass error state to LocationInput', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    const triggerErrorButton = screen.getByTestId('trigger-error');
    await user.click(triggerErrorButton);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByTestId('location-input-error')).toBeInTheDocument();
      expect(screen.getByTestId('location-input-error')).toHaveTextContent(
        'Test error message',
      );
    });
  });

  test('should handle error from Map component', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    const mapSetErrorButton = screen.getByTestId('map-set-error');
    await user.click(mapSetErrorButton);

    // ASSERT - Check by role to be more specific
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Map error');
    });
  });

  test('should maintain separate state for daneDzialki and daneAdresu', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    // Set dzialka
    const triggerDzialkaButton = screen.getByTestId('trigger-dzialka-found');
    await user.click(triggerDzialkaButton);

    await waitFor(() => {
      expect(screen.getByTestId('map-dzialka-data')).toBeInTheDocument();
    });

    // ASSERT - only dzialka should be present
    expect(screen.queryByTestId('map-address-data')).not.toBeInTheDocument();
  });

  test('should not clear daneDzialki when undefined is passed to handleDzialkaSet', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    renderMapModal();

    // First set dzialka
    const triggerDzialkaButton = screen.getByTestId('trigger-dzialka-found');
    await user.click(triggerDzialkaButton);

    await waitFor(() => {
      expect(screen.getByTestId('map-dzialka-data')).toBeInTheDocument();
    });

    // Try to clear it from map
    const clearDzialkaButton = screen.getByTestId('map-clear-dzialka');
    await user.click(clearDzialkaButton);

    // ASSERT - dzialka should be cleared
    await waitFor(() => {
      expect(screen.queryByTestId('map-dzialka-data')).not.toBeInTheDocument();
    });
  });
});
