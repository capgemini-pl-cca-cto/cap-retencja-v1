import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from 'react-leaflet';
import type { DzialkaData } from '../types/types';
import {
  DEFAULT_POSITION,
  DEFAULT_ZOOM,
  markerIcon,
  PLOT_FOUND_ZOOM,
} from '../utils/constants';
import CustomPopupContent from './custom-popup-content';
import './map-override.css';

// NOTE: Examples
//306401_1.0021.AR_09.58/3
//306401_1.0005.AR_02.95
//306401_1.0006.AR_11.16/1

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

interface MapProps {
  daneDzialki: DzialkaData | undefined;
  setIdentyfikatorFromMap: (value: string) => void;
}

export default function Map({
  daneDzialki,
  setIdentyfikatorFromMap,
}: MapProps) {
  const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [zoomLevel, setZoomLevel] = useState<number>(DEFAULT_ZOOM);

  useEffect(
    function () {
      if (daneDzialki) {
        setPosition([daneDzialki.coordinates.lat, daneDzialki.coordinates.lng]);
        setZoomLevel(PLOT_FOUND_ZOOM);
      } else {
        setPosition(DEFAULT_POSITION);
        setZoomLevel(DEFAULT_ZOOM);
      }
    },
    [daneDzialki],
  );

  return (
    <MapContainer
      center={position}
      zoom={zoomLevel}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <ChangeMapView center={position} zoom={zoomLevel} />
      <ZoomControl position="bottomleft" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {daneDzialki && (
        <Marker position={position} icon={markerIcon}>
          <Popup closeButton={false} className="custom-popup">
            <div className="bg-white w-[417px] h-[256px] p-4 shadow-[0px_0px_8px_0px_#0c4f7bcc] flex flex-col gap-4 text-primary-blue">
              <CustomPopupContent daneDzialki={daneDzialki} />
              <div className="flex justify-end gap-4">
                <DialogClose asChild>
                  <Button variant="secondary">Zamknij</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={() => setIdentyfikatorFromMap(daneDzialki.id)}
                  >
                    Wybierz
                  </Button>
                </DialogClose>
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* WMTS layer from geoportal.gov.pl */}
      {/* <TileLayer
        url="https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/StandardResolution?layer=ORTOFOTOMAPA&style=default&tilematrixset=EPSG:3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix={z}&TileCol={x}&TileRow={y}"
        attribution="&copy; Geoportal.gov.pl"
      /> */}
    </MapContainer>
  );
}
