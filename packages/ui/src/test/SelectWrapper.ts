import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const createSelectWrapper = (container: () => HTMLElement) => {
  const getButton = () => within(container()).getByRole('button');

  return {
    selected() {
      return getButton().textContent!.replace('✓', '').trim();
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
      const options = await screen.findAllByRole('option');
      const option = options.find(
        (el) => el.textContent!.replace('✓', '').trim() === optionName,
      )!;
      await userEvent.click(option);
    },

    isDisabled() {
      return getButton().hasAttribute('disabled');
    },
  };
};
