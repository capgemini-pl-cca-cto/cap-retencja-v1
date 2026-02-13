import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import PodgladMap from './podglad-map';
import type { DzialkaModel } from '@/types/inwestycja-model';

// Mock react-leaflet to avoid map rendering issues in tests
vi.mock('react-leaflet', () => ({
  MapContainer: ({
    children,
    center,
    zoom,
  }: {
    children: React.ReactNode;
    center: [number, number];
    zoom: number;
  }) => (
    <div
      data-testid="mock-map-container"
      data-center={JSON.stringify(center)}
      data-zoom={zoom}
    >
      {children}
    </div>
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
}));

describe('PodgladMap component', () => {
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

  test('should render map container with basic elements', () => {
    // ARRANGE & ACT
    render(<PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tile-layer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-zoom-control')).toBeInTheDocument();
  });

  test('should render polygon with dzialka coordinates', () => {
    // ARRANGE & ACT
    render(<PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    const polygon = screen.getByTestId('mock-polygon');
    expect(polygon).toBeInTheDocument();

    const polygonPositions = JSON.parse(
      polygon.getAttribute('data-positions') || '[]',
    );
    expect(polygonPositions).toEqual(mockDzialka.polygonCoordinates);
  });

  test('should render marker at dzialka center coordinates', () => {
    // ARRANGE & ACT
    render(<PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    const marker = screen.getByTestId('mock-marker');
    expect(marker).toBeInTheDocument();

    const markerPosition = JSON.parse(
      marker.getAttribute('data-position') || '[]',
    );
    expect(markerPosition).toEqual([
      mockDzialka.centerCoordinates.lat,
      mockDzialka.centerCoordinates.lng,
    ]);
  });

  test('should display dzialka information in popup', () => {
    // ARRANGE & ACT
    render(<PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    expect(screen.getByText('30.0001.AR_1.19/1')).toBeInTheDocument();
    expect(screen.getByText('wielkopolskie')).toBeInTheDocument();
    expect(screen.getByText('Poznań')).toBeInTheDocument();
    expect(screen.getByText('Jeżyce')).toBeInTheDocument();
    expect(screen.getByText('19/1')).toBeInTheDocument();
  });

  test('should center map on dzialka coordinates', () => {
    // ARRANGE & ACT
    render(<PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    const mapContainer = screen.getByTestId('mock-map-container');
    const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');

    expect(center).toEqual([
      mockDzialka.centerCoordinates.lat,
      mockDzialka.centerCoordinates.lng,
    ]);
  });

  test('should use correct zoom level', () => {
    // ARRANGE & ACT
    render(<PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    const mapContainer = screen.getByTestId('mock-map-container');
    const zoom = mapContainer.getAttribute('data-zoom');

    // PLOT_FOUND_ZOOM is 16 according to constants.ts
    expect(zoom).toBe('16');
  });

  test('should render popup without close button', () => {
    // ARRANGE & ACT
    render(<PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    const popup = screen.getByTestId('mock-popup');
    expect(popup).toBeInTheDocument();

    // Should not have any action buttons like in the main Map component
    expect(
      screen.queryByRole('button', { name: /zamknij/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /wybierz/i }),
    ).not.toBeInTheDocument();
  });

  test('should display all required dzialka fields', () => {
    // ARRANGE & ACT
    render(<PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />);

    // ASSERT - Check all labels are present
    expect(screen.getByText('Identyfikator działki')).toBeInTheDocument();
    expect(screen.getByText('Województwo')).toBeInTheDocument();
    expect(screen.getByText('Powiat')).toBeInTheDocument();
    expect(screen.getByText('Obręb')).toBeInTheDocument();
    expect(screen.getByText('Numer działki')).toBeInTheDocument();
  });

  test('should handle different dzialka data', () => {
    // ARRANGE
    const differentDzialka: DzialkaModel = {
      id: '14.0003.MZ_2.50/2',
      voivodeship: 'mazowieckie',
      county: 'Warszawa',
      commune: 'Warszawa',
      region: 'Śródmieście',
      parcel: '50/2',
      centerCoordinates: { lat: 52.2297, lng: 21.0122 },
      polygonCoordinates: [
        [52.2297, 21.0122],
        [52.2298, 21.0123],
      ],
    };

    // ACT
    render(<PodgladMap daneDzialki={differentDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    expect(screen.getByText('14.0003.MZ_2.50/2')).toBeInTheDocument();
    expect(screen.getByText('mazowieckie')).toBeInTheDocument();
    expect(screen.getByText('Warszawa')).toBeInTheDocument();
    expect(screen.getByText('Śródmieście')).toBeInTheDocument();
    expect(screen.getByText('50/2')).toBeInTheDocument();

    const marker = screen.getByTestId('mock-marker');
    const markerPosition = JSON.parse(
      marker.getAttribute('data-position') || '[]',
    );
    expect(markerPosition).toEqual([
      differentDzialka.centerCoordinates.lat,
      differentDzialka.centerCoordinates.lng,
    ]);
  });

  test('should render region in uppercase', () => {
    // ARRANGE & ACT
    render(<PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    const regionElement = screen.getByText('Jeżyce');
    expect(regionElement).toHaveClass('uppercase');
  });

  test('should have proper styling classes on popup container', () => {
    // ARRANGE & ACT
    const { container } = render(
      <PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />,
    );

    // ASSERT
    const popupContent = container.querySelector('.bg-white');
    expect(popupContent).toBeInTheDocument();
    expect(popupContent).toHaveClass(
      'flex',
      'flex-col',
      'gap-4',
      'text-primary-blue',
    );
  });

  test('should update when dzialka data changes', () => {
    // ARRANGE
    const { rerender } = render(
      <PodgladMap daneDzialki={mockDzialka} onConfirm={vi.fn()} />,
    );

    expect(screen.getByText('19/1')).toBeInTheDocument();

    const updatedDzialka: DzialkaModel = {
      ...mockDzialka,
      id: '30.0001.AR_1.20/1',
      parcel: '20/1',
      centerCoordinates: { lat: 52.4074, lng: 16.9262 },
    };

    // ACT
    rerender(<PodgladMap daneDzialki={updatedDzialka} onConfirm={vi.fn()} />);

    // ASSERT
    expect(screen.getByText('20/1')).toBeInTheDocument();
    expect(screen.queryByText('19/1')).not.toBeInTheDocument();

    const marker = screen.getByTestId('mock-marker');
    const markerPosition = JSON.parse(
      marker.getAttribute('data-position') || '[]',
    );
    expect(markerPosition).toEqual([
      updatedDzialka.centerCoordinates.lat,
      updatedDzialka.centerCoordinates.lng,
    ]);
  });
});
