import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';

export const LogsWrapper = {
  async mount(): Promise<RenderResult> {
    const component = render(<App />);
    await userEvent.click(
      await component.findByRole('button', { name: 'Preferences' }),
    );
    await userEvent.click(
      await component.findByRole('button', {
        name: 'Logs',
      }),
    );
    return component;
  },

  get searchInput() {
    return screen.getByRole('textbox', { name: /search logs/i });
  },

  exportButton: {
    get element() {
      return screen.getByRole('button', { name: /export/i });
    },
    async click() {
      await userEvent.click(this.element);
    },
  },

  openLogFolderButton: {
    get element() {
      return screen.getByRole('button', { name: /open log folder/i });
    },
    async click() {
      await userEvent.click(this.element);
    },
  },
};
