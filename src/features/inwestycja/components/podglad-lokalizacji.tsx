import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import type { DzialkaData } from '../types/types';
import PodgladMapModal from './podglad-map-modal';

interface PodgladLokalizacjiProps {
  daneDzialki: DzialkaData;
}

export default function PodgladLokalizacji({
  daneDzialki,
}: PodgladLokalizacjiProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
      <DialogTrigger asChild>
        <p className="font-bold text-primary-blue text-xl uppercase px-4 py-[14px] hover:text-[#3a5ca0] transition-colors hover:cursor-pointer">
          Podgląd lokalizacji na mapie
        </p>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="!fixed !inset-0 !w-screen !h-screen !max-w-none !max-h-none !p-0 !m-0 !border-0 !rounded-none !top-0 !left-0 !translate-x-0 !translate-y-0 !grid-cols-1"
      >
        <PodgladMapModal daneDzialki={daneDzialki} />
      </DialogContent>
    </Dialog>
  );
}
