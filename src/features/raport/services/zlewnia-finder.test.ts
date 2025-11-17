import { describe, expect, test, vi, beforeEach } from 'vitest';
import findZlewnia from './zlewnia-finder';

// Mock proj4
vi.mock('proj4', () => ({
  default: vi.fn((from: string, to: string, coords: number[]) => {
    // Mock conversion from WGS84 to EPSG:2177
    if (from === 'EPSG:4326' && to.includes('+proj=tmerc')) {
      return [coords[0] * 100000, coords[1] * 100000];
    }
    return coords;
  }),
}));

// Mock @turf/turf
vi.mock('@turf/turf', () => ({
  booleanPointInPolygon: vi.fn((_point, polygon) => {
    // Mock implementation - return true if the polygon has matching property
    return polygon.properties?.nazwa_zlewni === 'Test Zlewnia [1]';
  }),
  point: vi.fn((coords) => ({ type: 'Point', coordinates: coords })),
}));

describe('zlewnia-finder service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findZlewnia', () => {
    test('should find zlewnia with matching coordinates', async () => {
      // ARRANGE
      const mockGeojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [18.0, 52.0],
                  [18.1, 52.0],
                  [18.1, 52.1],
                  [18.0, 52.1],
                  [18.0, 52.0],
                ],
              ],
            },
            properties: {
              nazwa_zlewni: 'Test Zlewnia [1]',
              przeciazona: 'TAK',
            },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockGeojson),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      const result = await findZlewnia({ lat: 52.05, lng: 18.05 });

      // ASSERT
      expect(result).toEqual({
        nazwaZlewni: 'Test Zlewnia',
        isPrzeciazona: true,
      });
    });

    test('should remove suffix from zlewnia name', async () => {
      // ARRANGE
      const mockGeojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [18.0, 52.0],
                  [18.1, 52.0],
                  [18.1, 52.1],
                  [18.0, 52.1],
                  [18.0, 52.0],
                ],
              ],
            },
            properties: {
              nazwa_zlewni: 'Główna Zlewnia [2]',
              przeciazona: 'NIE',
            },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockGeojson),
      });
      vi.stubGlobal('fetch', mockFetch);

      // Mock booleanPointInPolygon to return true for this test
      const { booleanPointInPolygon } = await import('@turf/turf');
      vi.mocked(booleanPointInPolygon).mockReturnValueOnce(true);

      // ACT
      const result = await findZlewnia({ lat: 52.05, lng: 18.05 });

      // ASSERT
      expect(result?.nazwaZlewni).toBe('Główna Zlewnia');
      expect(result?.isPrzeciazona).toBe(false);
    });

    test('should handle isPrzeciazona as true when TAK', async () => {
      // ARRANGE
      const mockGeojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [18.0, 52.0],
                  [18.1, 52.0],
                  [18.1, 52.1],
                  [18.0, 52.1],
                  [18.0, 52.0],
                ],
              ],
            },
            properties: {
              nazwa_zlewni: 'Przeciążona [1]',
              przeciazona: 'TAK',
            },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockGeojson),
      });
      vi.stubGlobal('fetch', mockFetch);

      // Mock to return true for this test
      const { booleanPointInPolygon } = await import('@turf/turf');
      vi.mocked(booleanPointInPolygon).mockReturnValueOnce(true);

      // ACT
      const result = await findZlewnia({ lat: 52.05, lng: 18.05 });

      // ASSERT
      expect(result?.isPrzeciazona).toBe(true);
    });

    test('should handle isPrzeciazona as false when not TAK', async () => {
      // ARRANGE
      const mockGeojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [18.0, 52.0],
                  [18.1, 52.0],
                  [18.1, 52.1],
                  [18.0, 52.1],
                  [18.0, 52.0],
                ],
              ],
            },
            properties: {
              nazwa_zlewni: 'Normalna [1]',
              przeciazona: 'NIE',
            },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockGeojson),
      });
      vi.stubGlobal('fetch', mockFetch);

      // Mock to return true for first feature
      const { booleanPointInPolygon } = await import('@turf/turf');
      vi.mocked(booleanPointInPolygon).mockReturnValueOnce(true);

      // ACT
      const result = await findZlewnia({ lat: 52.05, lng: 18.05 });

      // ASSERT
      expect(result?.isPrzeciazona).toBe(false);
    });

    test('should return null when no matching zlewnia found', async () => {
      // ARRANGE
      const mockGeojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [18.0, 52.0],
                  [18.1, 52.0],
                  [18.1, 52.1],
                  [18.0, 52.1],
                  [18.0, 52.0],
                ],
              ],
            },
            properties: {
              nazwa_zlewni: 'Other Zlewnia [1]',
              przeciazona: 'NIE',
            },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockGeojson),
      });
      vi.stubGlobal('fetch', mockFetch);

      // Mock to return false (point not in polygon)
      const { booleanPointInPolygon } = await import('@turf/turf');
      vi.mocked(booleanPointInPolygon).mockReturnValue(false);

      // ACT
      const result = await findZlewnia({ lat: 52.05, lng: 18.05 });

      // ASSERT
      expect(result).toBeNull();
    });

    test('should return null on fetch error', async () => {
      // ARRANGE
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // ACT
      const result = await findZlewnia({ lat: 52.05, lng: 18.05 });

      // ASSERT
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Błąd w wyszukiwaniu zlewni:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    test('should use correct BASE_URL for geojson file', async () => {
      // ARRANGE
      const mockGeojson = {
        type: 'FeatureCollection',
        features: [],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockGeojson),
      });
      vi.stubGlobal('fetch', mockFetch);

      // ACT
      await findZlewnia({ lat: 52.05, lng: 18.05 });

      // ASSERT
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('assets/zlewnie_kd.geojson'),
      );
    });

    test('should handle multiple features and return first match', async () => {
      // ARRANGE
      const mockGeojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [] },
            properties: {
              nazwa_zlewni: 'First [1]',
              przeciazona: 'NIE',
            },
          },
          {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [] },
            properties: {
              nazwa_zlewni: 'Second [2]',
              przeciazona: 'TAK',
            },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockGeojson),
      });
      vi.stubGlobal('fetch', mockFetch);

      // Mock to return true only for the second feature
      const { booleanPointInPolygon } = await import('@turf/turf');
      vi.mocked(booleanPointInPolygon)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // ACT
      const result = await findZlewnia({ lat: 52.05, lng: 18.05 });

      // ASSERT
      expect(result?.nazwaZlewni).toBe('Second');
    });

    test('should transform coordinates using proj4', async () => {
      // ARRANGE
      const mockGeojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [] },
            properties: {
              nazwa_zlewni: 'Test [1]',
              przeciazona: 'NIE',
            },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockGeojson),
      });
      vi.stubGlobal('fetch', mockFetch);

      const proj4Mock = (await import('proj4')).default;
      const { point } = await import('@turf/turf');

      // ACT
      await findZlewnia({ lat: 52.05, lng: 18.05 });

      // ASSERT
      expect(proj4Mock).toHaveBeenCalledWith(
        'EPSG:4326',
        expect.stringContaining('+proj=tmerc'),
        [18.05, 52.05], // lng, lat order
      );
      expect(point).toHaveBeenCalled();
    });
  });
});
