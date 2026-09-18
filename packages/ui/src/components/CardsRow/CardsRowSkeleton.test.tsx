import { CardsRowWrapper as Wrapper } from './CardsRow.test-wrapper';

describe('CardsRow.Skeleton', () => {
  it('(Snapshot) renders correctly with title and badge', () => {
    const { container } = Wrapper.mountSkeleton({
      title: 'Top Albums',
      badge: 'Acme Music',
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders correctly without a title', () => {
    const { container } = Wrapper.mountSkeleton();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the given number of card skeletons and shows the title', () => {
    Wrapper.mountSkeleton({ title: 'Top Albums', count: 4 });

    expect(Wrapper.skeletonCards).toHaveLength(4);
    expect(Wrapper.skeletonTitle).toHaveTextContent('Top Albums');
  });
});
