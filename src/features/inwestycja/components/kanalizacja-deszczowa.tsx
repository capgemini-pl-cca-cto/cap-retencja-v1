import type { Control } from 'react-hook-form';
import InfoBox from '@/components/shared/info-box';
import FormRadio from './form-radio';
import type { InwestycjaModel } from '@/types/inwestycja-model';

interface KanalizacjaDeszczowaProps {
  isInwestycjaSubmitted: boolean;
  control: Control<InwestycjaModel>;
  typZabudowy: 'jednorodzinna' | 'wielorodzinna';
  isPodłączony: 'tak' | 'nie';
}

export default function KanalizacjaDeszczowa({
  isInwestycjaSubmitted,
  control,
  typZabudowy,
  isPodłączony,
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
        <FormRadio
          control={control}
          name="isPodłączony"
          mainLabel="Czy dana zabudowa ma zostać podłączona do miejskiej sieci
            kanalizacji deszczowej?"
          values={['tak', 'nie']}
          inputLabels={['tak', 'nie']}
        />
      )}
      {isInwestycjaSubmitted && typZabudowy === 'wielorodzinna' && (
        <div>
          <p className="font-light">
            Czy dana zabudowa ma zostać podłączona do miejskiej sieci
            kanalizacji deszczowej?
          </p>
          <p>{isPodłączony === 'tak' ? 'tak' : 'nie'}</p>
        </div>
      )}
    </>
  );
}
