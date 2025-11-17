import { Form } from '@/components/ui/form';
import type { KalkulatorModel } from '@/types/kalkulator-model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect } from 'vitest';
import KalkulatorInput from './kalkulator-form-input';

// Wrapper component to provide form context
function TestWrapper({
  defaultValue = 0,
  hasGlobalError = false,
  isKalkulatorSubmitted = false,
}: {
  defaultValue?: number;
  hasGlobalError?: boolean;
  isKalkulatorSubmitted?: boolean;
}) {
  const form = useForm<KalkulatorModel>({
    defaultValues: {
      powDzialki: defaultValue,
      powDachow: 0,
      powDachowPozaObrysem: 0,
      powUszczelnione: 0,
      powPrzepuszczalne: 0,
      powTerenyInne: 0,
    },
  });

  return (
    <Form {...form}>
      <KalkulatorInput
        control={form.control}
        name="powDzialki"
        label="Test Label"
        hasGlobalError={hasGlobalError}
        isKalkulatorSubmitted={isKalkulatorSubmitted}
      />
    </Form>
  );
}

describe('KalkulatorInput', () => {
  test('should render correctly with all elements', () => {
    // ARRANGE
    render(<TestWrapper />);

    // ACT
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // ASSERT
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('0,00');
  });

  test('should prevent non-numeric input', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<TestWrapper />);

    // ACT
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'abc');

    // ASSERT
    expect(input).toHaveValue('0,00');
  });

  test('should be disabled when submitted', () => {
    // ARRANGE
    render(<TestWrapper isKalkulatorSubmitted={true} />);

    // ACT
    const input = screen.getByRole('textbox');

    // ASSERT
    expect(input).toBeDisabled();
  });

  test('should be enabled when not submitted', () => {
    // ARRANGE
    render(<TestWrapper isKalkulatorSubmitted={false} />);

    // ACT
    const input = screen.getByRole('textbox');

    // ASSERT
    expect(input).not.toBeDisabled();
  });

  test('should render sublabel when provided', () => {
    // ARRANGE
    function TestWrapperWithSubLabel() {
      const form = useForm<KalkulatorModel>({
        defaultValues: {
          powDzialki: 0,
          powDachow: 0,
          powDachowPozaObrysem: 0,
          powUszczelnione: 0,
          powPrzepuszczalne: 0,
          powTerenyInne: 0,
        },
      });

      return (
        <Form {...form}>
          <KalkulatorInput
            control={form.control}
            name="powDzialki"
            label="Main Label"
            subLabel="Sub label text"
            hasGlobalError={false}
            isKalkulatorSubmitted={false}
          />
        </Form>
      );
    }

    // ACT
    render(<TestWrapperWithSubLabel />);

    // ASSERT
    expect(screen.getByText('Sub label text')).toBeInTheDocument();
  });
});
