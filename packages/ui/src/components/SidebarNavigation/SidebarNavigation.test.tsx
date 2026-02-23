import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompassIcon, GaugeIcon, HeartIcon } from 'lucide-react';

import { SidebarNavigation } from './SidebarNavigation';
import { SidebarNavigationCollapsible } from './SidebarNavigationCollapsible';
import { SidebarNavigationItem } from './SidebarNavigationItem';

const renderSidebar = ({ isCompact = false } = {}) =>
  render(
    <SidebarNavigation isCompact={isCompact}>
      <SidebarNavigationCollapsible
        title="Explore"
        icon={<CompassIcon data-testid="section-icon" />}
      >
        <SidebarNavigationItem
          icon={<GaugeIcon data-testid="dashboard-icon" />}
          label="Dashboard"
        />
        <SidebarNavigationItem
          icon={<HeartIcon data-testid="favorites-icon" />}
          label="Favorites"
        />
      </SidebarNavigationCollapsible>
    </SidebarNavigation>,
  );

describe('SidebarNavigation compact mode', () => {
  it('(Snapshot) renders in compact mode', () => {
    const { asFragment } = renderSidebar({ isCompact: true });
    expect(asFragment()).toMatchSnapshot();
  });

  it('sets data-compact attribute on the root', () => {
    renderSidebar({ isCompact: true });
    expect(screen.getByTestId('sidebar-navigation')).toHaveAttribute(
      'data-compact',
    );
  });

  it('shows section icon', () => {
    renderSidebar({ isCompact: true });
    expect(screen.getByTestId('section-icon')).toBeInTheDocument();
  });

  it('shows item tooltips on hover', async () => {
    renderSidebar({ isCompact: true });

    const sectionButton = screen.getByRole('button');
    await userEvent.click(sectionButton);

    const items = await screen.findAllByTestId('sidebar-navigation-item');
    await userEvent.unhover(sectionButton);
    await userEvent.hover(items[0]);

    const tooltips = await screen.findAllByRole('tooltip');
    expect(
      tooltips.some((tooltip) => tooltip.textContent === 'Dashboard'),
    ).toBe(true);
  });
});

describe('SidebarNavigation normal mode', () => {
  it('(Snapshot) renders in normal mode', () => {
    const { asFragment } = renderSidebar();
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not set data-compact attribute', () => {
    renderSidebar();
    expect(screen.getByTestId('sidebar-navigation')).not.toHaveAttribute(
      'data-compact',
    );
  });

  it('shows text labels', () => {
    renderSidebar();

    const sectionButton = screen.getByRole('button');
    expect(sectionButton).toHaveTextContent('Explore');
  });

  it('does not show tooltips on hover', async () => {
    renderSidebar();

    const sectionButton = screen.getByRole('button');
    await userEvent.click(sectionButton);

    const items = await screen.findAllByTestId('sidebar-navigation-item');
    await userEvent.hover(items[0]);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
