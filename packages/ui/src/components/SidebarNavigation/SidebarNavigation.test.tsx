import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GaugeIcon, HeartIcon } from 'lucide-react';

import { SidebarNavigation } from './SidebarNavigation';
import { SidebarNavigationItem } from './SidebarNavigationItem';

const renderSidebar = ({ isCompact = false } = {}) =>
  render(
    <SidebarNavigation isCompact={isCompact}>
      <SidebarNavigationItem
        icon={<GaugeIcon data-testid="dashboard-icon" />}
        label="Dashboard"
      />
      <SidebarNavigationItem
        icon={<HeartIcon data-testid="favorites-icon" />}
        label="Favorites"
      />
    </SidebarNavigation>,
  );

describe('SidebarNavigation', () => {
  it('(Snapshot) renders flat nav items in normal mode', () => {
    const { asFragment } = renderSidebar();
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) renders flat nav items in compact mode', () => {
    const { asFragment } = renderSidebar({ isCompact: true });
    expect(asFragment()).toMatchSnapshot();
  });

  it('sets data-testid on root element', () => {
    renderSidebar();
    expect(screen.getByTestId('sidebar-navigation')).toBeInTheDocument();
  });

  it('shows text labels in normal mode', () => {
    renderSidebar();
    expect(screen.getByText('Dashboard')).toBeVisible();
    expect(screen.getByText('Favorites')).toBeVisible();
  });

  it('hides text labels in compact mode', () => {
    renderSidebar({ isCompact: true });
    expect(screen.getByText('Dashboard')).toHaveClass('opacity-0');
    expect(screen.getByText('Favorites')).toHaveClass('opacity-0');
  });

  it('shows tooltips on hover in compact mode', async () => {
    renderSidebar({ isCompact: true });

    const items = screen.getAllByTestId('sidebar-navigation-item');
    await userEvent.hover(items[0]);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Dashboard');
  });

  it('does not show tooltips in normal mode', async () => {
    renderSidebar();

    const items = screen.getAllByTestId('sidebar-navigation-item');
    await userEvent.hover(items[0]);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
