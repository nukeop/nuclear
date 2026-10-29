import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const createCardWrapper = (index: number) => {
  const container = () => screen.getAllByTestId('card-container')[index];

  return {
    get element() {
      return within(container()).getByTestId('card');
    },
    get title() {
      return within(container()).getByTestId('card-title').textContent;
    },
    get playButton() {
      return within(container()).queryByTestId('card-play-button');
    },
    get isLoading() {
      return within(container()).queryByTestId('card-loading-bar') !== null;
    },
    async click() {
      await userEvent.click(this.element);
    },
    async play() {
      await userEvent.click(
        within(container()).getByTestId('card-play-button'),
      );
    },
    async openMenu() {
      await userEvent.click(
        within(container()).getByTestId('card-menu-button'),
      );
    },
  };
};
