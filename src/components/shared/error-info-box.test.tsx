import { render, screen } from '@testing-library/react';
import { describe, expect } from 'vitest';
import ErrorInfoBox from './error-info-box';

describe('ErrorInfoBox', () => {
  test('should render correctly with all elements', () => {
    // ARRANGE
    const { container } = render(<ErrorInfoBox label="Test error message" />);

    // ACT
    const alert = container.querySelector('[role="alert"]');
    const svg = container.querySelector('svg');
    const description = screen.getByText('Test error message');

    // ASSERT
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(svg).toBeInTheDocument();
    expect(alert).toHaveClass('border-destructive');
    expect(description).toHaveClass('text-destructive');
  });
});
