import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from './Pagination';
import { PaginationLabels } from './types';

const pageRow = (): (string | null)[] =>
  screen
    .getAllByTestId('pagination-item')
    .map((element) => element.textContent);

const labels: PaginationLabels = {
  navigation: 'Pagination',
  previous: 'Previous page',
  next: 'Next page',
  page: (pageNumber) => `Page ${pageNumber}`,
};

describe('Pagination', () => {
  it('(Snapshot) renders a middle page with ellipses on both sides', () => {
    const { container } = render(
      <Pagination
        currentPage={12}
        totalPages={24}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the first page with previous disabled and the tail compressed', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={24}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(pageRow()).toEqual(['1', '2', '3', '4', '5', '…', '24']);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
  });

  it('renders the last page with next disabled and the head compressed', () => {
    render(
      <Pagination
        currentPage={24}
        totalPages={24}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(pageRow()).toEqual(['1', '…', '20', '21', '22', '23', '24']);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('renders all pages without ellipses when they fit', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(pageRow()).toEqual(['1', '2', '3', '4', '5']);
  });

  it('renders all pages when they fit even from the first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(pageRow()).toEqual(['1', '2', '3', '4', '5']);
  });

  it('renders all pages when they fit even from the last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(pageRow()).toEqual(['1', '2', '3', '4', '5']);
  });

  it('calls onPageChange with the page number when a page is clicked', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    const { getByRole } = render(
      <Pagination
        currentPage={12}
        totalPages={24}
        onPageChange={handlePageChange}
        labels={labels}
      />,
    );

    await user.click(getByRole('button', { name: 'Page 13' }));
    expect(handlePageChange).toHaveBeenCalledWith(13);

    await user.click(getByRole('button', { name: 'Page 24' }));
    expect(handlePageChange).toHaveBeenCalledWith(24);
  });

  it('moves one page back and forward via previous and next', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    const { getByRole } = render(
      <Pagination
        currentPage={12}
        totalPages={24}
        onPageChange={handlePageChange}
        labels={labels}
      />,
    );

    await user.click(getByRole('button', { name: 'Previous page' }));
    expect(handlePageChange).toHaveBeenCalledWith(11);

    await user.click(getByRole('button', { name: 'Next page' }));
    expect(handlePageChange).toHaveBeenCalledWith(13);
  });

  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
