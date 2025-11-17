import { describe, expect, test, vi, beforeEach } from 'vitest';
import { fetchAddressCoordinates } from './address-search';
import type { AddressApiResponse } from '../types/addressTypes';

// Mock proj4 using vi.hoisted to avoid hoisting issues
const { mockProj4 } = vi.hoisted(() => {
  const mockProj4 = vi.fn((from: string, to: string, coords: number[]) => {
    // Mock conversion from EPSG:2180 to WGS84
    if (from === 'EPSG:2180' && to === 'WGS84') {
      // Simple mock transformation - just divide by large numbers to simulate coordinate conversion
      return [coords[0] / 30000, coords[1] / 10000];
    }
    return coords;
  }) as ReturnType<typeof vi.fn> & { defs: ReturnType<typeof vi.fn> };
  mockProj4.defs = vi.fn();
  return { mockProj4 };
});

vi.mock('proj4', () => ({
  default: mockProj4,
}));

describe('address-search service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('fetchAddressCoordinates', () => {
    test('should throw error when address is empty', async () => {
      // ARRANGE & ACT & ASSERT
      await expect(fetchAddressCoordinates('')).rejects.toThrow(
        'Adres nie może być pusty',
      );
    });

    test('should throw error when address is only whitespace', async () => {
      // ARRANGE & ACT & ASSERT
      await expect(fetchAddressCoordinates('   ')).rejects.toThrow(
        'Adres nie może być pusty',
      );
    });

    test('should fetch and transform coordinates successfully', async () => {
      // ARRANGE
      const mockResponse: AddressApiResponse = {
        type: 'FeatureCollection',
        'found objects': 1,
        'returned objects': 1,
        results: {
          '1': {
            city: 'Poznań',
            street: 'Świerczewskiego',
            number: '1',
            x: '358855.206308051',
            y: '506827.929378615',
            accuracy: 'exact',
          },
        },
      };

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await fetchAddressCoordinates('Świerczewskiego 1, Poznań');

      // ASSERT
      expect(result).toEqual({
        lat: expect.any(Number),
        lng: expect.any(Number),
        address: 'Świerczewskiego 1, Poznań',
      });
      expect(result.lat).not.toBeNaN();
      expect(result.lng).not.toBeNaN();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://services.gugik.gov.pl/uug/'),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('request=GetAddress'),
      );
    });

    test('should encode address in URL correctly', async () => {
      // ARRANGE
      const mockResponse: AddressApiResponse = {
        type: 'FeatureCollection',
        'found objects': 1,
        'returned objects': 1,
        results: {
          '1': {
            city: 'Warszawa',
            street: 'Marszałkowska',
            number: '10/12',
            x: '400000',
            y: '500000',
            accuracy: 'exact',
          },
        },
      };

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      await fetchAddressCoordinates('Marszałkowska 10/12, Warszawa');

      // ASSERT
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          encodeURIComponent('Marszałkowska 10/12, Warszawa'),
        ),
      );
    });

    test('should throw error when API returns empty response', async () => {
      // ARRANGE
      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(''),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(
        fetchAddressCoordinates('Nieistniejący Adres'),
      ).rejects.toThrow('Nie znaleziono adresu: Nieistniejący Adres');
    });

    test('should throw error when API returns invalid JSON', async () => {
      // ARRANGE
      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve('Invalid JSON{'),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(fetchAddressCoordinates('Test Address')).rejects.toThrow(
        'Nieprawidłowa odpowiedź JSON API dla adresu',
      );
    });

    test('should throw error when no results found in response', async () => {
      // ARRANGE
      const mockResponse: AddressApiResponse = {
        type: 'FeatureCollection',
        'found objects': 0,
        'returned objects': 0,
        results: {},
      };

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(fetchAddressCoordinates('No Results')).rejects.toThrow(
        'Nie znaleziono adresu: No Results',
      );
    });

    test('should throw error when coordinates are invalid (NaN)', async () => {
      // ARRANGE
      const mockResponse: AddressApiResponse = {
        type: 'FeatureCollection',
        'found objects': 1,
        'returned objects': 1,
        results: {
          '1': {
            city: 'Poznań',
            street: 'Test',
            number: '1',
            x: 'invalid',
            y: 'invalid',
            accuracy: 'exact',
          },
        },
      };

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(fetchAddressCoordinates('Test')).rejects.toThrow(
        'Nieprawidłowe współrzędne dla adresu',
      );
    });

    test('should handle fetch errors gracefully', async () => {
      // ARRANGE
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(fetchAddressCoordinates('Test Address')).rejects.toThrow(
        'Network error',
      );
    });

    test('should handle non-Error exceptions', async () => {
      // ARRANGE
      const mockFetch = vi.fn().mockRejectedValue('String error');
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(fetchAddressCoordinates('Test')).rejects.toThrow(
        'Błąd podczas wyszukiwania adresu: Test',
      );
    });

    test('should construct correct address from API response', async () => {
      // ARRANGE
      const mockResponse: AddressApiResponse = {
        type: 'FeatureCollection',
        'found objects': 1,
        'returned objects': 1,
        results: {
          '1': {
            city: 'Kraków',
            street: 'Floriańska',
            number: '25',
            x: '400000',
            y: '500000',
            accuracy: 'exact',
          },
        },
      };

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await fetchAddressCoordinates('Floriańska 25, Kraków');

      // ASSERT
      expect(result.address).toBe('Floriańska 25, Kraków');
    });

    test('should handle multiple results and use first one', async () => {
      // ARRANGE
      const mockResponse: AddressApiResponse = {
        type: 'FeatureCollection',
        'found objects': 2,
        'returned objects': 2,
        results: {
          '1': {
            city: 'Poznań',
            street: 'Główna',
            number: '1',
            x: '358855.206308051',
            y: '506827.929378615',
            accuracy: 'exact',
          },
          '2': {
            city: 'Warszawa',
            street: 'Główna',
            number: '1',
            x: '400000',
            y: '500000',
            accuracy: 'approximate',
          },
        },
      };

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await fetchAddressCoordinates('Główna 1');

      // ASSERT
      expect(result.address).toBe('Główna 1, Poznań');
    });
  });
});
