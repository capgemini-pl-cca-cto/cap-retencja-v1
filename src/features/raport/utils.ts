import { booleanPointInPolygon, point } from '@turf/turf';
import proj4 from 'proj4';

const WGS84 = 'EPSG:4326';
const EPSG2177 =
  '+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

export default async function findZlewnia(coordinates: {
  lat: number;
  lng: number;
}) {
  try {
    const response = await fetch('zlewnie_kd.geojson');
    const geojsonData = await response.json();

    // Transform coordinates from WGS84 to EPSG:2177 using proj4
    const transformedCoords = proj4(WGS84, EPSG2177, [
      coordinates.lng,
      coordinates.lat,
    ]);
    const testPoint = point(transformedCoords);

    for (const feature of geojsonData.features) {
      // Turf.js for accurate point-in-polygon test
      if (booleanPointInPolygon(testPoint, feature)) {
        return {
          nazwaZlewni: feature.properties.nazwa_zlewni,
          isPrzeciazona:
            feature.properties.przeciazona === 'TAK' ? true : false,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding zlewnia:', error);
    return null;
  }
}
