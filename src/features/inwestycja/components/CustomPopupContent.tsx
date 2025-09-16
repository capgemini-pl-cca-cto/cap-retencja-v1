import type { DzialkaData } from '../types/types';

interface CustomPopupContentProps {
  daneDzialki: DzialkaData;
}

export default function CustomPopupContent({
  daneDzialki,
}: CustomPopupContentProps) {
  return (
    <div className="flex flex-col gap-2 text-base">
      <div className="flex">
        <p className="font-light w-[170px]">Identyfikator działki</p>
        <p className="font-medium">{daneDzialki.id}</p>
      </div>
      <div className="flex">
        <p className="font-light w-[170px]">Województwo</p>
        <p className="font-medium">{daneDzialki.voivodeship}</p>
      </div>
      <div className="flex">
        <p className="font-light w-[170px]">Powiat</p>
        <p className="font-medium">{daneDzialki.county}</p>
      </div>
      <div className="flex">
        <p className="font-light w-[170px]">Obręb</p>
        <p className="font-medium uppercase">{daneDzialki.region}</p>
      </div>
      <div className="flex">
        <p className="font-light w-[170px]">Numer działki</p>
        <p className="font-medium">{daneDzialki.parcel}</p>
      </div>
    </div>
  );
}
