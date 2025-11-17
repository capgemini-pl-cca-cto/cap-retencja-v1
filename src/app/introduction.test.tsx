import { expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import Introduction from './introduction';

describe('Introduction component', () => {
  test('should render all content correctly', () => {
    // ARRANGE
    render(<Introduction />);

    // ACT & ASSERT
    expect(
      screen.getByRole('heading', { name: /kalkulator/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sprawdź, ile deszczu powinieneś retencjonować/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/więcej informacji o programie/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/niniejsze obliczenia i wynik/i),
    ).toBeInTheDocument();
  });

  test('should render external links with correct href attributes', () => {
    // ARRANGE
    render(<Introduction />);

    // ACT
    const links = screen.getAllByRole('link');

    // ASSERT
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      'href',
      'https://www.aquanet-retencja.pl/wp-content/uploads/2024/07/WYTYCZNE-DO-PROJEKTOWANIA-Wymagania-Ogolne.pdf',
    );
    expect(links[1]).toHaveAttribute(
      'href',
      'https://www.poznan.pl/mim/main/-,p,68775.html',
    );
  });
});
