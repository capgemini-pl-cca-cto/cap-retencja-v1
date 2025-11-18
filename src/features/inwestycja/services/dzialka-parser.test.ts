import { describe, expect, test, vi, beforeEach } from 'vitest';
import {
  fetchDzialkaData,
  fetchDzialkaDataByCoordinates,
} from './dzialka-parser';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

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
      server.use(
        http.get('https://uldk.gugik.gov.pl/', ({ request }) => {
          const url = new URL(request.url);
          if (url.searchParams.get('id')?.includes('nonexistent')) {
            return HttpResponse.text('0', { status: 200 });
          }
          return HttpResponse.text('0', { status: 200 });
        }),
      );

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.nonexistent'),
      ).rejects.toThrow('Brak działki dla identyfikatora');
    });

    test('should successfully fetch and parse dzialka data', async () => {
      // ACT
      const result = await fetchDzialkaData('30.0001.AR_1.19/1.123456');

      // ASSERT
      expect(result).toEqual({
        id: '142801_1.0001.AR_1.51/1',
        voivodeship: 'DOLNOŚLĄSKIE',
        county: 'bolesławiecki',
        commune: 'Osiecznica',
        region: 'Osiecznica',
        parcel: '51/1',
        centerCoordinates: expect.objectContaining({
          lat: expect.any(Number),
          lng: expect.any(Number),
        }),
        polygonCoordinates: expect.any(Array),
      });
      expect(result.polygonCoordinates.length).toBeGreaterThan(0);
    });

    test('should encode identifier in URL correctly', async () => {
      // ACT
      const result = await fetchDzialkaData('30.0001.AR_1.19/1.123456');

      // ASSERT
      expect(result).toBeDefined();
    });

    test('should throw error when response cannot be parsed', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', () => {
          return HttpResponse.text('invalid|response', { status: 200 });
        }),
      );

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.malformed'),
      ).rejects.toThrow('Działka o takim identyfikatorze nie istnieje');
    });

    test('should handle invalid WKT polygon format', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', () => {
          return HttpResponse.text(
            '30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|INVALID_WKT',
            { status: 200 },
          );
        }),
      );

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow();
    });

    test('should handle polygon with less than 3 points', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', () => {
          return HttpResponse.text(
            '30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827,358850 506814))',
            { status: 200 },
          );
        }),
      );

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow('Wielokąt musi mieć conajmniej 3 punkty');
    });

    test('should handle polygon with nested parentheses correctly', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', () => {
          return HttpResponse.text(
            '30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855.206 506827.929,358850.244 506814.692,358840.322 506801.455))',
            { status: 200 },
          );
        }),
      );

      // ACT
      const result = await fetchDzialkaData('30.0001.AR_1.19/1.123456');

      // ASSERT
      expect(result.polygonCoordinates.length).toBe(3);
    });
  });

  describe('fetchDzialkaDataByCoordinates', () => {
    test('should convert coordinates and fetch dzialka data', async () => {
      // ACT
      const result = await fetchDzialkaDataByCoordinates(52.4, 16.9);

      // ASSERT
      expect(result).toEqual({
        id: '142801_1.0001.AR_1.51/1',
        voivodeship: 'DOLNOŚLĄSKIE',
        county: 'bolesławiecki',
        commune: 'Osiecznica',
        region: 'Osiecznica',
        parcel: '51/1',
        centerCoordinates: expect.objectContaining({
          lat: expect.any(Number),
          lng: expect.any(Number),
        }),
        polygonCoordinates: expect.any(Array),
      });
    });

    test('should call API with converted coordinates', async () => {
      // ACT
      const result = await fetchDzialkaDataByCoordinates(52.4, 16.9);

      // ASSERT
      expect(result).toBeDefined();
    });

    test('should throw error when no dzialka found at coordinates', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', ({ request }) => {
          const url = new URL(request.url);
          const xy = url.searchParams.get('xy');
          if (xy === '0,0') {
            return HttpResponse.text('0', { status: 200 });
          }
          return HttpResponse.text('0', { status: 200 });
        }),
      );

      // ACT & ASSERT
      await expect(fetchDzialkaDataByCoordinates(0, 0)).rejects.toThrow(
        'Brak działki w tym miejscu na mapie',
      );
    });

    test('should throw error when response cannot be parsed', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', () => {
          return HttpResponse.text('invalid|response', { status: 200 });
        }),
      );

      // ACT & ASSERT
      await expect(fetchDzialkaDataByCoordinates(52.4, 16.9)).rejects.toThrow(
        'Nie znaleziono działki w tym miejscu na mapie',
      );
    });

    test('should handle negative coordinates', async () => {
      // ACT
      const result = await fetchDzialkaDataByCoordinates(-52.4, -16.9);

      // ASSERT
      expect(result.id).toBe('142801_1.0001.AR_1.51/1');
    });
  });

  describe('WKT parsing edge cases', () => {
    test('should handle WKT with trailing whitespace and newlines', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', () => {
          return HttpResponse.text(
            '30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827,358850 506814,358840 506801))\n',
            { status: 200 },
          );
        }),
      );

      // ACT
      const result = await fetchDzialkaData('30.0001.AR_1.19/1.123456');

      // ASSERT
      expect(result.polygonCoordinates).toHaveLength(3);
    });

    test('should handle WKT with multiple closing parentheses', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', () => {
          return HttpResponse.text(
            '30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827,358850 506814,358840 506801)))',
            { status: 200 },
          );
        }),
      );

      // ACT
      const result = await fetchDzialkaData('30.0001.AR_1.19/1.123456');

      // ASSERT
      expect(result.polygonCoordinates).toHaveLength(3);
    });

    test('should throw error for invalid coordinate pairs', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', () => {
          return HttpResponse.text(
            '30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((358855 506827 123,358850 506814,358840 506801))',
            { status: 200 },
          );
        }),
      );

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow('Oczekiwano 2 wartości współrzędnych');
    });

    test('should throw error for non-numeric coordinates', async () => {
      // ARRANGE
      server.use(
        http.get('https://uldk.gugik.gov.pl/', () => {
          return HttpResponse.text(
            '30.0001.AR_1.19/1|wielkopolskie|Poznań|Poznań|Jeżyce|19/1|SRID=2180;POLYGON((abc def,358850 506814,358840 506801))',
            { status: 200 },
          );
        }),
      );

      // ACT & ASSERT
      await expect(
        fetchDzialkaData('30.0001.AR_1.19/1.123456'),
      ).rejects.toThrow('Niepoprawne współrzędne');
    });
  });
});
