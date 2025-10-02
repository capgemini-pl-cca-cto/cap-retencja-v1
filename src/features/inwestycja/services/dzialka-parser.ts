import proj4 from 'proj4';
import type { Coordinates, DzialkaResponse } from '../types/types';
import * as turf from '@turf/turf';
import type { DzialkaModel } from '@/types/inwestycja-model';

proj4.defs(
  'EPSG:2180',
  '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs',
);

//transforms WKT string into an array of pairs of (polish) coordinates with parseWktPolygon
function parseWktPolygon(wkt: string): number[][] {
  try {
    // Clean the WKT string: remove SRID prefix, POLYGON wrapper, and any trailing whitespace/newlines
    const coordsString = wkt
      .trim() // Remove any leading/trailing whitespace
      .replace(/^SRID=\d+;POLYGON\(\(/, '') // Remove SRID and opening
      .replace(/\)\)+\s*$/, ''); // Remove closing parentheses and any trailing whitespace

    // Split by commas to get coordinate pairs
    const coordPairs = coordsString.split(',');

    const coordinates = coordPairs.map((pair) => {
      const trimmed = pair.trim();

      const parts = trimmed.split(/\s+/);
      if (parts.length !== 2) {
        throw new Error(
          `Expected 2 coordinate values, got ${parts.length} in: ${trimmed}`,
        );
      }

      const [x, y] = parts.map(Number);

      // Validate that we have valid numbers
      if (isNaN(x) || isNaN(y)) {
        throw new Error(`Invalid coordinates: ${trimmed} (x=${x}, y=${y})`);
      }

      return [x, y];
    });

    if (coordinates.length < 3) {
      throw new Error('Polygon must have at least 3 coordinates');
    }

    return coordinates;
  } catch (error) {
    throw new Error(
      `Failed to parse WKT polygon: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

//accepts the API response, removes unnecessary 0s and splits it by | to extract needed info and return it as object
function parseDzialkaResponse(response: string): DzialkaResponse | null {
  // Remove any leading "0\n" from the response
  const cleanResponse = response.replace(/^0\n/, '');

  const parts = cleanResponse.split('|');
  if (parts.length < 7) return null;

  return {
    id: parts[0],
    voivodeship: parts[1],
    county: parts[2],
    commune: parts[3],
    region: parts[4],
    parcel: parts[5],
    geometry: parts[6],
  };
}

//accepts the WKT Polygon string in polish coordinate system
//transforms WKT string into an array of pairs of coordinates with parseWktPolygon
//from this array creates a polygon and calculates its center point coordinates with turf
//converts the center point coordinates to normal lat/lng with proj4
function getDzialkaCenterCoordinates(wktGeometry: string): Coordinates {
  // Parse WKT to get coordinates
  const coordinates = parseWktPolygon(wktGeometry);

  // Ensure the polygon is closed (first and last coordinates should be the same)
  if (coordinates.length > 0) {
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];

    // If not closed, add the first coordinate at the end
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coordinates.push([first[0], first[1]]);
    }
  }

  // Create a polygon in EPSG:2180 coordinate system
  const polygon = turf.polygon([coordinates]);

  // Get centroid
  const centroid = turf.centroid(polygon);
  const [x, y] = centroid.geometry.coordinates;

  // Convert from EPSG:2180 to WGS84
  const [lng, lat] = proj4('EPSG:2180', 'WGS84', [x, y]);

  return { lat, lng };
}

//the final function, does the API call, transforms the data with parseDzialkaResponse, gets the center point coords with getDzialkaCenterCoordinates and returns the whole data
export async function fetchDzialkaData(
  identyfikatorDzialki: string,
): Promise<DzialkaModel> {
  if (!identyfikatorDzialki.trim()) {
    throw new Error('Identyfikator działki nie może być pusty');
  }

  const url = `https://uldk.gugik.gov.pl/?request=GetParcelById&id=${encodeURIComponent(identyfikatorDzialki)}&result=teryt,voivodeship,county,commune,region,parcel,geom_wkt`;

  const response = await fetch(url);
  const text = await response.text();

  if (text === '0') {
    throw new Error(`Brak działki dla identyfikatora ${identyfikatorDzialki}`);
  }

  const parcelData = parseDzialkaResponse(text);
  if (!parcelData) {
    throw new Error(
      `Działka o takim identyfikatorze nie istnieje. Sprawdź poprawność numeru identyfikacyjnego działki lub wybierz działkę na mapie!`,
    );
  }

  // Get coordinates of the center point
  const { geometry, ...rest } = parcelData;
  const coordinates = getDzialkaCenterCoordinates(geometry);
  return { ...rest, coordinates };
}
