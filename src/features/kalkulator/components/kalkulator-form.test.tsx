import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, vi } from 'vitest';
import { useKalkulatorStore } from '../stores/kalkulator-store';
import KalkulatorForm from './kalkulator-form';

// Mock the store
vi.mock('../stores/kalkulator-store', () => ({
  useKalkulatorStore: vi.fn(),
}));

// Mock child components
vi.mock('./kalkulator-form-input', () => ({
  default: ({ label, name }: { label: string; name: string }) => (
    <div data-testid={`input-${name}`}>{label}</div>
  ),
}));

vi.mock('./kalkulator-sum-display', () => ({
  default: ({
    p1,
    p2,
    p3,
    p4,
  }: {
    p1: number;
    p2: number;
    p3: number;
    p4: number;
  }) => <div data-testid="sum-display">Sum: {p1 + p2 + p3 + p4}</div>,
}));

describe('KalkulatorForm', () => {
  const mockSetForm = vi.fn();
  const mockOnFormSubmit = vi.fn();
  const mockOnFormReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useKalkulatorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        powDzialki: 0,
        powDachow: 0,
        powDachowPozaObrysem: 0,
        powUszczelnione: 0,
        powPrzepuszczalne: 0,
        powTerenyInne: 0,
        setForm: mockSetForm,
      },
    );
  });

  const defaultProps = {
    onFormSubmit: mockOnFormSubmit,
    onFormReset: mockOnFormReset,
    isKalkulatorSubmitted: false,
  };

  test('should render all form inputs and info box when not submitted', () => {
    // ARRANGE & ACT
    render(<KalkulatorForm {...defaultProps} />);

    // ASSERT
    expect(screen.getByTestId('input-powDzialki')).toBeInTheDocument();
    expect(screen.getByTestId('input-powDachow')).toBeInTheDocument();
    expect(
      screen.getByTestId('input-powDachowPozaObrysem'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('input-powUszczelnione')).toBeInTheDocument();
    expect(screen.getByTestId('input-powPrzepuszczalne')).toBeInTheDocument();
    expect(screen.getByTestId('input-powTerenyInne')).toBeInTheDocument();
    expect(
      screen.getByText(/Wpisz powierzchnie z dokładnością/),
    ).toBeInTheDocument();
  });

  test('should not render info box when submitted', () => {
    // ARRANGE & ACT
    render(<KalkulatorForm {...defaultProps} isKalkulatorSubmitted={true} />);

    // ASSERT
    expect(
      screen.queryByText(/Wpisz powierzchnie z dokładnością/),
    ).not.toBeInTheDocument();
  });

  test('should render action buttons when not submitted', () => {
    // ARRANGE & ACT
    render(<KalkulatorForm {...defaultProps} />);

    // ASSERT
    expect(
      screen.getByRole('button', { name: /Przelicz/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Zmień działkę/i }),
    ).toBeInTheDocument();
  });

  test('should not render action buttons when submitted', () => {
    // ARRANGE & ACT
    render(<KalkulatorForm {...defaultProps} isKalkulatorSubmitted={true} />);

    // ASSERT
    expect(
      screen.queryByRole('button', { name: /Przelicz/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Zmień działkę/i }),
    ).not.toBeInTheDocument();
  });

  test('should render sum display when submitted', () => {
    // ARRANGE & ACT
    render(<KalkulatorForm {...defaultProps} isKalkulatorSubmitted={true} />);

    // ASSERT
    expect(screen.getByTestId('sum-display')).toBeInTheDocument();
  });

  test('should not render sum display when not submitted', () => {
    // ARRANGE & ACT
    render(<KalkulatorForm {...defaultProps} isKalkulatorSubmitted={false} />);

    // ASSERT
    expect(screen.queryByTestId('sum-display')).not.toBeInTheDocument();
  });

  test('should call onFormReset when reset button is clicked', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<KalkulatorForm {...defaultProps} />);

    // ACT
    const resetButton = screen.getByRole('button', { name: /Zmień działkę/i });
    await user.click(resetButton);

    // ASSERT
    expect(mockOnFormReset).toHaveBeenCalled();
  });

  test('should display link to attachment with correct attributes', () => {
    // ARRANGE & ACT
    render(<KalkulatorForm {...defaultProps} />);

    // ACT
    const link = screen.getByText('załącznik graficzny').closest('a');

    // ASSERT
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should render collapsible sections with explanatory text', () => {
    // ARRANGE & ACT
    render(<KalkulatorForm {...defaultProps} />);

    // ACT
    const czymsaTitles = screen.getAllByText(/Czym są/);

    // ASSERT
    expect(screen.getByText(/Co zalicza się do/)).toBeInTheDocument();
    expect(czymsaTitles.length).toBeGreaterThan(0);
    expect(screen.getByText(/powierzchni uszczelnionych/)).toBeInTheDocument();
    expect(screen.getByText(/powierzchnie przepuszczalne/)).toBeInTheDocument();
    expect(
      screen.getByText(/pozostałe pow. biologicznie czynne/),
    ).toBeInTheDocument();
  });
});
