import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import {
  DEFAULT_POSITION,
  DEFAULT_ZOOM,
  markerIcon,
  PLOT_FOUND_ZOOM,
} from '../constants';
import { fetchDzialkaDataByCoordinates } from '../services/dzialka-parser';
import CustomPopupContent from './custom-popup-content';
import './map-override.css';
import type { DzialkaModel } from '@/types/inwestycja-model';
import type { AddressSearchResult } from '../types/addressTypes';

//helper component to change the map positon view
function ChangeMapView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (zoom !== undefined) {
      map.setView(center, zoom);
    } else {
      map.setView(center);
    }
  }, [center, zoom, map]);
  return null;
}

//helper component to read coordinates of the clicked point with useMapEvents hook
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapProps {
  daneDzialki: DzialkaModel | undefined;
  setIdentyfikatorFromMap: (value: string) => void;
  setDaneDzialki: (value: DzialkaModel | undefined) => void;
  setError: (value: string | null) => void;
  addressSearchResult?: AddressSearchResult | null;
}

export default function Map({
  daneDzialki,
  setIdentyfikatorFromMap,
  setDaneDzialki,
  setError,
  addressSearchResult,
}: MapProps) {
  const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [zoomLevel, setZoomLevel] = useState<number>(DEFAULT_ZOOM);

  //This function gets called with the clicked coordinates. It fetches the corresponding Działka with fetchDzialkaDataByCoordinates and sets DaneDzialki to the fetched data
  async function handleMapClick(lat: number, lng: number) {
    setError(null);
    try {
      const dzialkaData = await fetchDzialkaDataByCoordinates(lat, lng);
      setDaneDzialki(dzialkaData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Błąd podczas wyszukiwania działki',
      );
    }
  }

  //Whenever daneDzialki changes, the map moves to its coordinates and the zoom level changes
  useEffect(
    function () {
      if (daneDzialki) {
        setPosition([
          daneDzialki.centerCoordinates.lat,
          daneDzialki.centerCoordinates.lng,
        ]);
        setZoomLevel(PLOT_FOUND_ZOOM);
      } else {
        setPosition(DEFAULT_POSITION);
        setZoomLevel(DEFAULT_ZOOM);
      }
    },
    [daneDzialki],
  );

  //Whenever we find an address by address search, the map moves to its coordinates
  useEffect(
    function () {
      if (addressSearchResult) {
        setPosition([addressSearchResult.lat, addressSearchResult.lng]);
        setZoomLevel(PLOT_FOUND_ZOOM);
      }
    },
    [addressSearchResult],
  );

  return (
    <MapContainer
      center={position}
      zoom={zoomLevel}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ cursor: 'auto' }}
    >
      <ChangeMapView center={position} zoom={zoomLevel} />
      <MapClickHandler onMapClick={handleMapClick} />
      <ZoomControl position="bottomleft" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {daneDzialki && (
        <>
          <Polygon
            positions={daneDzialki.polygonCoordinates}
            pathOptions={{
              color: '#dc2626',
              weight: 3,
              opacity: 0.8,
              fillOpacity: 0.1,
              fillColor: '#dc2626',
            }}
          />
          <Marker position={position} icon={markerIcon}>
            <Popup closeButton={false} className="custom-popup">
              <div className="bg-white w-[417px] max-sm:w-[300px] sm:h-[256px] p-4 max-sm:py-2 shadow-[0px_0px_8px_0px_#0c4f7bcc] flex flex-col gap-4 text-primary-blue">
                <CustomPopupContent daneDzialki={daneDzialki} />
                <div className="flex max-sm:flex-col justify-end gap-4 max-sm:gap-2">
                  <DialogClose asChild>
                    <Button
                      variant="secondary"
                      className="max-sm:h-8 max-sm:px-3 max-sm:text-base"
                    >
                      Zamknij
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => setIdentyfikatorFromMap(daneDzialki.id)}
                      className="max-sm:h-8 max-sm:px-3 max-sm:text-base"
                    >
                      Wybierz
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </Popup>
          </Marker>
        </>
      )}

      {/* WMTS layer from geoportal.gov.pl */}
      {/* <TileLayer
        url="https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/StandardResolution?layer=ORTOFOTOMAPA&style=default&tilematrixset=EPSG:3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix={z}&TileCol={x}&TileRow={y}"
        attribution="&copy; Geoportal.gov.pl"
      /> */}
    </MapContainer>
  );
}
