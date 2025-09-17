import type { Control } from 'react-hook-form';
import FormRadio from './form-radio';
import type { InwestycjaModel } from '../schemas';

interface TypZabudowyProps {
  isInwestycjaSubmitted: boolean;
  control: Control<InwestycjaModel>;
  typZabudowy: 'jednorodzinna' | 'wielorodzinna';
}

export default function TypZabudowy({
  isInwestycjaSubmitted,
  control,
  typZabudowy,
}: TypZabudowyProps) {
  return (
    <>
      {!isInwestycjaSubmitted ? (
        <FormRadio
          control={control}
          name="typZabudowy"
          mainLabel="Typ planowanej zabudowy"
          values={['jednorodzinna', 'wielorodzinna']}
          inputLabels={[
            'jednorodzinna',
            'wielorodzinna / usługowa / przemysłowa',
          ]}
        />
      ) : (
        <div>
          <p className="font-light">Typ planowanej zabudowy</p>
          <p>
            {typZabudowy === 'jednorodzinna'
              ? 'jednorodzinna'
              : 'wielorodzinna / usługowa / przemysłowa'}
          </p>
        </div>
      )}
    </>
  );
}
