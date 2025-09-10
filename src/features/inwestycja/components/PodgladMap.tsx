import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';
import CustomPopupContent from './CustomPopupContent';
import type { DzialkaData } from '../types/types';
import { markerIcon, PLOT_FOUND_ZOOM } from '../utils/constants';

interface PodgladMapProps {
  daneDzialki: DzialkaData;
}

export default function PodgladMap({ daneDzialki }: PodgladMapProps) {
  return (
    <MapContainer
      center={[daneDzialki.coordinates.lat, daneDzialki.coordinates.lng]}
      zoom={PLOT_FOUND_ZOOM}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <ZoomControl position="bottomleft" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[daneDzialki.coordinates.lat, daneDzialki.coordinates.lng]}
        icon={markerIcon}
      >
        <Popup closeButton={false} className="custom-popup">
          <div className="bg-white w-[417px] p-4 shadow-[0px_0px_8px_0px_#0c4f7bcc] flex flex-col gap-4 text-primary-blue">
            <CustomPopupContent daneDzialki={daneDzialki} />
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
