import { expect, test, describe } from 'vitest';
import Spinner from './spinner';
import { render, screen } from '@testing-library/react';

describe('Spinner component', () => {
  test('should render correctly', async () => {
    // ARRANGE
    render(<Spinner />);
    // ACT
    await screen.findByLabelText('Ładowanie');
    // ASSERT
    expect(screen.getByLabelText('Ładowanie')).toBeInTheDocument();
  });
});
