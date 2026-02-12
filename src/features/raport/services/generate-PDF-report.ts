import { jsPDF } from 'jspdf';
import { setupPolishFonts } from '../helpers/font-setup';
import logoBase from '../logoBase.png';

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

// Helper function to get actual image dimensions and determine if it's from mobile
async function getImageDimensions(
  base64Data: string,
): Promise<{ width: number; height: number; isMobile: boolean }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      // Consider mobile if width is less than 768px (typical mobile breakpoint)
      const isMobile = width < 768;
      resolve({ width, height, isMobile });
    };
    img.src = base64Data;
  });
}

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
  pdf.text(`Identyfikator działki: ${identyfikatorInwestycji}`, 110, 67);
  pdf.text(`Zlewnia: ${nazwaZlewni}`, 110, 77);

  // Get actual image dimensions to determine device type and aspect ratio
  let isMobile = false;
  let mapImageWidth = 0;
  let mapImageHeight = 0;
  let mapImageX = 0;
  let mapImageY = 0;

  if (mapScreenshot) {
    const {
      width,
      height,
      isMobile: deviceIsMobile,
    } = await getImageDimensions(mapScreenshot);
    isMobile = deviceIsMobile;
    const actualAspectRatio = width / height;

    // Set maximum dimensions and maintain actual aspect ratio
    const maxWidth = 180;
    const maxHeight = 120;

    if (actualAspectRatio > maxWidth / maxHeight) {
      // Width is the limiting factor
      mapImageWidth = maxWidth;
      mapImageHeight = maxWidth / actualAspectRatio;
    } else {
      // Height is the limiting factor
      mapImageHeight = maxHeight;
      mapImageWidth = maxHeight * actualAspectRatio;
    }

    if (!isMobile) {
      mapImageX = (pageWidth - mapImageWidth) / 2; // Center the image
      mapImageY = 80;
    } else {
      mapImageX = pageWidth - mapImageWidth - 15; // Position on the right side
      mapImageY = 100;
    }

    if (!isMobile) {
      pdf.addImage(
        mapScreenshot,
        'PNG',
        mapImageX,
        mapImageY,
        mapImageWidth,
        mapImageHeight,
      );
    }
  }

  // 2. DANE OBLICZENIOWE
  pdf.setFontSize(12);
  pdf.setFont('Roboto', 'bold');
  const daneObliczenioweY = isMobile ? 95 : 165;
  pdf.text('2. Dane obliczeniowe [m²]', 20, daneObliczenioweY);

  if (mapScreenshot && isMobile) {
    pdf.addImage(
      mapScreenshot,
      'PNG',
      mapImageX,
      mapImageY,
      mapImageWidth,
      mapImageHeight,
    );
  }

  pdf.setFont('Roboto', 'normal');

  pdf.setFontSize(10);
  const textStartY = isMobile ? 105 : 175;
  const lineHeight = 10;

  pdf.text(
    'P0. Powierzchnia działki inwestycyjnej zgodnie z PZT:',
    15,
    textStartY,
  );
  pdf.text(`${powDzialki}`, isMobile ? 125 : 130, textStartY);

  pdf.text('P1. Powierzchnia dachów:', 15, textStartY + lineHeight);
  pdf.text(`${powDachow}`, isMobile ? 125 : 130, textStartY + lineHeight);

  pdf.text(
    'P2. Powierzchnia dachów/stropów nad halą garażową',
    15,
    textStartY + lineHeight * 2,
  );
  pdf.text(
    'zlokalizowaną poza obrysem budynku',
    15,
    textStartY + lineHeight * 2 + 5,
  );
  pdf.text(
    `${powDachowPozaObrysem}`,
    isMobile ? 125 : 130,
    textStartY + lineHeight * 2,
  );

  pdf.text(
    'P3. Powierzchnie uszczelnione zlokalizowane',
    15,
    textStartY + lineHeight * 3 + 5,
  );
  pdf.text('poza powierzchnią P2', 15, textStartY + lineHeight * 3 + 10);
  pdf.text(
    `${powUszczelnione}`,
    isMobile ? 125 : 130,
    textStartY + lineHeight * 3 + 5,
  );

  pdf.text(
    'P4. Powierzchnie przepuszczalne zakwalifikowane',
    15,
    textStartY + lineHeight * 4 + 10,
  );
  pdf.text('poza powierzchnią P2 i P5', 15, textStartY + lineHeight * 4 + 15);
  pdf.text(
    `${powPrzepuszczalne}`,
    isMobile ? 125 : 130,
    textStartY + lineHeight * 4 + 10,
  );

  pdf.text(
    'P5. Powierzchnie terenów innych, w tym zieleni nieurządzonej',
    15,
    textStartY + lineHeight * 5 + 15,
  );
  pdf.text(
    `${powTerenyInne}`,
    isMobile ? 125 : 130,
    textStartY + lineHeight * 5 + 15,
  );

  // DIVIDER
  pdf.setDrawColor(180, 200, 230); // blend between light grey and light blue
  const dividerY = textStartY + lineHeight * 5 + 21;
  pdf.line(15, dividerY, isMobile ? mapImageX - 10 : 195, dividerY);

  // WYMAGANA OBJECTOŚĆ
  pdf.setFontSize(12);
  pdf.setFont('Roboto', 'bold');
  const wymaganaObjY = dividerY + 14;
  pdf.text('Wymagana objętość obiektów BZI:', 15, wymaganaObjY);
  pdf.text(`${objBZI.toFixed(2)}`, isMobile ? 125 : 130, wymaganaObjY);

  pdf.setFontSize(10);
  pdf.text('lub', 15, wymaganaObjY + 7);

  pdf.setFontSize(12);
  pdf.text('Wymagana objętość obiektów detencyjnych:', 15, wymaganaObjY + 14);
  pdf.text(
    `${objDetencyjnych.toFixed(2)}`,
    isMobile ? 125 : 130,
    wymaganaObjY + 14,
  );

  pdf.setFont('Roboto', 'normal');

  // KLAUZULA
  pdf.setFontSize(7);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    'Informacje zawarte w raporcie są poglądowe i nie stanowią podstawy do wydania warunków technicznych przyłączenia do sieci kanalizacji deszczowej.',
    15,
    284,
  );

  // SAVE PDF
  pdf.save(`${identyfikatorInwestycji}.pdf`);
}
