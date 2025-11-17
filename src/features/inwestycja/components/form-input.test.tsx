import { Form } from '@/components/ui/form';
import type { InwestycjaModel } from '@/types/inwestycja-model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect, vi } from 'vitest';
import FormInput from './form-input';

// Mock MapModal
vi.mock('./map-modal', () => ({
  default: ({
    setIdentyfikatorFromMap,
  }: {
    setIdentyfikatorFromMap: (value: string) => void;
  }) => (
    <div data-testid="map-modal">
      <button type="button" onClick={() => setIdentyfikatorFromMap('mock-id')}>
        Select from Map
      </button>
    </div>
  ),
}));

function TestWrapper({
  showMapIcon = false,
  isInwestycjaSubmitted = false,
  description,
}: {
  showMapIcon?: boolean;
  isInwestycjaSubmitted?: boolean;
  description?: string;
}) {
  const form = useForm<InwestycjaModel>({
    defaultValues: {
      nazwaInwestycji: '',
      identyfikatorInwestycji: '',
      typZabudowy: 'jednorodzinna',
      isPodlaczony: 'nie',
      isIstniejacePolaczenie: 'nie',
    },
  });

  const mockSetIdentyfikator = vi.fn();

  return (
    <Form {...form}>
      <FormInput
        control={form.control}
        name="nazwaInwestycji"
        label="Test Label"
        isInwestycjaSubmitted={isInwestycjaSubmitted}
        description={description}
        showMapIcon={showMapIcon}
        setIdentyfikatorFromMap={mockSetIdentyfikator}
      />
    </Form>
  );
}

describe('FormInput', () => {
  test('should render correctly with all elements', () => {
    // ARRANGE
    render(<TestWrapper />);

    // ACT
    const input = screen.getByRole('textbox');

    // ASSERT
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
  });

  test('should handle text input correctly', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<TestWrapper />);

    // ACT
    const input = screen.getByRole('textbox');
    await user.type(input, 'Test value');

    // ASSERT
    expect(input).toHaveValue('Test value');
  });

  test('should be disabled when submitted', () => {
    // ARRANGE
    render(<TestWrapper isInwestycjaSubmitted={true} />);

    // ACT
    const input = screen.getByRole('textbox');

    // ASSERT
    expect(input).toBeDisabled();
  });

  test('should render description when provided and not submitted', () => {
    // ARRANGE
    render(
      <TestWrapper
        description="Test description"
        isInwestycjaSubmitted={false}
      />,
    );

    // ACT & ASSERT
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('should not render description when submitted', () => {
    // ARRANGE
    render(
      <TestWrapper
        description="Test description"
        isInwestycjaSubmitted={true}
      />,
    );

    // ACT & ASSERT
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  test('should render map icon when showMapIcon is true and not submitted', () => {
    // ARRANGE
    const { container } = render(
      <TestWrapper showMapIcon={true} isInwestycjaSubmitted={false} />,
    );

    // ACT
    const mapIcon = container.querySelector('svg');

    // ASSERT
    expect(mapIcon).toBeInTheDocument();
  });

  test('should not render map icon when submitted or showMapIcon is false', () => {
    // ARRANGE
    const { container: containerSubmitted } = render(
      <TestWrapper showMapIcon={true} isInwestycjaSubmitted={true} />,
    );
    const { container: containerNoIcon } = render(
      <TestWrapper showMapIcon={false} isInwestycjaSubmitted={false} />,
    );

    // ACT
    const mapIconSubmitted = containerSubmitted.querySelector('svg');
    const mapIconNoIcon = containerNoIcon.querySelector('svg');

    // ASSERT
    expect(mapIconSubmitted).not.toBeInTheDocument();
    expect(mapIconNoIcon).not.toBeInTheDocument();
  });

  test('should open map modal when map icon is clicked', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const { container } = render(
      <TestWrapper showMapIcon={true} isInwestycjaSubmitted={false} />,
    );

    // ACT
    const mapIcon = container.querySelector('svg');
    await user.click(mapIcon!);

    // ASSERT
    expect(screen.getByTestId('map-modal')).toBeInTheDocument();
  });
});
