import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TitleBar } from './TitleBar';

const mockLabels = {
  minimize: 'Minimize',
  maximize: 'Maximize',
  close: 'Close',
};

describe('TitleBar', () => {
  it('(Snapshot) renders Mac variant', () => {
    const { container } = render(
      <TitleBar
        title="Nuclear"
        styleOverride="macos"
        onMinimize={vi.fn()}
        onMaximize={vi.fn()}
        onClose={vi.fn()}
        labels={mockLabels}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders Windows variant', () => {
    const { container } = render(
      <TitleBar
        title="Nuclear"
        styleOverride="windows"
        onMinimize={vi.fn()}
        onMaximize={vi.fn()}
        onClose={vi.fn()}
        labels={mockLabels}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays the title', () => {
    render(
      <TitleBar
        title="Nuclear Music Player"
        styleOverride="windows"
        onMinimize={vi.fn()}
        onMaximize={vi.fn()}
        onClose={vi.fn()}
        labels={mockLabels}
      />,
    );
    expect(screen.getByText('Nuclear Music Player')).toBeInTheDocument();
  });

  it('calls onMinimize when minimize button is clicked', async () => {
    const onMinimize = vi.fn();
    render(
      <TitleBar
        title="Nuclear"
        styleOverride="windows"
        onMinimize={onMinimize}
        onMaximize={vi.fn()}
        onClose={vi.fn()}
        labels={mockLabels}
      />,
    );
    await userEvent.click(screen.getByTitle(mockLabels.minimize));
    expect(onMinimize).toHaveBeenCalled();
  });

  it('calls onMaximize when maximize button is clicked', async () => {
    const onMaximize = vi.fn();
    render(
      <TitleBar
        title="Nuclear"
        styleOverride="windows"
        onMinimize={vi.fn()}
        onMaximize={onMaximize}
        onClose={vi.fn()}
        labels={mockLabels}
      />,
    );
    await userEvent.click(screen.getByTitle(mockLabels.maximize));
    expect(onMaximize).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <TitleBar
        title="Nuclear"
        styleOverride="windows"
        onMinimize={vi.fn()}
        onMaximize={vi.fn()}
        onClose={onClose}
        labels={mockLabels}
      />,
    );
    await userEvent.click(screen.getByTitle(mockLabels.close));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onStartDrag on mousedown on the drag area', async () => {
    const onStartDrag = vi.fn();
    render(
      <TitleBar
        title="Nuclear"
        styleOverride="windows"
        onMinimize={vi.fn()}
        onMaximize={vi.fn()}
        onClose={vi.fn()}
        onStartDrag={onStartDrag}
        labels={mockLabels}
      />,
    );

    fireEvent.mouseDown(screen.getByTestId('title-bar'), {
      buttons: 1,
      detail: 1,
    });
    expect(onStartDrag).toHaveBeenCalled();
  });
});
