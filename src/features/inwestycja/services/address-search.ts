import proj4 from 'proj4';
import type {
  AddressApiResponse,
  AddressSearchResult,
} from '../types/addressTypes';

// Define the Polish coordinate system (same as used in dzialka-parser.ts)
proj4.defs(
  'EPSG:2180',
  '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs',
);

//NOTE function which makes the API call with the entered address, fetches the returned data and converts the result's coordinates to LatLng
export async function fetchAddressCoordinates(
  address: string,
): Promise<AddressSearchResult> {
  if (!address.trim()) {
    throw new Error('Adres nie może być pusty');
  }

  //encode the entered address and construct the url
  const encodedAddress = encodeURIComponent(address);
  const url = `https://services.gugik.gov.pl/uug/?request=GetAddress&location=${encodedAddress}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!text || text.trim() === '') {
      throw new Error(`Nie znaleziono adresu: ${address}`);
    }

    // Convert the response from string to an object, only with the properties we want (TS takes care of it)
    let apiResponse: AddressApiResponse;
    try {
      apiResponse = JSON.parse(text);
    } catch {
      throw new Error(
        `Nieprawidłowa odpowiedź JSON API dla adresu: ${address}`,
      );
    }

    // Check if any results were found
    if (!apiResponse.results || Object.keys(apiResponse.results).length === 0) {
      throw new Error(`Nie znaleziono adresu: ${address}`);
    }

    // Get the first result object by first reading the key of the first result ("1") and then reading the object corresponding to it
    const firstResultKey = Object.keys(apiResponse.results)[0];
    const result = apiResponse.results[firstResultKey];

    // Parse coordinates (they are in string format) into a number
    const x = parseFloat(result.x);
    const y = parseFloat(result.y);

    if (isNaN(x) || isNaN(y)) {
      throw new Error(
        `Nieprawidłowe współrzędne dla adresu: ${address}. X: ${result.x}, Y: ${result.y}`,
      );
    }

    // Convert from EPSG:2180 (Polish coordinate system) to WGS84 (LatLng)
    const [lng, lat] = proj4('EPSG:2180', 'WGS84', [x, y]);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error(`Błąd konwersji współrzędnych dla adresu: ${address}`);
    }

    //return coords and address name
    return {
      lat,
      lng,
      address: `${result.street} ${result.number}, ${result.city}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Błąd podczas wyszukiwania adresu: ${address}`);
  }
}
