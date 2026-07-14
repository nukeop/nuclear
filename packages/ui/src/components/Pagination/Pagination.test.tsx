import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from './Pagination';
import { PaginationLabels } from './types';

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

  it('(Snapshot) renders the first page with previous disabled and the tail compressed', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={24}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders the last page with next disabled and the head compressed', () => {
    const { container } = render(
      <Pagination
        currentPage={24}
        totalPages={24}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders all pages without ellipses when they fit', () => {
    const { container } = render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={vi.fn()}
        labels={labels}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
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
