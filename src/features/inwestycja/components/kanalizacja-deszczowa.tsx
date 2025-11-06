import type { Control } from 'react-hook-form';
import InfoBox from '@/components/shared/info-box';
import FormRadio from './form-radio';
import type { InwestycjaModel } from '@/types/inwestycja-model';
import type { Potwierdzenie } from '@/types/inwestycja-model';

interface KanalizacjaDeszczowaProps {
  isInwestycjaSubmitted: boolean;
  control: Control<InwestycjaModel>;
  typZabudowy: 'jednorodzinna' | 'wielorodzinna';
  isPodlaczony: Potwierdzenie;
  isIstniejacePolaczenie: Potwierdzenie;
}

export default function KanalizacjaDeszczowa({
  isInwestycjaSubmitted,
  control,
  typZabudowy,
  isPodlaczony,
  isIstniejacePolaczenie,
}: KanalizacjaDeszczowaProps) {
  return (
    <>
      {!isInwestycjaSubmitted && typZabudowy === 'jednorodzinna' && (
        <InfoBox
          label="W przypadku zabudowy jednorodzinnej nie ma możliwości podłączenia
                  się do kanalizacji deszczowej."
        />
      )}
      {!isInwestycjaSubmitted && typZabudowy === 'wielorodzinna' && (
        <>
          <FormRadio
            control={control}
            name="isPodlaczony"
            mainLabel="Czy dana zabudowa ma zostać podłączona do miejskiej sieci
            kanalizacji deszczowej?"
            values={['tak', 'nie']}
            inputLabels={['tak', 'nie']}
          />
          <div className="mt-4">
            <FormRadio
              control={control}
              name="isIstniejacePolaczenie"
              mainLabel="Czy istniejąca zabudowa ma podłączenie do miejskiej sieci
              kanalizacji deszczowej?"
              values={['tak', 'nie']}
              inputLabels={['tak', 'nie']}
            />
          </div>
        </>
      )}
      {isInwestycjaSubmitted && typZabudowy === 'wielorodzinna' && (
        <>
          <div className="mb-4">
            <p className="font-light">
              Czy dana zabudowa ma zostać podłączona do miejskiej sieci
              kanalizacji deszczowej?
            </p>
            <p>{isPodlaczony === 'tak' ? 'tak' : 'nie'}</p>
          </div>
          <div>
            <p className="font-light">
              Czy istniejąca zabudowa ma podłączenie do miejskiej sieci
              kanalizacji deszczowej?
            </p>
            <p>{isIstniejacePolaczenie === 'tak' ? 'tak' : 'nie'}</p>
          </div>
        </>
      )}
    </>
  );
}
