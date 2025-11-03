import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { fetchDzialkaData } from '../services/dzialka-parser';
import { useState } from 'react';
import Spinner from '@/components/shared/spinner';
import type { DzialkaModel } from '@/types/inwestycja-model';
import { fetchAddressCoordinates } from '../services/address-search';
import type { AddressSearchResult } from '../types/addressTypes';

interface DzialkaInputProps {
  onAddressFound: (result: AddressSearchResult) => void;
  onDzialkaFound: (result: DzialkaModel) => void;
  error: string | null;
  setError: (value: string | null) => void;
}

export default function LocationInput({
  onAddressFound,
  onDzialkaFound,
  error,
  setError,
}: DzialkaInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  //helper function to determine if the inputted value is an address or działka
  function determineSearchType(value: string): 'address' | 'dzialka' {
    const firstChar = value.trim()[0];
    return /[0-9]/.test(firstChar) ? 'dzialka' : 'address';
  }

  async function clickHandler() {
    setIsLoading(true);
    try {
      const searchType = determineSearchType(inputValue);
      if (searchType === 'address') {
        const addressResult = await fetchAddressCoordinates(inputValue);
        onAddressFound(addressResult);
      } else {
        const dzialkaResult = await fetchDzialkaData(inputValue);
        onDzialkaFound(dzialkaResult);
      }

      setIsLoading(false);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
    }
  }

  return (
    <div className="absolute top-4 max-sm:top-2 sm:left-4 max-sm:mx-auto z-[9999] w-[332px] h-[80px] p-4 bg-white shadow-lg flex items-center justify-center">
      <div className="relative">
        <Input
          placeholder="Wpisz adres lub nr działki"
          className={`${error ? 'border-destructive' : 'border-primary-blue'} text-primary-blue w-[300px] h-12 bg-white !bg-opacity-100 text-sm font-medium placeholder:font-light placeholder:text-primary-blue`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {!isLoading ? (
          <button
            type="button"
            aria-label="Szukaj działki"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-blue w-[24px] h-[24px] flex items-center justify-center bg-transparent border-none cursor-pointer"
            onClick={clickHandler}
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
