import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { fetchDzialkaData } from '../services/dzialka-parser';
import { useState } from 'react';
import Spinner from '@/components/shared/spinner';
import type { DzialkaModel } from '@/types/inwestycja-model';

interface DzialkaInputProps {
  identyfikatorDzialki: string;
  setIdentyfikatorDzialki: (value: string) => void;
  setDaneDzialki: (value: DzialkaModel) => void;
  error: string | null;
  setError: (value: string | null) => void;
}

export default function DzialkaInput({
  identyfikatorDzialki,
  setIdentyfikatorDzialki,
  setDaneDzialki,
  error,
  setError,
}: DzialkaInputProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function clickHandler() {
    setIsLoading(true);
    try {
      const dzialkaData = await fetchDzialkaData(identyfikatorDzialki);
      setDaneDzialki({ ...dzialkaData });
      setIsLoading(false);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
    }
  }

  return (
    <div className="absolute top-4 left-4 z-[9999] w-[332px] h-[80px] p-4 bg-white shadow-lg flex items-center justify-center">
      <div className="relative">
        <Input
          placeholder="Wpisz identyfikator działki"
          className={`${error ? 'border-destructive' : 'border-primary-blue'} text-primary-blue w-[300px] h-12 bg-white !bg-opacity-100 text-sm font-medium placeholder:font-light placeholder:text-primary-blue`}
          value={identyfikatorDzialki}
          onChange={(e) => setIdentyfikatorDzialki(e.target.value)}
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
