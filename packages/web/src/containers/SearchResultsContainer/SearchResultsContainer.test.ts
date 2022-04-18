import { fireEvent, waitFor } from '@testing-library/react';
import { mountedAppFactory } from '../../test/testUtils';

describe('SearchResultsContainer', () => {
  it('renders the main page', () => {
    const { component } = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('performs a search', async () => {
    const { component, history } = mountComponent();
    const input = component.getByTestId('search-input');
    // Valid:
    fireEvent.change(input, {target: {value: 'search query'}});

    await waitFor(() => {
      expect(component.getByText(/Search results/i)).not.toBeNull();
    });
    expect(history.location.pathname).toBe('/search/search%20query');
  });

  const mountComponent = mountedAppFactory(['/']);
});
