import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KalkulatorSection } from './kalkulator-section';
import { Accordion } from '@/components/ui/accordion';

describe('KalkulatorSection', () => {
  const defaultProps = {
    disabled: false,
    onFormSubmit: vi.fn(),
    onFormReset: vi.fn(),
    isKalkulatorSubmitted: false,
  };

  const renderWithAccordion = (
    props = defaultProps,
    defaultValue = 'kalkulator-section',
  ) => {
    return render(
      <Accordion type="single" collapsible defaultValue={defaultValue}>
        <KalkulatorSection {...props} />
      </Accordion>,
    );
  };

  test('should render with trigger text', () => {
    // ARRANGE & ACT
    renderWithAccordion();

    // ASSERT
    expect(
      screen.getByText('2. Dane do bilansu objętości wody opadowej'),
    ).toBeInTheDocument();
  });

  test('should apply disabled styling when disabled', () => {
    // ARRANGE
    const { container } = renderWithAccordion({
      ...defaultProps,
      disabled: true,
    });

    // ACT
    const trigger = container.querySelector('button');
    const accordionContent = screen.getByRole('button', {
      name: /dane do bilansu/i,
    }).parentElement?.nextElementSibling;

    // ASSERT
    expect(trigger).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(accordionContent).toBeInTheDocument();
  });

  test('should not apply disabled styling when enabled', () => {
    // ARRANGE
    const { container } = renderWithAccordion({
      ...defaultProps,
      disabled: false,
    });

    // ACT
    const trigger = container.querySelector('button');

    // ASSERT
    expect(trigger).not.toHaveClass('opacity-50');
  });
});
