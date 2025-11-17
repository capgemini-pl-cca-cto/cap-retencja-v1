import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect } from 'vitest';
import FormCollapsible from './form-collapsible';

describe('FormCollapsible', () => {
  test('should render correctly with all elements', () => {
    // ARRANGE
    const { container } = render(
      <FormCollapsible
        title="What is "
        titleBold="bold text"
        titleBoldHiddenOnSmall=" extra text"
      >
        <div>Content</div>
      </FormCollapsible>,
    );

    // ACT
    const svg = container.querySelector('svg');
    const span = container.querySelector('.max-sm\\:hidden');

    // ASSERT
    expect(screen.getByText(/What is/)).toBeInTheDocument();
    expect(screen.getByText('bold text')).toBeInTheDocument();
    expect(screen.getByText(/\?$/)).toBeInTheDocument();
    expect(svg).toBeInTheDocument();
    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe(' extra text');
  });

  test('should toggle content visibility on trigger click', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const { container } = render(
      <FormCollapsible
        title="Title "
        titleBold="bold"
        titleBoldHiddenOnSmall=""
      >
        <div>Collapsible content</div>
      </FormCollapsible>,
    );

    // ACT
    const trigger = screen.getByRole('button');
    const contentDiv = container.querySelector(
      '[data-slot="collapsible-content"]',
    );

    // ASSERT
    expect(contentDiv).toHaveAttribute('data-state', 'closed');

    // Click to open
    await user.click(trigger);
    expect(screen.getByText('Collapsible content')).toBeInTheDocument();

    // Click to close
    await user.click(trigger);
    expect(contentDiv).toHaveAttribute('data-state', 'closed');
  });
});
