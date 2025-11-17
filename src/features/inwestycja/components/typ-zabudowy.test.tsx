import { Form } from '@/components/ui/form';
import type { InwestycjaModel } from '@/types/inwestycja-model';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, vi } from 'vitest';
import TypZabudowy from './typ-zabudowy';

// Mock FormRadio
vi.mock('./form-radio', () => ({
  default: ({
    mainLabel,
    inputLabels,
  }: {
    mainLabel: string;
    inputLabels: string[];
  }) => (
    <div data-testid="form-radio">
      <div>{mainLabel}</div>
      <div>{inputLabels[0]}</div>
      <div>{inputLabels[1]}</div>
    </div>
  ),
}));

function TestWrapper({
  typZabudowy = 'jednorodzinna',
  isInwestycjaSubmitted = false,
}: {
  typZabudowy?: 'jednorodzinna' | 'wielorodzinna';
  isInwestycjaSubmitted?: boolean;
}) {
  const form = useForm<InwestycjaModel>({
    defaultValues: {
      nazwaInwestycji: '',
      identyfikatorInwestycji: '',
      typZabudowy,
      isPodlaczony: 'nie',
      isIstniejacePolaczenie: 'nie',
    },
  });

  return (
    <Form {...form}>
      <TypZabudowy
        isInwestycjaSubmitted={isInwestycjaSubmitted}
        control={form.control}
        typZabudowy={typZabudowy}
      />
    </Form>
  );
}

describe('TypZabudowy', () => {
  test('should render correctly when not submitted', () => {
    // ARRANGE
    render(<TestWrapper isInwestycjaSubmitted={false} />);

    // ACT & ASSERT
    expect(screen.getByTestId('form-radio')).toBeInTheDocument();
    expect(screen.getByText('Typ planowanej zabudowy')).toBeInTheDocument();
    expect(screen.getByText('jednorodzinna')).toBeInTheDocument();
    expect(
      screen.getByText('wielorodzinna / usługowa / przemysłowa'),
    ).toBeInTheDocument();
  });

  test('should render correctly when submitted', () => {
    // ARRANGE
    const { container } = render(
      <TestWrapper typZabudowy="jednorodzinna" isInwestycjaSubmitted={true} />,
    );

    // ACT
    const lightText = container.querySelector('.font-light');
    const values = screen.getAllByText('jednorodzinna');

    // ASSERT
    expect(screen.queryByTestId('form-radio')).not.toBeInTheDocument();
    expect(screen.getByText('Typ planowanej zabudowy')).toBeInTheDocument();
    expect(values.length).toBeGreaterThanOrEqual(1);
    expect(lightText).toBeInTheDocument();
  });

  test('should display wielorodzinna value when submitted', () => {
    // ARRANGE
    render(
      <TestWrapper typZabudowy="wielorodzinna" isInwestycjaSubmitted={true} />,
    );

    // ACT & ASSERT
    expect(
      screen.getByText('wielorodzinna / usługowa / przemysłowa'),
    ).toBeInTheDocument();
  });
});
