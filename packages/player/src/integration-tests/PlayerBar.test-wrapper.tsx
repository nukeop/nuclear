import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const PlayerBarWrapper = {
  get isPlaying() {
    return screen.queryByTestId('player-pause-button') !== null;
  },

  get nowPlayingTitle() {
    return screen.getByTestId('now-playing-title').textContent;
  },

  previousButton: {
    get element() {
      return screen.getByTestId('player-previous-button');
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  shuffleButton: {
    get element() {
      return screen.getByTestId('player-shuffle-button');
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  nextButton: {
    get element() {
      return screen.getByTestId('player-next-button');
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  pauseButton: {
    get element() {
      return screen.getByTestId('player-pause-button');
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  playButton: {
    get element() {
      return screen.getByTestId('player-play-button');
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  repeatButton: {
    get element() {
      return screen.getByTestId('player-repeat-button');
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  seekBar: {
    get element() {
      return screen.getByTestId('player-seek-bar');
    },
    async clickAtPercent(percent: number) {
      const element = this.element;
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(
        DOMRect.fromRect({ x: 0, y: 0, width: 100, height: 16 }),
      );
      await userEvent.pointer({
        keys: '[MouseLeft]',
        target: element,
        coords: { x: percent, y: 8, clientX: percent, clientY: 8 },
      });
    },
  },
};
