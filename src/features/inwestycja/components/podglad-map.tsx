import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';
import CustomPopupContent from './custom-popup-content';
import { markerIcon, PLOT_FOUND_ZOOM } from '../constants';
import type { DzialkaModel } from '@/types/inwestycja-model';

interface PodgladMapProps {
  daneDzialki: DzialkaModel;
}

export default function PodgladMap({ daneDzialki }: PodgladMapProps) {
  return (
    <MapContainer
      center={[
        daneDzialki.centerCoordinates.lat,
        daneDzialki.centerCoordinates.lng,
      ]}
      zoom={PLOT_FOUND_ZOOM}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <ZoomControl position="bottomleft" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
      <Marker
        position={[
          daneDzialki.centerCoordinates.lat,
          daneDzialki.centerCoordinates.lng,
        ]}
        icon={markerIcon}
      >
        <Popup closeButton={false} className="custom-popup">
          <div className="bg-white w-[417px] max-sm:w-[300px] p-4 shadow-[0px_0px_8px_0px_#0c4f7bcc] flex flex-col gap-4 text-primary-blue">
            <CustomPopupContent daneDzialki={daneDzialki} />
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
