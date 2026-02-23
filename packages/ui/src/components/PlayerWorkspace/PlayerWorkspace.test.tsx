import { render, screen } from '@testing-library/react';

import { PlayerWorkspace } from './PlayerWorkspace';

describe('PlayerWorkspace', () => {
  it('(Snapshot) both sidebars expanded', () => {
    const { asFragment } = render(
      <PlayerWorkspace>
        <PlayerWorkspace.LeftSidebar
          width={200}
          isCollapsed={false}
          onWidthChange={() => {}}
          onToggle={() => {}}
        />
        <PlayerWorkspace.Main />
        <PlayerWorkspace.RightSidebar
          width={200}
          isCollapsed={false}
          onWidthChange={() => {}}
          onToggle={() => {}}
        />
      </PlayerWorkspace>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) both sidebars collapsed', () => {
    const { asFragment } = render(
      <PlayerWorkspace>
        <PlayerWorkspace.LeftSidebar
          width={200}
          isCollapsed={true}
          onWidthChange={() => {}}
          onToggle={() => {}}
        />
        <PlayerWorkspace.Main />
        <PlayerWorkspace.RightSidebar
          width={200}
          isCollapsed={true}
          onWidthChange={() => {}}
          onToggle={() => {}}
        />
      </PlayerWorkspace>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('shows persistent footer in both collapsed and expanded states', () => {
    const persistentFooter = (
      <span data-testid="persistent-footer">v1.0.0</span>
    );
    const sidebarProps = {
      width: 200,
      onWidthChange: () => {},
      onToggle: () => {},
      persistentFooter,
    };

    const { rerender } = render(
      <PlayerWorkspace>
        <PlayerWorkspace.LeftSidebar {...sidebarProps} isCollapsed={true} />
        <PlayerWorkspace.Main />
      </PlayerWorkspace>,
    );

    expect(screen.getByTestId('persistent-footer')).toBeInTheDocument();

    rerender(
      <PlayerWorkspace>
        <PlayerWorkspace.LeftSidebar {...sidebarProps} isCollapsed={false} />
        <PlayerWorkspace.Main />
      </PlayerWorkspace>,
    );

    expect(screen.getByTestId('persistent-footer')).toBeInTheDocument();
  });
});
