import { DialogClose } from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas-pro';
import { useInwestycjaStore } from '@/store/inwestycjaStore';
import type { DzialkaData } from '../types/types';
import './MapOverride.css';
import PodgladMap from './PodgladMap';

interface PodgladMapModalProps {
  daneDzialki: DzialkaData;
}

export default function PodgladMapModal({ daneDzialki }: PodgladMapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { setMapScreenshot } = useInwestycjaStore();

  async function captureMapScreenshot() {
    try {
      // Double check the ref is still available and has dimensions
      if (
        !mapRef.current ||
        mapRef.current.offsetWidth === 0 ||
        mapRef.current.offsetHeight === 0
      ) {
        console.warn('Map container is not properly rendered yet');
        return;
      }

      const canvas = await html2canvas(mapRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
        logging: false, // Disable html2canvas logging
      });

      const dataUrl = canvas.toDataURL('image/png');
      setMapScreenshot(dataUrl);
    } catch (error) {
      console.error('Failed to capture map screenshot:', error);
    }
  }

  useEffect(() => {
    // Capture screenshot after component mounts and map is rendered
    // Use 2s delay to ensure the map is fully loaded
    const timer = setTimeout(captureMapScreenshot, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start pt-8">
      <div className="flex items-center justify-between w-[95vw] mb-6">
        <h2 className="text-lg font-bold text-left text-primary-blue">
          Podgląd działki {daneDzialki.id}
        </h2>
        <DialogClose asChild>
          <button
            type="button"
            aria-label="Zamknij mapę"
            className="ml-auto text-primary-blue"
          >
            <XIcon className="size-10" />
          </button>
        </DialogClose>
      </div>
      <div
        ref={mapRef}
        className="w-[95vw] h-[86vh] relative flex justify-center items-center"
      >
        <PodgladMap daneDzialki={daneDzialki} />
      </div>
    </div>
  );
}
