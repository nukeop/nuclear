import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NuclearJamControls } from './NuclearJamControls';

const baseProps = {
  isPlaying: false,
  shuffleActive: false,
  repeatMode: 'off' as const,
  progress: 25,
  elapsedSeconds: 45,
  remainingSeconds: 135,
  onPlayPause: vi.fn(),
  onNext: vi.fn(),
  onPrevious: vi.fn(),
  onShuffleToggle: vi.fn(),
  onRepeatToggle: vi.fn(),
  onSeek: vi.fn(),
};

describe('NuclearJamControls', () => {
  it('(Snapshot) renders the controls', () => {
    const { container } = render(<NuclearJamControls {...baseProps} />);
    expect(container).toMatchSnapshot();
  });

  it('shows elapsed time and remaining time counting down', () => {
    render(<NuclearJamControls {...baseProps} />);

    expect(screen.getByText('0:45')).toBeInTheDocument();
    expect(screen.getByText('-2:15')).toBeInTheDocument();
  });

  it('shows the play button when paused', () => {
    render(<NuclearJamControls {...baseProps} isPlaying={false} />);

    expect(screen.getByTestId('jam-play-button')).toBeInTheDocument();
    expect(screen.queryByTestId('jam-pause-button')).not.toBeInTheDocument();
  });

  it('shows the pause button when playing', () => {
    render(<NuclearJamControls {...baseProps} isPlaying={true} />);

    expect(screen.getByTestId('jam-pause-button')).toBeInTheDocument();
    expect(screen.queryByTestId('jam-play-button')).not.toBeInTheDocument();
  });

  it('calls the transport callbacks when buttons are clicked', async () => {
    const user = userEvent.setup();
    const onPlayPause = vi.fn();
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    const onShuffleToggle = vi.fn();
    const onRepeatToggle = vi.fn();
    render(
      <NuclearJamControls
        {...baseProps}
        onPlayPause={onPlayPause}
        onNext={onNext}
        onPrevious={onPrevious}
        onShuffleToggle={onShuffleToggle}
        onRepeatToggle={onRepeatToggle}
      />,
    );

    await user.click(screen.getByTestId('jam-play-button'));
    expect(onPlayPause).toHaveBeenCalledOnce();
    await user.click(screen.getByTestId('jam-next-button'));
    expect(onNext).toHaveBeenCalledOnce();
    await user.click(screen.getByTestId('jam-previous-button'));
    expect(onPrevious).toHaveBeenCalledOnce();
    await user.click(screen.getByTestId('jam-shuffle-button'));
    expect(onShuffleToggle).toHaveBeenCalledOnce();
    await user.click(screen.getByTestId('jam-repeat-button'));
    expect(onRepeatToggle).toHaveBeenCalledOnce();
  });
});
