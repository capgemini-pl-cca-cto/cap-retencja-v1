import { Form } from '@/components/ui/form';
import type { InwestycjaModel } from '@/types/inwestycja-model';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, vi } from 'vitest';
import KanalizacjaDeszczowa from './kanalizacja-deszczowa';

// Mock FormRadio
vi.mock('./form-radio', () => ({
  default: ({ mainLabel }: { mainLabel: string }) => (
    <div data-testid="form-radio">{mainLabel}</div>
  ),
}));

function TestWrapper({
  typZabudowy = 'jednorodzinna',
  isPodlaczony = 'nie',
  isIstniejacePolaczenie = 'nie',
  isInwestycjaSubmitted = false,
}: {
  typZabudowy?: 'jednorodzinna' | 'wielorodzinna';
  isPodlaczony?: 'tak' | 'nie';
  isIstniejacePolaczenie?: 'tak' | 'nie';
  isInwestycjaSubmitted?: boolean;
}) {
  const form = useForm<InwestycjaModel>({
    defaultValues: {
      nazwaInwestycji: '',
      identyfikatorInwestycji: '',
      typZabudowy,
      isPodlaczony,
      isIstniejacePolaczenie,
    },
  });

  return (
    <Form {...form}>
      <KanalizacjaDeszczowa
        isInwestycjaSubmitted={isInwestycjaSubmitted}
        control={form.control}
        typZabudowy={typZabudowy}
        isPodlaczony={isPodlaczony}
        isIstniejacePolaczenie={isIstniejacePolaczenie}
      />
    </Form>
  );
}

describe('KanalizacjaDeszczowa', () => {
  test('should render info box for jednorodzinna when not submitted', () => {
    // ARRANGE
    render(
      <TestWrapper typZabudowy="jednorodzinna" isInwestycjaSubmitted={false} />,
    );

    // ACT & ASSERT
    expect(
      screen.getByText(/W przypadku zabudowy jednorodzinnej/),
    ).toBeInTheDocument();
  });

  test('should not render info box for jednorodzinna when submitted', () => {
    // ARRANGE
    render(
      <TestWrapper typZabudowy="jednorodzinna" isInwestycjaSubmitted={true} />,
    );

    // ACT & ASSERT
    expect(
      screen.queryByText(/W przypadku zabudowy jednorodzinnej/),
    ).not.toBeInTheDocument();
  });

  test('should render both radio groups for wielorodzinna when not submitted', () => {
    // ARRANGE
    render(
      <TestWrapper typZabudowy="wielorodzinna" isInwestycjaSubmitted={false} />,
    );

    // ACT & ASSERT
    expect(
      screen.getByText(/Czy dana zabudowa ma zostać podłączona/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Czy istniejąca zabudowa ma podłączenie/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/W przypadku zabudowy jednorodzinnej/),
    ).not.toBeInTheDocument();
  });

  test('should render read-only values for wielorodzinna when submitted', () => {
    // ARRANGE
    render(
      <TestWrapper
        typZabudowy="wielorodzinna"
        isPodlaczony="tak"
        isIstniejacePolaczenie="nie"
        isInwestycjaSubmitted={true}
      />,
    );

    // ACT
    const takTexts = screen.getAllByText('tak');
    const nieTexts = screen.getAllByText('nie');

    // ASSERT
    expect(
      screen.getByText(/Czy dana zabudowa ma zostać podłączona/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Czy istniejąca zabudowa ma podłączenie/),
    ).toBeInTheDocument();
    expect(takTexts.length).toBeGreaterThan(0);
    expect(nieTexts.length).toBeGreaterThan(0);
    expect(screen.queryByTestId('form-radio')).not.toBeInTheDocument();
  });
});
