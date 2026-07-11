import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const PlayerBarWrapper = {
  get isPlaying() {
    return screen.queryByTestId('player-pause-button') !== null;
  },

  nextButton: {
    get element() {
      return screen.getByTestId('player-next-button');
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
