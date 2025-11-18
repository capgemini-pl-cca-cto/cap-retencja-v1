import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { InwestycjaSection } from './inwestycja-section';
import { Accordion } from '@/components/ui/accordion';

describe('Inwestycja Section component', () => {
  test('should render accordion trigger with correct text', () => {
    // ARRANGE
    const mockOnFormSubmit = vi.fn();

    // ACT
    render(
      <Accordion type="single" collapsible>
        <InwestycjaSection
          isInwestycjaSubmitted={false}
          onFormSubmit={mockOnFormSubmit}
        />
      </Accordion>,
    );

    // ASSERT
    expect(
      screen.getByRole('button', { name: /1\. szczegóły inwestycji/i }),
    ).toBeInTheDocument();
  });
});
