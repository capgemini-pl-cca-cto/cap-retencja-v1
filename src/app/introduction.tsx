import InfoBox from '@/components/shared/info-box';

export default function Introduction() {
  return (
    <div className="flex flex-col gap-4 w-[825px] max-lg:w-auto">
      <div className="relative w-[263px] flex justify-center">
        <h2 className="font-black text-[42px] z-10 relative leading-[50px]">
          Kalkulator
        </h2>
        <div className="absolute left-0 top-[77%] -translate-y-1/2 w-[264px] h-[11px] bg-[#A2D089] z-0"></div>
      </div>
      <p className="font-bold">
        Sprawdź, ile deszczu powinieneś retencjonować / detencjonować na terenie
        swojej nieruchomości.
      </p>
      <div className="flex flex-col gap-2">
        <span className="font-light">
          Więcej informacji o programie i wymogach obliczeniowych znajdziesz pod
          linkami:
        </span>
        <a
          href="https://www.aquanet-retencja.pl/wp-content/uploads/2024/07/WYTYCZNE-DO-PROJEKTOWANIA-Wymagania-Ogolne.pdf"
          className="font-medium underline"
          target="_blank"
          rel="noreferrer noopener"
        >
          Wytyczne do projektowania: Projektowanie, wykonawstwo zagospodarowania
          wód opadowych i roztopowych za pomocą błękitno-zielonej infrastruktury
          (BZI) oraz sieci przyłączy kanalizacji deszczowej
        </a>
        <a
          href="https://www.poznan.pl/mim/main/-,p,68775.html"
          className="font-medium underline"
          target="_blank"
          rel="noreferrer noopener"
        >
          Program dotacyjny UM "Mała retencja"
        </a>
      </div>
      <InfoBox
        label='Niniejsze obliczenia i wynik "wymaganej pojemności retencyjnej / detencyjnej" są szacunkowe. Ostateczne parametry obliczeniowe będą wynikały z warunków technicznych / informacji o które może wystąpić klient. Kalkulator odnosi się jedynie do pól inwestycyjnych bez układów drogowych.'
        className="max-lg:w-[85%]"
      />
    </div>
  );
}
