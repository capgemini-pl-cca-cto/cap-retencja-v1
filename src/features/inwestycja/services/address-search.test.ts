import { describe, expect, test, vi, beforeEach } from 'vitest';
import { fetchAddressCoordinates } from './address-search';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

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
    });

    test('should encode address in URL correctly', async () => {
      // ACT
      const result = await fetchAddressCoordinates(
        'Marszałkowska 10/12, Warszawa',
      );

      // ASSERT
      expect(result).toEqual({
        lat: expect.any(Number),
        lng: expect.any(Number),
        address: 'Marszałkowska 10/12, Warszawa',
      });
    });

    test('should throw error when API returns empty response', async () => {
      // ARRANGE
      server.use(
        http.get('https://services.gugik.gov.pl/uug/', () => {
          return HttpResponse.text('', { status: 200 });
        }),
      );

      // ACT & ASSERT
      await expect(
        fetchAddressCoordinates('Nieistniejący Adres'),
      ).rejects.toThrow('Nie znaleziono adresu: Nieistniejący Adres');
    });

    test('should throw error when API returns invalid JSON', async () => {
      // ACT & ASSERT
      await expect(fetchAddressCoordinates('InvalidJSON')).rejects.toThrow(
        'Nieprawidłowa odpowiedź JSON API dla adresu',
      );
    });

    test('should throw error when no results found in response', async () => {
      // ACT & ASSERT
      await expect(fetchAddressCoordinates('No Results')).rejects.toThrow(
        'Nie znaleziono adresu: No Results',
      );
    });

    test('should throw error when coordinates are invalid (NaN)', async () => {
      // ACT & ASSERT
      await expect(fetchAddressCoordinates('invalid')).rejects.toThrow(
        'Nieprawidłowe współrzędne dla adresu',
      );
    });

    test('should handle fetch errors gracefully', async () => {
      // ARRANGE
      server.use(
        http.get('https://services.gugik.gov.pl/uug/', () => {
          return HttpResponse.error();
        }),
      );

      // ACT & ASSERT
      await expect(fetchAddressCoordinates('Test Address')).rejects.toThrow();
    });

    test('should handle non-Error exceptions', async () => {
      // ARRANGE
      server.use(
        http.get('https://services.gugik.gov.pl/uug/', () => {
          throw 'String error';
        }),
      );

      // ACT & ASSERT
      await expect(fetchAddressCoordinates('Test')).rejects.toThrow(
        'Nie znaleziono adresu: Test',
      );
    });

    test('should construct correct address from API response', async () => {
      // ACT
      const result = await fetchAddressCoordinates('Floriańska 25, Kraków');

      // ASSERT
      expect(result.address).toBe('Floriańska 25, Kraków');
    });

    test('should handle multiple results and use first one', async () => {
      // ACT
      const result = await fetchAddressCoordinates('Główna 1');

      // ASSERT
      expect(result.address).toBe('Główna 1, Poznań');
    });
  });
});
