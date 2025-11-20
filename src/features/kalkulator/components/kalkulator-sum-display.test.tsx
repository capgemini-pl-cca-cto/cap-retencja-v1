import { Form } from '@/components/ui/form';
import type { KalkulatorModel } from '@/types/kalkulator-model';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect } from 'vitest';
import KalkulatorSumDisplay from './kalkulator-sum-display';

// Wrapper to provide Form context
function TestWrapper({
  p1,
  p2,
  p3,
  p4,
}: {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
}) {
  const form = useForm<KalkulatorModel>({
    defaultValues: {
      powDzialki: 0,
      powDachow: p1,
      powDachowPozaObrysem: p2,
      powUszczelnione: p3,
      powPrzepuszczalne: p4,
      powTerenyInne: 0,
    },
  });

  return (
    <Form {...form}>
      <KalkulatorSumDisplay p1={p1} p2={p2} p3={p3} p4={p4} />
    </Form>
  );
}

describe('KalkulatorSumDisplay', () => {
  test('should render correctly with label and formatted sum', () => {
    // ARRANGE & ACT
    render(<TestWrapper p1={100} p2={200} p3={300} p4={400} />);

    // ASSERT
    expect(
      screen.getByText('Suma powierzchni P1, P2, P3, P4 [m2]'),
    ).toBeInTheDocument();
    expect(screen.getByText('1000,00')).toBeInTheDocument();
  });

  test('should format values correctly with comma as decimal separator', () => {
    // ARRANGE & ACT - test zero
    const { rerender } = render(<TestWrapper p1={0} p2={0} p3={0} p4={0} />);

    // ASSERT
    expect(screen.getByText('0,00')).toBeInTheDocument();

    // ARRANGE & ACT - test decimals
    rerender(<TestWrapper p1={100.5} p2={200.75} p3={300.123} p4={400.999} />);

    // ASSERT - 100.5 + 200.75 + 300.123 + 400.999 = 1002.372 -> 1002,37
    expect(screen.getByText('1002,37')).toBeInTheDocument();
  });

  test('should render with correct styling classes', () => {
    // ARRANGE
    const { container } = render(
      <TestWrapper p1={100} p2={100} p3={100} p4={100} />,
    );

    // ACT
    const displayDiv = container.querySelector('div[class*="bg-[#DFF5F5]"]');

    // ASSERT
    expect(displayDiv).toBeInTheDocument();
    expect(displayDiv).toHaveClass('font-bold', 'text-[#0C4F7B]');
  });
});
