import { describe, expect, test, vi, beforeEach } from 'vitest';
import generatePDFReport from './generate-PDF-report';

// Mock all the jsPDF methods using vi.hoisted
const {
  mockAddImage,
  mockSetFontSize,
  mockSetFont,
  mockSetCharSpace,
  mockText,
  mockSetDrawColor,
  mockLine,
  mockSetTextColor,
  mockSave,
  mockGetTextWidth,
  MockJsPDF,
} = vi.hoisted(() => {
  const mockAddImage = vi.fn();
  const mockSetFontSize = vi.fn();
  const mockSetFont = vi.fn();
  const mockSetCharSpace = vi.fn();
  const mockText = vi.fn();
  const mockSetDrawColor = vi.fn();
  const mockLine = vi.fn();
  const mockSetTextColor = vi.fn();
  const mockSave = vi.fn();
  const mockGetTextWidth = vi.fn().mockReturnValue(100);
  const mockGetWidth = vi.fn().mockReturnValue(210);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockJsPDF = vi.fn(function (this: any) {
    this.addImage = mockAddImage;
    this.setFontSize = mockSetFontSize;
    this.setFont = mockSetFont;
    this.setCharSpace = mockSetCharSpace;
    this.text = mockText;
    this.setDrawColor = mockSetDrawColor;
    this.line = mockLine;
    this.setTextColor = mockSetTextColor;
    this.save = mockSave;
    this.getTextWidth = mockGetTextWidth;
    this.internal = {
      pageSize: {
        getWidth: mockGetWidth,
      },
    };
    return this;
  });

  return {
    mockAddImage,
    mockSetFontSize,
    mockSetFont,
    mockSetCharSpace,
    mockText,
    mockSetDrawColor,
    mockLine,
    mockSetTextColor,
    mockSave,
    mockGetTextWidth,
    mockGetWidth,
    MockJsPDF,
  };
});

vi.mock('jspdf', () => ({
  jsPDF: MockJsPDF,
}));

// Mock font setup
vi.mock('../helpers/font-setup', () => ({
  setupPolishFonts: vi.fn().mockResolvedValue(undefined),
}));

describe('generate-PDF-report service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockReportData = {
    nazwaInwestycji: 'Test Investment',
    identyfikatorInwestycji: '30.0001.AR_1.19/1',
    nazwaZlewni: 'Test Zlewnia',
    powDzialki: 1000,
    powDachow: 200,
    powDachowPozaObrysem: 50,
    powUszczelnione: 300,
    powPrzepuszczalne: 400,
    powTerenyInne: 50,
    objBZI: 100,
    objDetencyjnych: 150,
  };

  describe('generatePDFReport', () => {
    test('should generate PDF with all required data', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockSetFontSize).toHaveBeenCalled();
      expect(mockSetFont).toHaveBeenCalledWith('Roboto', 'bold');
      expect(mockSetFont).toHaveBeenCalledWith('Roboto', 'normal');
      expect(mockText).toHaveBeenCalledWith(
        expect.stringContaining('RAPORT BILANSU'),
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockSave).toHaveBeenCalledWith('30.0001.AR_1.19/1.pdf');
    });

    test('should display investment details correctly', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockText).toHaveBeenCalledWith(
        'Nazwa inwestycji: Test Investment',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        'Identyfikator działki: 30.0001.AR_1.19/1',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        'Zlewnia: Test Zlewnia',
        expect.any(Number),
        expect.any(Number),
      );
    });

    test('should display calculation data with correct values', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockText).toHaveBeenCalledWith(
        '1000',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        '200',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        '50',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        '300',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        '400',
        expect.any(Number),
        expect.any(Number),
      );
    });

    test('should display required volumes', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockText).toHaveBeenCalledWith(
        'Wymagana objętość obiektów BZI:',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        '100.00',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        'Wymagana objętość obiektów detencyjnych:',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        '150.00',
        expect.any(Number),
        expect.any(Number),
      );
    });

    test('should add logo image', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockAddImage).toHaveBeenCalledWith(
        expect.any(String),
        'PNG',
        80,
        3,
        50,
        20,
      );
    });

    test('should add current date', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockText).toHaveBeenCalledWith(
        expect.stringContaining('Data:'),
        expect.any(Number),
        expect.any(Number),
      );
    });

    test('should add divider line', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockSetDrawColor).toHaveBeenCalledWith(180, 200, 230);
      expect(mockLine).toHaveBeenCalled();
    });

    test('should add disclaimer text in gray', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockSetTextColor).toHaveBeenCalledWith(128, 128, 128);
      expect(mockText).toHaveBeenCalledWith(
        expect.stringContaining('Informacje zawarte w raporcie'),
        expect.any(Number),
        284,
      );
    });

    test('should work without map screenshot', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT - Logo should be added but not map screenshot
      expect(mockAddImage).toHaveBeenCalledTimes(1); // Only logo
      expect(mockSave).toHaveBeenCalled();
    });

    test('should handle font loading error gracefully', async () => {
      // ARRANGE
      const { setupPolishFonts } = await import('../helpers/font-setup');
      vi.mocked(setupPolishFonts).mockRejectedValueOnce(
        new Error('Font load failed'),
      );

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to load custom font, falling back to standard font:',
        expect.any(Error),
      );
      expect(mockSetFont).toHaveBeenCalledWith('helvetica');
      expect(mockSave).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    test('should set character spacing to 0', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockSetCharSpace).toHaveBeenCalledWith(0);
    });

    test('should use correct font sizes', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockSetFontSize).toHaveBeenCalledWith(12);
      expect(mockSetFontSize).toHaveBeenCalledWith(10);
      expect(mockSetFontSize).toHaveBeenCalledWith(16);
      expect(mockSetFontSize).toHaveBeenCalledWith(7);
    });

    test('should center the main heading', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockGetTextWidth).toHaveBeenCalledWith(
        'RAPORT BILANSU OBJĘTOŚCI WODY OPADOWEJ',
      );
      // Heading should be centered: (pageWidth - headingWidth) / 2
      expect(mockText).toHaveBeenCalledWith(
        'RAPORT BILANSU OBJĘTOŚCI WODY OPADOWEJ',
        55, // (210 - 100) / 2
        40,
      );
    });

    test('should handle all numeric values as numbers', async () => {
      // ARRANGE
      const dataWithLargeNumbers = {
        ...mockReportData,
        powDzialki: 10000.5,
        powDachow: 2500.25,
        objBZI: 999.99,
        objDetencyjnych: 1500.5,
      };

      // ACT
      await generatePDFReport(dataWithLargeNumbers);

      // ASSERT
      expect(mockText).toHaveBeenCalledWith(
        '10000.5',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        '2500.25',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        '999.99',
        expect.any(Number),
        expect.any(Number),
      );
      expect(mockText).toHaveBeenCalledWith(
        '1500.50',
        expect.any(Number),
        expect.any(Number),
      );
    });

    test('should display section headers correctly', async () => {
      // ACT
      await generatePDFReport(mockReportData);

      // ASSERT
      expect(mockText).toHaveBeenCalledWith('1. Szczegóły inwestycji', 20, 55);
      expect(mockText).toHaveBeenCalledWith(
        expect.stringContaining('2. Dane obliczeniowe'),
        20,
        expect.any(Number),
      );
    });
  });
});
