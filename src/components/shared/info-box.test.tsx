import { render, screen } from '@testing-library/react';
import { describe, expect } from 'vitest';
import InfoBox from './info-box';

describe('InfoBox', () => {
  test('should render correctly with all elements', () => {
    // ARRANGE
    const { container } = render(<InfoBox label="Information message" />);

    // ACT
    const alert = container.querySelector('[role="alert"]');
    const svg = container.querySelector('svg');
    const description = screen.getByText('Information message');

    // ASSERT
    expect(screen.getByText('Information message')).toBeInTheDocument();
    expect(svg).toBeInTheDocument();
    expect(alert).toHaveClass('border-primary-blue');
    expect(description).toHaveClass('text-primary-blue');
    expect(alert).toHaveClass('max-sm:hidden');
  });

  test('should apply custom className when provided', () => {
    // ARRANGE
    const { container } = render(
      <InfoBox label="Info" className="custom-class" />,
    );

    // ACT
    const alert = container.querySelector('[role="alert"]');

    // ASSERT
    expect(alert).toHaveClass('custom-class');
  });
});
