import { http, HttpResponse } from 'msw';
import type { AddressApiResponse } from '@/features/inwestycja/types/addressTypes';

// Mock data for testing
export const mockAddressResponse: AddressApiResponse = {
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

export const mockDzialkaResponse =
  '142801_1.0001.AR_1.51/1|DOLNOŚLĄSKIE|bolesławiecki|Osiecznica|Osiecznica|51/1|SRID=2180;POLYGON((358855.206308051 506827.929378615,358850.244847873 506814.692656992,358845.283387696 506801.455935369))';

export const mockZlewniaGeojson = {
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

export const handlers = [
  // GUGiK Address Search API
  http.get('https://services.gugik.gov.pl/uug/', ({ request }) => {
    const url = new URL(request.url);
    const requestType = url.searchParams.get('request');
    const location = url.searchParams.get('location');

    if (requestType !== 'GetAddress') {
      return HttpResponse.text('', { status: 400 });
    }

    if (!location || location.trim() === '') {
      return HttpResponse.text('', { status: 200 });
    }

    // Special cases for testing
    if (location.includes('Nieistniejący') || location.includes('No Results')) {
      return HttpResponse.json({
        type: 'FeatureCollection',
        'found objects': 0,
        'returned objects': 0,
        results: {},
      });
    }

    if (location.includes('InvalidJSON')) {
      return HttpResponse.text('Invalid JSON{', { status: 200 });
    }

    if (location.includes('NetworkError')) {
      return HttpResponse.error();
    }

    // Custom responses based on location
    if (location.includes('Marszałkowska')) {
      return HttpResponse.json({
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
      });
    }

    if (location.includes('Floriańska')) {
      return HttpResponse.json({
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
      });
    }

    if (location.includes('Główna')) {
      return HttpResponse.json({
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
      });
    }

    if (location.includes('invalid')) {
      return HttpResponse.json({
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
      });
    }

    // Default response
    return HttpResponse.json(mockAddressResponse);
  }),

  // ULDK Parcel API - GetParcelById
  http.get('https://uldk.gugik.gov.pl/', ({ request }) => {
    const url = new URL(request.url);
    const requestType = url.searchParams.get('request');
    const id = url.searchParams.get('id');
    const xy = url.searchParams.get('xy');

    // Handle GetParcelById
    if (requestType === 'GetParcelById') {
      if (!id || id.trim() === '') {
        return HttpResponse.text('0', { status: 200 });
      }

      if (id.length < 21) {
        return HttpResponse.text('0', { status: 200 });
      }

      if (id.includes('nonexistent') || id.includes('invalid')) {
        return HttpResponse.text('0', { status: 200 });
      }

      if (id.includes('malformed')) {
        return HttpResponse.text('invalid|response', { status: 200 });
      }

      // Return mock parcel data
      return HttpResponse.text(mockDzialkaResponse, { status: 200 });
    }

    // Handle GetParcelByXY
    if (requestType === 'GetParcelByXY') {
      if (!xy) {
        return HttpResponse.text('0', { status: 200 });
      }

      const [x, y] = xy.split(',').map(Number);

      if (isNaN(x) || isNaN(y)) {
        return HttpResponse.text('0', { status: 200 });
      }

      // Special case for "no parcel" coordinates
      if (x === 0 || y === 0) {
        return HttpResponse.text('0', { status: 200 });
      }

      if (xy.includes('invalid')) {
        return HttpResponse.text('invalid|response', { status: 200 });
      }

      // Return mock parcel data
      return HttpResponse.text(mockDzialkaResponse, { status: 200 });
    }

    return HttpResponse.text('0', { status: 400 });
  }),

  // Local GeoJSON file
  http.get('*/assets/zlewnie_kd.geojson', () => {
    return HttpResponse.json(mockZlewniaGeojson);
  }),
];
