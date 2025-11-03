import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import Spinner from '@/components/shared/spinner';
import { fetchAddressCoordinates } from '../services/address-search';
import type { AddressSearchResult } from '../types/addressTypes';

interface AddressInputProps {
  onAddressFound: (result: AddressSearchResult) => void;
  error: string | null;
  setError: (value: string | null) => void;
}

export default function AddressInput({
  onAddressFound,
  error,
  setError,
}: AddressInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');

  //calls the fetchAddressCoordinates to fetch the address object, sets the state addressSearchResult and clears daneDzialki by calling onAddressFound
  async function clickHandler() {
    setIsLoading(true);
    try {
      const addressResult = await fetchAddressCoordinates(address);
      onAddressFound(addressResult);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
    }
  }

  return (
    <div className="absolute top-[108px] max-sm:top-[104px] sm:left-4 max-sm:mx-auto z-[9999] w-[332px] h-[80px] p-4 bg-white shadow-lg flex items-center justify-center">
      <div className="relative">
        <Input
          placeholder="Wpisz adres (np. Poznań, Barańczaka 3J)"
          className={`${error ? 'border-destructive' : 'border-primary-blue'} text-primary-blue w-[300px] h-12 bg-white !bg-opacity-100 text-sm font-medium placeholder:font-light placeholder:text-primary-blue`}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {!isLoading ? (
          <button
            type="button"
            aria-label="Szukaj adresu"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-blue w-[24px] h-[24px] flex items-center justify-center bg-transparent border-none cursor-pointer"
            onClick={clickHandler}
          >
            <MapPin className="w-[18px] h-[18px]" />
          </button>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
