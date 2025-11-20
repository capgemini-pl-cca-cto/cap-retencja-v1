import type { RaportModel } from '@/types/raport-model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, vi } from 'vitest';
import RaportForm from './raport-form';

// Mock the hook
vi.mock('../hooks/useRaportCalculations', () => ({
  useRaportCalculations: vi.fn(() => ({
    objBZI: 150.5,
    objDetencyjnych: 301.0,
    nazwaZlewni: 'Test Zlewnia',
  })),
}));

// Mock the PDF generation service
vi.mock('../services/generate-PDF-report', () => ({
  default: vi.fn(),
}));

describe('RaportForm', () => {
  const mockOnFormReset = vi.fn();

  const mockDaneRaport: RaportModel = {
    inwestycja: {
      nazwaInwestycji: 'Test Investment',
      identyfikatorInwestycji: 'TEST-001',
      typZabudowy: 'jednorodzinna',
      isPodlaczony: 'nie',
      isIstniejacePolaczenie: 'nie',
    },
    daneKalkulator: {
      powDzialki: 1000,
      powDachow: 200,
      powDachowPozaObrysem: 100,
      powUszczelnione: 300,
      powPrzepuszczalne: 200,
      powTerenyInne: 200,
    },
    daneDzialki: {
      id: 'test-id',
      voivodeship: 'Test Voivodeship',
      county: 'Test County',
      commune: 'Test Commune',
      region: 'Test Region',
      parcel: 'Test Parcel',
      centerCoordinates: { lat: 52.4, lng: 16.9 },
      polygonCoordinates: [[52.4, 16.9]],
    },
    mapScreenshot: 'data:image/png;base64,test',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    isKalkulatorAccordionOpen: false,
    onFormReset: mockOnFormReset,
    daneRaport: mockDaneRaport,
  };

  test('should render elements correctly ', () => {
    // ARRANGE & ACT
    render(<RaportForm {...defaultProps} />);

    // ACT
    const bziInput = screen.getByDisplayValue('150.50');
    const detInput = screen.getByDisplayValue('301.00');
    const link = screen
      .getByText('katalogi metod zagospodarowania wód opadowych.')
      .closest('a');

    // ASSERT
    expect(
      screen.getByText(/Wymagana objętość obiektów błękitno-zielonej/),
    ).toBeInTheDocument();
    expect(bziInput).toBeInTheDocument();
    expect(bziInput).toBeDisabled();
    expect(
      screen.getByText(/Wymagana objętość obiektów detencyjnych/),
    ).toBeInTheDocument();
    expect(detInput).toBeInTheDocument();
    expect(detInput).toBeDisabled();
    expect(screen.getByText('LUB')).toBeInTheDocument();
    expect(
      screen.getByText(/Wody opadowe możesz zagospodarować/),
    ).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://www.aquanet-retencja.pl/retencja/',
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer noopener');
    expect(
      screen.getByRole('button', { name: /Zacznij od nowa/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Pobierz raport pdf/i }),
    ).toBeInTheDocument();
  });

  test('should call onFormReset when reset button is clicked', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RaportForm {...defaultProps} />);

    // ACT
    const resetButton = screen.getByRole('button', {
      name: /Zacznij od nowa/i,
    });
    await user.click(resetButton);

    // ASSERT
    expect(mockOnFormReset).toHaveBeenCalled();
  });

  test('should call generatePDFReport when download button is clicked', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const { default: generatePDFReport } = await import(
      '../services/generate-PDF-report'
    );
    render(<RaportForm {...defaultProps} />);

    // ACT
    const downloadButton = screen.getByRole('button', {
      name: /Pobierz raport pdf/i,
    });
    await user.click(downloadButton);

    // ASSERT
    expect(generatePDFReport).toHaveBeenCalledWith(
      expect.objectContaining({
        nazwaInwestycji: 'Test Investment',
        identyfikatorInwestycji: 'TEST-001',
        objBZI: 150.5,
        objDetencyjnych: 301.0,
      }),
    );
  });

  test('should render divider when accordion is open', () => {
    // ARRANGE
    const { container } = render(
      <RaportForm {...defaultProps} isKalkulatorAccordionOpen={true} />,
    );

    // ACT
    const divider = container.querySelector('div[style*="height: 1px"]');

    // ASSERT
    expect(divider).toBeInTheDocument();
  });

  test('should not render divider when accordion is closed', () => {
    // ARRANGE
    const { container } = render(
      <RaportForm {...defaultProps} isKalkulatorAccordionOpen={false} />,
    );

    // ACT
    const divider = container.querySelector('div[style*="height: 1px"]');

    // ASSERT
    expect(divider).not.toBeInTheDocument();
  });
});
