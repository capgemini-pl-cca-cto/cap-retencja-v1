import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogClose } from '@/components/ui/dialog';
import type { DzialkaModel } from '@/types/inwestycja-model';
import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AddressSearchResult } from '../types/addressTypes';
import { fetchDzialkaData } from '../services/dzialka-parser';
import LocationInput from './location-input';
import Map from './map';
import './map-override.css';

interface MapModalProps {
  setIdentyfikatorFromMap: (value: string) => void;
  watchedIdentyfikator: string | undefined;
}

export default function MapModal({
  setIdentyfikatorFromMap,
  watchedIdentyfikator,
}: MapModalProps) {
  const [daneDzialki, setDaneDzialki] = useState<DzialkaModel | undefined>(
    undefined,
  );
  const [daneAdresu, setDaneAdresu] = useState<AddressSearchResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Load previously selected dzialka when modal opens
  useEffect(() => {
    if (watchedIdentyfikator && watchedIdentyfikator.trim() !== '') {
      fetchDzialkaData(watchedIdentyfikator)
        .then((data) => {
          setDaneDzialki(data);
        })
        .catch(() => {
          setDaneDzialki(undefined);
        });
    }
  }, []);

  //when the entered address is found by the API, clear daneDzialki and set the state
  function handleAddressFound(result: AddressSearchResult) {
    setDaneDzialki(undefined);
    setDaneAdresu(result);
    setError(null);
  }

  //set daneDzialki to the found dzialka and clear the address
  function handleDzialkaSet(dzialka: DzialkaModel | undefined) {
    setDaneDzialki(dzialka);
    if (dzialka) {
      setDaneAdresu(null);
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start pt-8">
      <div className="flex items-center justify-between w-[95vw]">
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
      <h3 className="text-sm text-primary-blue mr-auto w-[95vw] mx-auto">
        Wpisz adres w formie: miasto, ulica numer np. Poznań, Bułgarska 17
      </h3>
      <div className="w-[95vw] h-[86vh] relative flex justify-center items-center">
        <LocationInput
          onDzialkaFound={handleDzialkaSet}
          onAddressFound={handleAddressFound}
          error={error}
          setError={setError}
        />
        {error && (
          <Alert className="max-sm:hidden absolute top-4 right-4 z-[9999] w-[592px] max-xl:w-[50%] border-destructive p-4 bg-background [&>svg]:text-destructive [&>svg]:translate-y-0 flex items-center shadow-[0px_4px_5px_1px_#00000026]">
            <svg
              width="20"
              height="20"
              className="flex-shrink-0 mt-[2px]"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 15C10.2833 15 10.5208 14.9042 10.7125 14.7125C10.9042 14.5208 11 14.2833 11 14C11 13.7167 10.9042 13.4792 10.7125 13.2875C10.5208 13.0958 10.2833 13 10 13C9.71667 13 9.47917 13.0958 9.2875 13.2875C9.09583 13.4792 9 13.7167 9 14C9 14.2833 9.09583 14.5208 9.2875 14.7125C9.47917 14.9042 9.71667 15 10 15ZM9 11H11V5H9V11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                fill="#CF2E2E"
              />
            </svg>
            <AlertDescription className="text-destructive text-base max-lg:text-sm font-medium">
              {error.includes('Działka o takim identyfikatorze nie istnieje.')
                ? 'Działka o takim identyfikatorze nie istnieje.'
                : error}
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
          setDaneDzialki={handleDzialkaSet}
          setError={setError}
          daneAdresu={daneAdresu}
        />
      </div>
    </div>
  );
}
