import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { InwestycjaForm } from './inwestycja-form';
import { useInwestycjaStore } from '../stores/inwestycja-store';
import * as dzialkaParser from '../services/dzialka-parser';

// Mock the dzialka-parser module
vi.mock('../services/dzialka-parser', () => ({
  fetchDzialkaData: vi.fn(),
}));

// Mock react-leaflet to avoid map rendering issues in tests
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="mock-tile-layer" />,
  Polygon: () => <div data-testid="mock-polygon" />,
  Marker: () => <div data-testid="mock-marker" />,
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-popup">{children}</div>
  ),
  ZoomControl: () => <div data-testid="mock-zoom-control" />,
  useMap: () => ({
    setView: vi.fn(),
    fitBounds: vi.fn(),
  }),
  useMapEvents: () => ({}),
}));

describe('InwestycjaForm component', () => {
  const mockOnFormSubmit = vi.fn();
  const mockFetchDzialkaData = vi.mocked(dzialkaParser.fetchDzialkaData);

  const mockDzialkaData = {
    id: '123456_1.0001.1_1',
    voivodeship: 'Mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa',
    region: 'Region 1',
    parcel: '0001',
    centerCoordinates: { lat: 52.2297, lng: 21.0122 },
    polygonCoordinates: [
      [52.2297, 21.0122],
      [52.2298, 21.0123],
      [52.2299, 21.0124],
    ] as [number, number][],
  };

  beforeEach(() => {
    // Reset store before each test
    useInwestycjaStore.getState().reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render all form fields when form is not submitted', () => {
    // ARRANGE & ACT
    const { container } = render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    // ASSERT
    expect(
      container.querySelector('input[name="nazwaInwestycji"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('input[name="identyfikatorInwestycji"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /^jednorodzinna$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', {
        name: /wielorodzinna \/ usługowa \/ przemysłowa/i,
      }),
    ).toBeInTheDocument();
  });

  test('should display action buttons when form is not submitted', () => {
    // ARRANGE & ACT
    render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    // ASSERT
    expect(
      screen.getByRole('button', { name: /wyczyść dane/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /zatwierdź/i }),
    ).toBeInTheDocument();
  });

  test('should not display action buttons when form is submitted', () => {
    // ARRANGE & ACT
    render(
      <InwestycjaForm
        isInwestycjaSubmitted={true}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    // ASSERT
    expect(
      screen.queryByRole('button', { name: /wyczyść dane/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /zatwierdź/i }),
    ).not.toBeInTheDocument();
  });

  test('should show validation error when submitting empty form', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    const submitButton = screen.getByRole('button', { name: /zatwierdź/i });
    await user.click(submitButton);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText(/wpisz nazwę inwestycji!/i)).toBeInTheDocument();
    });
  });

  test('should show validation error for invalid identyfikator', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    const { container } = render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    const nazwaInput = container.querySelector(
      'input[name="nazwaInwestycji"]',
    )!;
    const identyfikatorInput = container.querySelector(
      'input[name="identyfikatorInwestycji"]',
    )!;
    const submitButton = screen.getByRole('button', { name: /zatwierdź/i });

    await user.type(nazwaInput, 'Test Investment');
    await user.type(identyfikatorInput, 'short');
    await user.click(submitButton);

    // ASSERT
    await waitFor(() => {
      expect(
        screen.getByText(
          /wpisz identyfikator działki lub wybierz działkę z mapy!/i,
        ),
      ).toBeInTheDocument();
    });
  });

  test('should successfully submit form with valid data', async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockFetchDzialkaData.mockResolvedValue(mockDzialkaData);

    // ACT
    const { container } = render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    const nazwaInput = container.querySelector(
      'input[name="nazwaInwestycji"]',
    )!;
    const identyfikatorInput = container.querySelector(
      'input[name="identyfikatorInwestycji"]',
    )!;
    const submitButton = screen.getByRole('button', { name: /zatwierdź/i });

    await user.type(nazwaInput, 'Test Investment');
    await user.type(identyfikatorInput, '123456_1.0001.1_1.0001');
    await user.click(submitButton);

    // ASSERT
    await waitFor(() => {
      expect(mockFetchDzialkaData).toHaveBeenCalledWith(
        '123456_1.0001.1_1.0001',
      );
      expect(mockOnFormSubmit).toHaveBeenCalled();
    });
  });

  test('should display loading state while submitting form', async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockFetchDzialkaData.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockDzialkaData), 100);
        }),
    );

    // ACT
    const { container } = render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    const nazwaInput = container.querySelector(
      'input[name="nazwaInwestycji"]',
    ) as HTMLInputElement;
    const identyfikatorInput = container.querySelector(
      'input[name="identyfikatorInwestycji"]',
    ) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /zatwierdź/i });

    await user.type(nazwaInput, 'Test Investment');
    await user.type(identyfikatorInput, '123456_1.0001.1_1.0001');
    await user.click(submitButton);

    // ASSERT
    expect(
      screen.getByRole('button', { name: /wyszukiwanie działki/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnFormSubmit).toHaveBeenCalled();
    });
  });

  test('should display error message when fetch fails', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const errorMessage = 'Brak działki dla identyfikatora';
    mockFetchDzialkaData.mockRejectedValue(new Error(errorMessage));

    // ACT
    const { container } = render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    const nazwaInput = container.querySelector(
      'input[name="nazwaInwestycji"]',
    ) as HTMLInputElement;
    const identyfikatorInput = container.querySelector(
      'input[name="identyfikatorInwestycji"]',
    ) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /zatwierdź/i });

    await user.type(nazwaInput, 'Test Investment');
    await user.type(identyfikatorInput, '123456_1.0001.1_1.0001');
    await user.click(submitButton);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockOnFormSubmit).not.toHaveBeenCalled();
    });
  });

  test('should clear form data when "Wyczyść dane" button is clicked', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    const { container } = render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    const nazwaInput = container.querySelector(
      'input[name="nazwaInwestycji"]',
    ) as HTMLInputElement;
    const identyfikatorInput = container.querySelector(
      'input[name="identyfikatorInwestycji"]',
    ) as HTMLInputElement;
    const clearButton = screen.getByRole('button', { name: /wyczyść dane/i });

    // Type some values
    await user.type(nazwaInput, 'Test Investment');
    await user.type(identyfikatorInput, '123456_1.0001.1_1.0001');

    expect(nazwaInput.value).toBe('Test Investment');
    expect(identyfikatorInput.value).toBe('123456_1.0001.1_1.0001');

    // Clear the form
    await user.click(clearButton);

    // ASSERT
    await waitFor(() => {
      expect(nazwaInput.value).toBe('');
      expect(identyfikatorInput.value).toBe('');
    });
  });

  test('should update store when form is submitted successfully', async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockFetchDzialkaData.mockResolvedValue(mockDzialkaData);

    // ACT
    const { container } = render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    const nazwaInput = container.querySelector(
      'input[name="nazwaInwestycji"]',
    ) as HTMLInputElement;
    const identyfikatorInput = container.querySelector(
      'input[name="identyfikatorInwestycji"]',
    ) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /zatwierdź/i });

    await user.type(nazwaInput, 'Test Investment');
    await user.type(identyfikatorInput, '123456_1.0001.1_1.0001');
    await user.click(submitButton);

    // ASSERT
    await waitFor(() => {
      const state = useInwestycjaStore.getState();
      expect(state.nazwaInwestycji).toBe('Test Investment');
      expect(state.identyfikatorInwestycji).toBe('123456_1.0001.1_1.0001');
      expect(state.daneDzialki).toEqual(mockDzialkaData);
    });
  });

  test('should render collapsible with identyfikator information', () => {
    // ARRANGE & ACT
    render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    // ASSERT
    expect(screen.getByText(/co składa się na/i)).toBeInTheDocument();
    // Check that button contains the text (it's in the button with strong tag)
    expect(
      screen.getByRole('button', {
        name: /co składa się na identyfikator działki/i,
      }),
    ).toBeInTheDocument();
  });

  test('should show Geoportal link in collapsible', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    // First need to open the collapsible
    const collapsibleButton = screen.getByRole('button', {
      name: /co składa się na identyfikator działki/i,
    });
    await user.click(collapsibleButton);

    // ASSERT
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /geoportal krajowy/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        'https://mapy.geoportal.gov.pl/imap/Imgp_2.html?gpmap=gp0',
      );
    });
  });

  test('should display PodgladLokalizacji when form is submitted', () => {
    // ARRANGE
    useInwestycjaStore.setState({
      daneDzialki: mockDzialkaData,
      isInwestycjaSubmitted: true,
    });

    // ACT
    render(
      <InwestycjaForm
        isInwestycjaSubmitted={true}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    // ASSERT - Check that Podglad Lokalizacji button/text is present
    expect(
      screen.getByText(/podgląd lokalizacji na mapie/i),
    ).toBeInTheDocument();
  });

  test('should allow selecting different typ zabudowy options', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    const jednorodzinnaOption = screen.getByRole('radio', {
      name: /^jednorodzinna$/i,
    });
    const wielorodzinnaOption = screen.getByRole('radio', {
      name: /wielorodzinna \/ usługowa \/ przemysłowa/i,
    });

    // ASSERT - Both options should be present
    expect(jednorodzinnaOption).toBeInTheDocument();
    expect(wielorodzinnaOption).toBeInTheDocument();

    // jednorodzinna should be checked by default
    expect(jednorodzinnaOption).toBeChecked();

    // Click wielorodzinna option
    await user.click(wielorodzinnaOption);

    // The wielorodzinna option should now be checked
    await waitFor(() => {
      expect(wielorodzinnaOption).toBeChecked();
      expect(jednorodzinnaOption).not.toBeChecked();
    });
  });

  test('should show kanalizacja deszczowa section for wielorodzinna', async () => {
    // ARRANGE
    const user = userEvent.setup();

    // ACT
    render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    // Select wielorodzinna to show kanalizacja section
    const wielorodzinnaOption = screen.getByRole('radio', {
      name: /wielorodzinna \/ usługowa \/ przemysłowa/i,
    });
    await user.click(wielorodzinnaOption);

    // ASSERT - Check for kanalizacja questions
    await waitFor(() => {
      expect(
        screen.getByText(
          /czy dana zabudowa ma zostać podłączona do miejskiej sieci kanalizacji deszczowej\?/i,
        ),
      ).toBeInTheDocument();
    });
  });

  test('should persist form values from store on mount', () => {
    // ARRANGE - Set some values in the store
    useInwestycjaStore.setState({
      nazwaInwestycji: 'Persisted Investment',
      identyfikatorInwestycji: '987654_2.0002.2_2.0002',
      typZabudowy: 'wielorodzinna',
    });

    // ACT
    const { container } = render(
      <InwestycjaForm
        isInwestycjaSubmitted={false}
        onFormSubmit={mockOnFormSubmit}
      />,
    );

    // ASSERT
    const nazwaInput = container.querySelector(
      'input[name="nazwaInwestycji"]',
    ) as HTMLInputElement;
    const identyfikatorInput = container.querySelector(
      'input[name="identyfikatorInwestycji"]',
    ) as HTMLInputElement;

    expect(nazwaInput.value).toBe('Persisted Investment');
    expect(identyfikatorInput.value).toBe('987654_2.0002.2_2.0002');

    // Check that wielorodzinna is selected
    const wielorodzinnaOption = screen.getByRole('radio', {
      name: /wielorodzinna \/ usługowa \/ przemysłowa/i,
    });
    expect(wielorodzinnaOption).toBeChecked();
  });
});
