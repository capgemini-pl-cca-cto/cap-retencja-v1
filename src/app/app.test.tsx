import { useInwestycjaStore } from '@/features/inwestycja/stores/inwestycja-store';
import { useKalkulatorStore } from '@/features/kalkulator/stores/kalkulator-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, vi } from 'vitest';
import App from './app';

// Mock the stores
vi.mock('@/features/kalkulator/stores/kalkulator-store');
vi.mock('@/features/inwestycja/stores/inwestycja-store');

vi.mock('./app-store', () => ({
  resetAllStores: vi.fn(),
  useDaneRaport: vi.fn(() => ({
    inwestycja: {
      nazwaInwestycji: '',
      identyfikatorInwestycji: '',
      typZabudowy: 'jednorodzinna',
      isPodlaczony: 'nie',
      isIstniejacePolaczenie: 'nie',
    },
    daneKalkulator: {
      powDzialki: 0,
      powDachow: 0,
      powDachowPozaObrysem: 0,
      powUszczelnione: 0,
      powPrzepuszczalne: 0,
      powTerenyInne: 0,
    },
    daneDzialki: {
      id: '',
      voivodeship: '',
      county: '',
      commune: '',
      region: '',
      parcel: '',
      centerCoordinates: { lat: 0, lng: 0 },
      polygonCoordinates: [],
    },
    mapScreenshot: undefined,
  })),
}));

// Mock child components
vi.mock('./introduction', () => ({
  default: () => <div data-testid="introduction">Introduction</div>,
}));

vi.mock('@/features/inwestycja/components/inwestycja-section', () => ({
  InwestycjaSection: ({
    onFormSubmit,
    isInwestycjaSubmitted,
  }: {
    onFormSubmit: () => void;
    isInwestycjaSubmitted: boolean;
  }) => (
    <div data-testid="inwestycja-section">
      <button type="button" onClick={onFormSubmit}>
        Submit Inwestycja
      </button>
      <span>{isInwestycjaSubmitted ? 'Submitted' : 'Not Submitted'}</span>
    </div>
  ),
}));

vi.mock('@/features/kalkulator/components/kalkulator-section', () => ({
  KalkulatorSection: ({
    disabled,
    onFormSubmit,
    isKalkulatorSubmitted,
  }: {
    disabled: boolean;
    onFormSubmit: () => void;
    isKalkulatorSubmitted: boolean;
  }) => (
    <div data-testid="kalkulator-section">
      <button type="button" onClick={onFormSubmit} disabled={disabled}>
        Submit Kalkulator
      </button>
      <span>{isKalkulatorSubmitted ? 'Submitted' : 'Not Submitted'}</span>
      <span>{disabled ? 'Disabled' : 'Enabled'}</span>
    </div>
  ),
}));

vi.mock('@/features/raport/components/raport-form', () => ({
  default: ({
    isKalkulatorAccordionOpen,
    onFormReset,
    daneRaport,
  }: {
    isKalkulatorAccordionOpen: boolean;
    onFormReset: () => void;
    daneRaport: unknown;
  }) => (
    <div data-testid="raport-form">
      <button type="button" onClick={onFormReset}>
        Reset All
      </button>
      <span>
        {isKalkulatorAccordionOpen ? 'Accordion Open' : 'Accordion Closed'}
      </span>
      <span>{daneRaport ? 'Has Data' : 'No Data'}</span>
    </div>
  ),
}));

// Mock r2wc (React to Web Component)
vi.mock('@r2wc/react-to-web-component', () => ({
  default: (component: unknown) => component,
}));

describe('App', () => {
  const mockSubmitKalkulator = vi.fn();
  const mockSubmitInwestycja = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useKalkulatorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        isKalkulatorSubmitted: false,
        submitKalkulator: mockSubmitKalkulator,
      },
    );

    (useInwestycjaStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        isInwestycjaSubmitted: false,
        submitInwestycja: mockSubmitInwestycja,
      },
    );
  });

  test('should disable Kalkulator until Inwestycja is submitted', () => {
    // ARRANGE
    (useInwestycjaStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        isInwestycjaSubmitted: false,
        submitInwestycja: mockSubmitInwestycja,
      },
    );

    // ACT
    render(<App />);

    // ASSERT
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  test('should enable Kalkulator after Inwestycja is submitted', () => {
    // ARRANGE
    (useInwestycjaStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        isInwestycjaSubmitted: true,
        submitInwestycja: mockSubmitInwestycja,
      },
    );

    // ACT
    render(<App />);

    // ASSERT
    expect(screen.getByText('Enabled')).toBeInTheDocument();
  });

  test('should hide Raport form until Kalkulator is submitted', () => {
    // ARRANGE
    (useKalkulatorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        isKalkulatorSubmitted: false,
        submitKalkulator: mockSubmitKalkulator,
      },
    );

    // ACT
    render(<App />);

    // ASSERT
    expect(screen.queryByTestId('raport-form')).not.toBeInTheDocument();
  });

  test('should show Raport form after Kalkulator is submitted', () => {
    // ARRANGE
    (useKalkulatorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        isKalkulatorSubmitted: true,
        submitKalkulator: mockSubmitKalkulator,
      },
    );

    // ACT
    render(<App />);

    // ASSERT
    expect(screen.getByTestId('raport-form')).toBeInTheDocument();
  });

  test('should submit Inwestycja through user interaction', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<App />);

    // ACT
    const submitButton = screen.getByRole('button', {
      name: /Submit Inwestycja/i,
    });
    await user.click(submitButton);

    // ASSERT
    expect(mockSubmitInwestycja).toHaveBeenCalled();
  });

  test('should submit Kalkulator through user interaction', async () => {
    // ARRANGE
    const user = userEvent.setup();
    (useInwestycjaStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        isInwestycjaSubmitted: true,
        submitInwestycja: mockSubmitInwestycja,
      },
    );

    // ACT
    render(<App />);
    const submitButton = screen.getByRole('button', {
      name: /Submit Kalkulator/i,
    });
    await user.click(submitButton);

    // ASSERT
    expect(mockSubmitKalkulator).toHaveBeenCalled();
  });
});
