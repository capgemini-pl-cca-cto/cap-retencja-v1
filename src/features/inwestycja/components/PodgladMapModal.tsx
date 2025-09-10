import { DialogClose } from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';
import type { DzialkaData } from '../types/types';
import './MapOverride.css';
import PodgladMap from './PodgladMap';

interface PodgladMapModalProps {
  daneDzialki: DzialkaData;
}

export default function PodgladMapModal({ daneDzialki }: PodgladMapModalProps) {
  // Remove Enter key handler; use button instead
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
      <div className="w-[95vw] h-[86vh] relative flex justify-center items-center">
        <PodgladMap daneDzialki={daneDzialki} />
      </div>
    </div>
  );
}
