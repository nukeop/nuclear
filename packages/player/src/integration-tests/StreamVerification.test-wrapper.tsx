import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

const labelledButton = (container: HTMLElement, label: string) => ({
  async find() {
    const bar = await within(container).findByTestId('stream-verification');
    return within(bar).findByRole('button', { name: label });
  },
  async click() {
    await user.click(await this.find());
  },
});

export const createStreamVerificationWrapper = (container: HTMLElement) => ({
  get query() {
    return within(container).queryByTestId('stream-verification');
  },

  status: {
    async find(label: string) {
      const bar = await within(container).findByTestId('stream-verification');
      return within(bar).findByText(label);
    },
  },

  loader: {
    async find() {
      const bar = await within(container).findByTestId('stream-verification');
      return within(bar).findByTestId('stream-verification-loader');
    },
  },

  verifyButton: labelledButton(container, 'Verify'),
  unverifyButton: labelledButton(container, 'Unverify'),
  helpButton: labelledButton(container, 'How stream verification works'),

  explanation: {
    async learnMore() {
      await user.click(
        await screen.findByRole('button', { name: 'Learn more' }),
      );
    },
  },
});
