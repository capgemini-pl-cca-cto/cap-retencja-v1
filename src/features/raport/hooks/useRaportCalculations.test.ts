import type { RaportModel } from '@/types/raport-model';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';
import findZlewnia from '../services/zlewnia-finder';
import { useRaportCalculations } from './useRaportCalculations';

// Mock the zlewnia finder service
vi.mock('../services/zlewnia-finder');

describe('useRaportCalculations', () => {
  const mockFindZlewnia = vi.mocked(findZlewnia);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseMockData: RaportModel = {
    inwestycja: {
      nazwaInwestycji: 'Test',
      identyfikatorInwestycji: 'TEST-001',
      typZabudowy: 'jednorodzinna',
      isPodlaczony: 'nie',
      isIstniejacePolaczenie: 'nie',
    },
    daneKalkulator: {
      powDzialki: 1000,
      powDachow: 200,
      powDachowPozaObrysem: 100,
      powUszczelnione: 300,
      powPrzepuszczalne: 200,
      powTerenyInne: 200,
    },
    daneDzialki: {
      id: 'test',
      voivodeship: 'test',
      county: 'test',
      commune: 'test',
      region: 'test',
      parcel: 'test',
      centerCoordinates: { lat: 52.4, lng: 16.9 },
      polygonCoordinates: [[52.4, 16.9]],
    },
    mapScreenshot: undefined,
  };

  describe('jednorodzinna building type', () => {
    test('calculates objBZI correctly for jednorodzinna', () => {
      const mockData = { ...baseMockData };
      const { result } = renderHook(() => useRaportCalculations(mockData));

      // Sum: 200 + 100 + 300 + 200 = 800
      // objBZI: 800 * 0.06 = 48
      expect(result.current.objBZI).toBe(48);
    });

    test('calculates objDetencyjnych as double of objBZI', () => {
      const mockData = { ...baseMockData };
      const { result } = renderHook(() => useRaportCalculations(mockData));

      expect(result.current.objDetencyjnych).toBe(96); // 48 * 2
    });

    test('sets nazwaZlewni to "-" for jednorodzinna', async () => {
      const mockData = { ...baseMockData };
      const { result } = renderHook(() => useRaportCalculations(mockData));

      await waitFor(() => {
        expect(result.current.nazwaZlewni).toBe('-');
      });
    });

    test('does not call findZlewnia for jednorodzinna', async () => {
      const mockData = { ...baseMockData };
      renderHook(() => useRaportCalculations(mockData));

      await waitFor(() => {
        expect(mockFindZlewnia).not.toHaveBeenCalled();
      });
    });
  });

  describe('wielorodzinna with isPodlaczony "nie"', () => {
    test('calculates objBZI with 0.06 multiplier', () => {
      const mockData = {
        ...baseMockData,
        inwestycja: {
          ...baseMockData.inwestycja,
          typZabudowy: 'wielorodzinna' as const,
          isPodlaczony: 'nie' as const,
        },
      };
      const { result } = renderHook(() => useRaportCalculations(mockData));

      // 800 * 0.06 = 48
      expect(result.current.objBZI).toBe(48);
    });

    test('does not call findZlewnia when isPodlaczony is "nie"', async () => {
      const mockData = {
        ...baseMockData,
        inwestycja: {
          ...baseMockData.inwestycja,
          typZabudowy: 'wielorodzinna' as const,
          isPodlaczony: 'nie' as const,
        },
      };
      renderHook(() => useRaportCalculations(mockData));

      await waitFor(() => {
        expect(mockFindZlewnia).not.toHaveBeenCalled();
      });
    });
  });

  describe('wielorodzinna with isPodlaczony "tak"', () => {
    test('calls findZlewnia with correct coordinates', async () => {
      const mockData = {
        ...baseMockData,
        inwestycja: {
          ...baseMockData.inwestycja,
          typZabudowy: 'wielorodzinna' as const,
          isPodlaczony: 'tak' as const,
        },
      };

      mockFindZlewnia.mockResolvedValue({
        nazwaZlewni: 'Test Zlewnia',
        isPrzeciazona: false,
      });

      renderHook(() => useRaportCalculations(mockData));

      await waitFor(() => {
        expect(mockFindZlewnia).toHaveBeenCalledWith({ lat: 52.4, lng: 16.9 });
      });
    });

    test('calculates objBZI with 0.03 multiplier when not przeciazona', async () => {
      const mockData = {
        ...baseMockData,
        inwestycja: {
          ...baseMockData.inwestycja,
          typZabudowy: 'wielorodzinna' as const,
          isPodlaczony: 'tak' as const,
        },
      };

      mockFindZlewnia.mockResolvedValue({
        nazwaZlewni: 'Test Zlewnia',
        isPrzeciazona: false,
      });

      const { result } = renderHook(() => useRaportCalculations(mockData));

      await waitFor(() => {
        // 800 * 0.03 = 24
        expect(result.current.objBZI).toBe(24);
      });
    });

    test('calculates objBZI with 0.04 multiplier when przeciazona', async () => {
      const mockData = {
        ...baseMockData,
        inwestycja: {
          ...baseMockData.inwestycja,
          typZabudowy: 'wielorodzinna' as const,
          isPodlaczony: 'tak' as const,
        },
      };

      mockFindZlewnia.mockResolvedValue({
        nazwaZlewni: 'Test Zlewnia',
        isPrzeciazona: true,
      });

      const { result } = renderHook(() => useRaportCalculations(mockData));

      await waitFor(() => {
        // 800 * 0.04 = 32
        expect(result.current.objBZI).toBe(32);
      });
    });

    test('sets nazwaZlewni from API response', async () => {
      const mockData = {
        ...baseMockData,
        inwestycja: {
          ...baseMockData.inwestycja,
          typZabudowy: 'wielorodzinna' as const,
          isPodlaczony: 'tak' as const,
        },
      };

      mockFindZlewnia.mockResolvedValue({
        nazwaZlewni: 'Bogdanka',
        isPrzeciazona: false,
      });

      const { result } = renderHook(() => useRaportCalculations(mockData));

      await waitFor(() => {
        expect(result.current.nazwaZlewni).toBe('Bogdanka');
      });
    });
  });

  describe('surface calculation', () => {
    test('calculates sum of all relevant surfaces', () => {
      const mockData = {
        ...baseMockData,
        daneKalkulator: {
          ...baseMockData.daneKalkulator,
          powDachow: 100,
          powDachowPozaObrysem: 50,
          powUszczelnione: 150,
          powPrzepuszczalne: 100,
          powTerenyInne: 0, // Should not be included
        },
      };

      const { result } = renderHook(() => useRaportCalculations(mockData));

      // Sum: 100 + 50 + 150 + 100 = 400
      // objBZI: 400 * 0.06 = 24
      expect(result.current.objBZI).toBe(24);
    });
  });
});
