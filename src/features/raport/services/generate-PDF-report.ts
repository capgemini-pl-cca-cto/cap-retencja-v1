import { jsPDF } from 'jspdf';
import { setupPolishFonts } from '../helpers/font-setup';
import logoBase from './logoBase.png';

interface RaportData {
  nazwaInwestycji: string;
  identyfikatorInwestycji: string;
  nazwaZlewni: string;
  powDzialki: number;
  powDachow: number;
  powDachowPozaObrysem: number;
  powUszczelnione: number;
  powPrzepuszczalne: number;
  powTerenyInne: number;
  objBZI: number;
  objDetencyjnych: number;
  mapScreenshot?: string;
}

const currentDate = new Date().toLocaleDateString('pl-PL');

export default async function generatePDFReport({
  nazwaInwestycji,
  identyfikatorInwestycji,
  nazwaZlewni,
  powDzialki,
  powDachow,
  powDachowPozaObrysem,
  powUszczelnione,
  powPrzepuszczalne,
  powTerenyInne,
  objBZI,
  objDetencyjnych,
  mapScreenshot,
}: RaportData) {
  // Initialize PDF with Polish font support
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', //210mm x 297mm
    putOnlyUsedFonts: true,
  });

  // Load and setup Polish font support (regular and bold)
  try {
    await setupPolishFonts(pdf);
    // Set font size to match standard PDF appearance
    pdf.setFontSize(12);
  } catch (error) {
    console.warn(
      'Failed to load custom font, falling back to standard font:',
      error,
    );
    // Fallback to standard font if custom font fails
    pdf.setFont('helvetica');
    pdf.setFontSize(12);
  }

  // Set normal character spacing
  pdf.setCharSpace(0);

  const pageWidth = pdf.internal.pageSize.getWidth();

  // LOGO AQUANET
  pdf.addImage(logoBase, 'PNG', 80, 3, 50, 20); //odleglosc od lewej, odleglosc od gory, dlugosc elementu, wysokosc elementu

  // DATA
  pdf.setFontSize(10);
  pdf.text(`Data: ${currentDate}`, 165, 30);

  // TYTUŁ
  pdf.setFontSize(16);
  // Switch to bold font
  pdf.setFont('Roboto', 'bold');
  const heading = 'RAPORT BILANSU OBJĘTOŚCI WODY OPADOWEJ';
  const headingWidth = pdf.getTextWidth(heading);
  const headingX = (pageWidth - headingWidth) / 2;
  pdf.text(heading, headingX, 40);

  // 1. SZCZEGÓŁY INWESTYCJI
  pdf.setFontSize(12);
  pdf.text('1. Szczegóły inwestycji', 20, 55);

  // Switch back to regular font
  pdf.setFont('Roboto', 'normal');

  pdf.setFontSize(10);
  pdf.text(`Nazwa inwestycji: ${nazwaInwestycji}`, 15, 67);
  pdf.text(`Identyfikator działki: ${identyfikatorInwestycji}`, 120, 67);
  pdf.text(`Zlewnia: ${nazwaZlewni}`, 120, 77);

  if (mapScreenshot) {
    // Calculate proper aspect ratio based on typical viewport dimensions
    // Assuming 95vw x 86vh translates to roughly 16:9 aspect ratio or wider
    const targetAspectRatio = 16 / 9; // Approximate aspect ratio of the captured div

    // Set maximum dimensions and maintain aspect ratio
    const maxWidth = 140; // Maximum width in mm
    const maxHeight = 100; // Maximum height in mm

    let mapImageWidth = maxWidth;
    let mapImageHeight = maxWidth / targetAspectRatio;

    // If calculated height exceeds max, scale down based on height
    if (mapImageHeight > maxHeight) {
      mapImageHeight = maxHeight;
      mapImageWidth = maxHeight * targetAspectRatio;
    }

    const mapImageX = (pageWidth - mapImageWidth) / 2; // Center the image
    pdf.addImage(
      mapScreenshot,
      'PNG',
      mapImageX,
      80,
      mapImageWidth,
      mapImageHeight,
    );
  }

  // 2. DANE OBLICZENIOWE
  pdf.setFontSize(12);
  pdf.setFont('Roboto', 'bold');
  pdf.text('2. Dane obliczeniowe [m²]', 20, 150);

  pdf.setFont('Roboto', 'normal');

  pdf.setFontSize(10);
  pdf.text('P0. Powierzchnia działki inwestycyjnej zgodnie z PZT:', 15, 160);
  pdf.text(`${powDzialki}`, 130, 160);

  pdf.text('P1. Powierzchnia dachów:', 15, 170);
  pdf.text(`${powDachow}`, 130, 170);

  pdf.text('P2. Powierzchnia dachów/stropów nad halą garażową', 15, 180);
  pdf.text('zlokalizowaną poza obrysem budynku', 15, 185);
  pdf.text(`${powDachowPozaObrysem}`, 130, 180);

  pdf.text('P3. Powierzchnie uszczelnione zlokalizowane', 15, 195);
  pdf.text('poza powierzchnią P2', 15, 200);
  pdf.text(`${powUszczelnione}`, 130, 195);

  pdf.text('P4. Powierzchnie przepuszczalne zakwalifikowane', 15, 210);
  pdf.text('poza powierzchnią P2 i P5', 15, 215);
  pdf.text(`${powPrzepuszczalne}`, 130, 210);

  pdf.text(
    'P5. Powierzchnie terenów innych, w tym zieleni nieurządzonej',
    15,
    225,
  );
  pdf.text(`${powTerenyInne}`, 130, 225);

  // DIVIDER
  pdf.setDrawColor(180, 200, 230); // blend between light grey and light blue
  pdf.line(15, 235, 195, 235);

  // WYMAGANA OBJECTOŚĆ
  pdf.setFontSize(12);
  pdf.setFont('Roboto', 'bold');
  pdf.text('Wymagana objętość obiektów BZI:', 15, 250);
  pdf.text(`${objBZI}`, 130, 250);

  pdf.setFontSize(10);
  pdf.text('lub', 15, 257);

  pdf.setFontSize(12);
  pdf.text('Wymagana objętość obiektów detencyjnych:', 15, 264);
  pdf.text(`${objDetencyjnych}`, 130, 264);

  pdf.setFont('Roboto', 'normal');

  // KLAUZULA
  pdf.setFontSize(7);
  pdf.setTextColor(128, 128, 128); // Set text color to grey
  pdf.text(
    'Informacje zawarte w raporcie są poglądowe i nie stanowią podstawy do wydania warunków technicznych przyłączenia do sieci kanalizacji deszczowej.',
    15,
    280,
  );
  pdf.setTextColor(0, 0, 0); // Reset text color to black for any following text

  // SAVE PDF
  pdf.save('raport-bilansu.pdf');
}
