import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const createSelectWrapper = (
  container: () => HTMLElement,
  name: RegExp | string,
) => {
  const getButton = () => within(container()).getByRole('button', { name });

  const getListbox = () =>
    document.getElementById(getButton().getAttribute('aria-controls')!)!;

  const getOptions = () =>
    Array.from(getListbox().querySelectorAll('[role="option"]'));

  return {
    availableOptions() {
      return getOptions().map((option) =>
        option.textContent!.replace('✓', '').trim(),
      );
    },

    selected() {
      return getButton().textContent!.trim();
    },

    async select(optionName: string) {
      await userEvent.click(getButton());
      const option = getOptions().find(
        (el) => el.textContent!.replace('✓', '').trim() === optionName,
      )!;
      await userEvent.click(option);
    },

    isDisabled() {
      return getButton().hasAttribute('disabled');
    },
  };
};
