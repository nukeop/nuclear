import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const DialogWrapper = {
  get panel() {
    return screen.getByRole('dialog');
  },
  get queryPanel() {
    return screen.queryByRole('dialog');
  },
  isOpen() {
    return this.queryPanel !== null;
  },

  backdrop: {
    get element() {
      return screen.getByTestId('dialog-backdrop');
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  cancelButton: {
    get element() {
      return within(screen.getByRole('dialog')).getByTestId('dialog-close');
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  xButton: {
    get element() {
      return within(screen.getByRole('dialog')).getByTestId('dialog-x-close');
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  getByText(text: string) {
    return within(screen.getByRole('dialog')).getByText(text);
  },
  queryByText(text: string) {
    return within(screen.getByRole('dialog')).queryByText(text);
  },
};
