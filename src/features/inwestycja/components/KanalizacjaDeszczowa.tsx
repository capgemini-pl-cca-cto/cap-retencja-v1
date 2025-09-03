import type { Control } from 'react-hook-form';
import type { InwestycjaModel } from '../schemas';
import InfoBox from '@/components/shared/InfoBox';
import FormRadio from './FormRadio';

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
          mainLabel="Czy chcesz podłączyć się do sieci kanalizacji deszczowej lub, gdy masz już przyłącze, chcesz pozostać podłączony?"
          values={['tak', 'nie']}
          inputLabels={['tak', 'nie']}
        />
      )}
      {isInwestycjaSubmitted && typZabudowy === 'wielorodzinna' && (
        <div>
          <p className="font-light">
            Czy chcesz podłączyć się do sieci kanalizacji deszczowej lub, gdy
            masz już przyłącze, chcesz pozostać podłączony?
          </p>
          <p>{isPodłączony === 'tak' ? 'tak' : 'nie'}</p>
        </div>
      )}
    </>
  );
}
