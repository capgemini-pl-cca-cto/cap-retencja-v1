import { Form } from '@/components/ui/form';
import type { InwestycjaModel } from '@/types/inwestycja-model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect } from 'vitest';
import FormRadio from './form-radio';

function TestWrapper() {
  const form = useForm<InwestycjaModel>({
    defaultValues: {
      nazwaInwestycji: '',
      identyfikatorInwestycji: '',
      typZabudowy: 'jednorodzinna',
      isPodlaczony: 'nie',
      isIstniejacePolaczenie: 'nie',
    },
  });

  return (
    <Form {...form}>
      <FormRadio
        control={form.control}
        name="isPodlaczony"
        mainLabel="Is connected?"
        values={['tak', 'nie']}
        inputLabels={['Yes', 'No']}
      />
    </Form>
  );
}

describe('FormRadio', () => {
  test('should render correctly with all elements', () => {
    // ARRANGE
    render(<TestWrapper />);

    // ACT
    const radioButtons = screen.getAllByRole('radio');

    // ASSERT
    expect(screen.getByText('Is connected?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(radioButtons).toHaveLength(2);
  });

  test('should allow selecting options', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<TestWrapper />);

    // ACT
    const radioButtons = screen.getAllByRole('radio');
    await user.click(radioButtons[0]);

    // ASSERT
    expect(radioButtons[0]).toBeChecked();
    expect(radioButtons[1]).not.toBeChecked();

    // ACT - select second option
    await user.click(radioButtons[1]);

    // ASSERT
    expect(radioButtons[0]).not.toBeChecked();
    expect(radioButtons[1]).toBeChecked();
  });
});
