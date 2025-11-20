import type { DzialkaModel } from '@/types/inwestycja-model';
import { render, screen } from '@testing-library/react';
import { describe, expect } from 'vitest';
import CustomPopupContent from './custom-popup-content';

describe('CustomPopupContent', () => {
  const mockDaneDzialki: DzialkaModel = {
    id: '30.0001.AR_1.19/1',
    voivodeship: 'wielkopolskie',
    county: 'Poznań',
    commune: 'Poznań',
    region: 'Jeżyce',
    parcel: '19/1',
    centerCoordinates: { lat: 52.4, lng: 16.9 },
    polygonCoordinates: [[52.4, 16.9]],
  };

  test('should render all parcel information correctly', () => {
    // ARRANGE
    const { container } = render(
      <CustomPopupContent daneDzialki={mockDaneDzialki} />,
    );

    // ACT
    const labels = container.querySelectorAll('.font-light');
    const values = container.querySelectorAll('.font-medium');
    const regionValue = screen.getByText('Jeżyce');

    // ASSERT
    expect(screen.getByText('Identyfikator działki')).toBeInTheDocument();
    expect(screen.getByText('30.0001.AR_1.19/1')).toBeInTheDocument();
    expect(screen.getByText('Województwo')).toBeInTheDocument();
    expect(screen.getByText('wielkopolskie')).toBeInTheDocument();
    expect(screen.getByText('Powiat')).toBeInTheDocument();
    expect(screen.getByText('Poznań')).toBeInTheDocument();
    expect(screen.getByText('Obręb')).toBeInTheDocument();
    expect(regionValue).toBeInTheDocument();
    expect(regionValue).toHaveClass('uppercase');
    expect(screen.getByText('Numer działki')).toBeInTheDocument();
    expect(screen.getByText('19/1')).toBeInTheDocument();
    expect(labels.length).toBe(5);
    expect(values.length).toBe(5);
  });
});
