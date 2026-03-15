import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const createSelectWrapper = (container: () => HTMLElement) => {
  const getButton = () => within(container()).getByRole('button');

  return {
    selected() {
      return getButton().textContent!.trim();
    },

    async availableOptions() {
      await userEvent.click(getButton());
      const options = await screen.findAllByRole('option');
      const names = options.map((option) =>
        option.textContent!.replace('✓', '').trim(),
      );
      await userEvent.click(getButton());
      return names;
    },

    async select(optionName: string) {
      await userEvent.click(getButton());
      const option = await screen.findByRole('option', { name: optionName });
      await userEvent.click(option);
    },

    isDisabled() {
      return getButton().hasAttribute('disabled');
    },
  };
};
