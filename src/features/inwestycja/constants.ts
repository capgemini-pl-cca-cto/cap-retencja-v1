import L from 'leaflet';

export const DEFAULT_POSITION: [number, number] = [52.408203, 16.933508];
export const DEFAULT_ZOOM = 13;
export const PLOT_FOUND_ZOOM = 16;
export const markerIcon = new L.Icon({
  iconUrl: `${import.meta.env.BASE_URL}assets/Vector.svg`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Canvas renderer for proper html2canvas screenshot rendering
export const canvasRenderer = L.canvas();
