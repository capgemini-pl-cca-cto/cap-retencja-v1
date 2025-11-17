import { describe, expect, test, vi, beforeEach } from 'vitest';
import {
  fetchDzialkaData,
  fetchDzialkaDataByCoordinates,
} from './dzialka-parser';

// Mock proj4 using vi.hoisted to avoid hoisting issues
const { mockProj4 } = vi.hoisted(() => {
  const mockProj4 = vi.fn((from: string, to: string, coords: number[]) => {
    // Mock conversion
    if (from === 'EPSG:2180' && to === 'WGS84') {
      // Simulate EPSG:2180 to WGS84 conversion
      return [coords[0] / 30000, coords[1] / 10000];
    }
    if (from === 'WGS84' && to === 'EPSG:2180') {
      // Simulate WGS84 to EPSG:2180 conversion
      return [coords[0] * 30000, coords[1] * 10000];
    }
    return coords;
  }) as ReturnType<typeof vi.fn> & { defs: ReturnType<typeof vi.fn> };
  mockProj4.defs = vi.fn();
  return { mockProj4 };
});

vi.mock('proj4', () => ({
  default: mockProj4,
}));

// Mock @turf/turf
vi.mock('@turf/turf', () => ({
  polygon: vi.fn((coords) => ({
    type: 'Polygon',
    coordinates: coords,
  })),
  centroid: vi.fn(() => ({
    geometry: {
      coordinates: [358855, 506827], // Mock centroid in EPSG:2180
    },
  })),
}));

describe('dzialka-parser service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchDzialkaData', () => {
    test('should throw error when identifier is empty', async () => {
      // ARRANGE & ACT & ASSERT
      await expect(fetchDzialkaData('')).rejects.toThrow(
        'Identyfikator działki nie może być pusty',
      );
    });

    test('should throw error when identifier is only whitespace', async () => {
      // ARRANGE & ACT & ASSERT
      await expect(fetchDzialkaData('   ')).rejects.toThrow(
        'Identyfikator działki nie może być pusty',
      );
    });

    test('should throw error when identifier is too short', async () => {
      // ARRANGE & ACT & ASSERT
      await expect(fetchDzialkaData('12345')).rejects.toThrow(
        'Działka o takim identyfikatorze nie istnieje',
      );
    });

    test('should throw error when API returns 0', async () => {
      // ARRANGE
      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve('0'),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow('Brak działki dla identyfikatora');
    });

    test('should successfully fetch and parse dzialka data', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855.206308051 506827.929378615,358850.244847873 506814.692656992,358840.322387695 506801.455935368))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await fetchDzialkaData('30.0001.AR_1.19/1.123456');

      // ASSERT
      expect(result).toEqual({
        id: '30.0001.AR_1.19/1',
        voivodeship: 'wielkopolskie',
        county: 'Poznań',
        commune: 'Poznań',
        region: 'Jeżyce',
        parcel: '19/1',
        centerCoordinates: expect.objectContaining({
          lat: expect.any(Number),
          lng: expect.any(Number),
        }),
        polygonCoordinates: expect.any(Array),
      });
      expect(result.polygonCoordinates.length).toBeGreaterThan(0);
    });

    test('should encode identifier in URL correctly', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827,358850 506814,358840 506801))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      const identifier = '30.0001.AR_1.19/1.123456';

      // ACT
      await fetchDzialkaData(identifier);

      // ASSERT
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://uldk.gugik.gov.pl/'),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('request=GetParcelById'),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(identifier)),
      );
    });

    test('should throw error when response cannot be parsed', async () => {
      // ARRANGE
      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve('0\ninvalid|data'),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow('Działka o takim identyfikatorze nie istnieje');
    });

    test('should handle invalid WKT polygon format', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|INVALID_WKT`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow();
    });

    test('should handle polygon with less than 3 points', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827,358850 506814))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow('Wielokąt musi mieć conajmniej 3 punkty');
    });

    test('should handle polygon with nested parentheses correctly', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855.206 506827.929,358850.244 506814.692,358840.322 506801.455))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await fetchDzialkaData('30.0001.AR_1.19/1.123456');

      // ASSERT
      expect(result.polygonCoordinates.length).toBe(3);
    });
  });

  describe('fetchDzialkaDataByCoordinates', () => {
    test('should convert coordinates and fetch dzialka data', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855.206308051 506827.929378615,358850.244847873 506814.692656992,358840.322387695 506801.455935368))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await fetchDzialkaDataByCoordinates(52.4, 16.9);

      // ASSERT
      expect(result).toEqual({
        id: '30.0001.AR_1.19/1',
        voivodeship: 'wielkopolskie',
        county: 'Poznań',
        commune: 'Poznań',
        region: 'Jeżyce',
        parcel: '19/1',
        centerCoordinates: expect.objectContaining({
          lat: expect.any(Number),
          lng: expect.any(Number),
        }),
        polygonCoordinates: expect.any(Array),
      });
    });

    test('should call API with converted coordinates', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827,358850 506814,358840 506801))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      const lat = 52.4;
      const lng = 16.9;

      // ACT
      await fetchDzialkaDataByCoordinates(lat, lng);

      // ASSERT
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('request=GetParcelByXY'),
      );
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('xy='));
    });

    test('should throw error when no dzialka found at coordinates', async () => {
      // ARRANGE
      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve('0'),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(fetchDzialkaDataByCoordinates(52.4, 16.9)).rejects.toThrow(
        'Brak działki w tym miejscu na mapie',
      );
    });

    test('should throw error when response cannot be parsed', async () => {
      // ARRANGE
      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve('0\ninvalid|data'),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(fetchDzialkaDataByCoordinates(52.4, 16.9)).rejects.toThrow(
        'Nie znaleziono działki w tym miejscu na mapie',
      );
    });

    test('should handle negative coordinates', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827,358850 506814,358840 506801))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await fetchDzialkaDataByCoordinates(-52.4, -16.9);

      // ASSERT
      expect(result.id).toBe('30.0001.AR_1.19/1');
    });
  });

  describe('WKT parsing edge cases', () => {
    test('should handle WKT with trailing whitespace and newlines', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827,358850 506814,358840 506801))
`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await fetchDzialkaData('30.0001.AR_1.19/1.123456');

      // ASSERT
      expect(result.polygonCoordinates).toHaveLength(3);
    });

    test('should handle WKT with multiple closing parentheses', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827,358850 506814,358840 506801)))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await fetchDzialkaData('30.0001.AR_1.19/1.123456');

      // ASSERT
      expect(result.polygonCoordinates).toHaveLength(3);
    });

    test('should throw error for invalid coordinate pairs', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827 123,358850 506814,358840 506801))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow('Oczekiwano 2 wartości współrzędnych');
    });

    test('should throw error for non-numeric coordinates', async () => {
      // ARRANGE
      const mockResponse = `0
30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((abc def,358850 506814,358840 506801))`;

      const mockFetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockResponse),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow('Niepoprawne współrzędne');
    });
  });
});
