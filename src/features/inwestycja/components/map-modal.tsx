import { DialogClose } from '@/components/ui/dialog';
import { LucideCircleAlert, XIcon } from 'lucide-react';
import { useState } from 'react';
import DzialkaInput from './dzialka-input';
import './map-override.css';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Map from './map';
import type { DzialkaModel } from '@/types/inwestycja-model';

interface MapModalProps {
  setIdentyfikatorFromMap: (value: string) => void;
}

export default function MapModal({ setIdentyfikatorFromMap }: MapModalProps) {
  const [identyfikatorDzialki, setIdentyfikatorDzialki] = useState('');
  const [daneDzialki, setDaneDzialki] = useState<DzialkaModel | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start pt-8">
      <div className="flex items-center justify-between w-[95vw] mb-6">
        <h2 className="text-lg font-bold text-left text-primary-blue">
          Wyszukaj działkę na mapie
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
        <DzialkaInput
          identyfikatorDzialki={identyfikatorDzialki}
          setIdentyfikatorDzialki={setIdentyfikatorDzialki}
          setDaneDzialki={setDaneDzialki}
          error={error}
          setError={setError}
        />
        {error && (
          <Alert className="absolute top-4 right-4 z-[9999] w-[592px] border-destructive p-4 bg-background [&>svg]:text-destructive [&>svg]:translate-y-0 flex items-center shadow-[0px_4px_5px_1px_#00000026]">
            <LucideCircleAlert className="text-destructive" />
            <AlertDescription className="text-destructive text-base font-medium">
              {error}
            </AlertDescription>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-auto text-destructive hover:text-destructive/80 transition-colors"
              aria-label="Close alert"
            >
              <XIcon className="size-6" />
            </button>
          </Alert>
        )}
        <Map
          daneDzialki={daneDzialki}
          setIdentyfikatorFromMap={setIdentyfikatorFromMap}
        />
      </div>
    </div>
  );
}
